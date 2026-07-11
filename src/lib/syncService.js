/** @format */
/**
 * SyncService — Bidirectional sync between Dexie (local) and Supabase (cloud).
 *
 * Key principles:
 * - Local-first: always write to Dexie immediately (source of truth)
 * - Push first, then pull (local changes take priority)
 * - Pull is incremental: only fetch records updated since last sync
 * - Pending-local protection: never overwrite a local record that has pending outbox entries
 * - Push response handler: store cloud UUID back to Dexie as cloudId
 */

import { supabase } from "./supabase";
import { db, getSetting, setSetting } from "../database/index.js";
import { getAccessToken, getUser } from "./auth";
import { isOnline, waitForOnline } from "./offline";

const ENTITY_HANDLERS = {};
const LAST_SYNC_PREFIX = "lastSync_";
const LAST_GLOBAL_SYNC = "lastGlobalSync";

export function registerEntityHandler(entityType, handler) {
  ENTITY_HANDLERS[entityType] = handler;
}

async function getEntityHandler(entityType) {
  return ENTITY_HANDLERS[entityType] || null;
}

export async function pushToOutbox({ entityType, operationType, payload }) {
  const user = getUser();
  const clientId = crypto.randomUUID();
  const now = new Date().toISOString();

  let localId = null;
  if (payload?.id) {
    localId = payload.id;
  }

  await db.syncQueue.add({
    entityType,
    operationType,
    payload,
    localId,
    clientId,
    userId: user?.id,
    cooperativeId: user?.cooperativeId,
    status: "pending",
    attemptCount: 0,
    createdAt: now,
    lastError: null,
  });
  return clientId;
}

export async function syncOutbox() {
  if (!isOnline()) return { pushed: 0, failed: 0 };

  const token = getAccessToken();
  if (!token || !supabase) return { pushed: 0, failed: 0 };

  const pending = await db.syncQueue
    .where("status")
    .equals("pending")
    .limit(50)
    .toArray();

  if (pending.length === 0) return { pushed: 0, failed: 0 };

  let pushed = 0;
  let failed = 0;

  for (const item of pending) {
    try {
      await db.syncQueue.update(item.id, { status: "syncing" });

      const handler = await getEntityHandler(item.entityType);
      let cloudId = null;

      if (handler) {
        cloudId = await handler({ item, token });
      } else {
        cloudId = await syncGenericEntity(item, token);
      }

      await db.syncQueue.update(item.id, { status: "synced" });

      if (cloudId && item.localId) {
        await linkCloudId(item.entityType, item.localId, cloudId);
      }

      pushed++;
    } catch (err) {
      console.error(`[Sync] Failed to push item ${item.id}:`, err.message);
      const newAttemptCount = (item.attemptCount || 0) + 1;
      await db.syncQueue.update(item.id, {
        status: newAttemptCount >= 3 ? "failed" : "pending",
        lastError: err.message,
        attemptCount: newAttemptCount,
      });
      failed++;
    }
  }

  return { pushed, failed };
}

async function linkCloudId(entityType, localId, cloudId) {
  try {
    const tableMap = {
      members: db.members,
      cooperatives: db.cooperatives,
      loans: db.loans,
      savings: db.savings,
      products: db.products,
      inventory: db.inventory,
      transactions: db.transactions,
      notifications: db.notifications,
      tasks: db.tasks,
    };
    const table = tableMap[entityType];
    if (table) {
      await table.update(localId, {
        cloudId,
        syncedAt: new Date().toISOString(),
      });
    }
  } catch (e) {
    console.warn("[Sync] linkCloudId failed:", e.message);
  }
}

async function syncGenericEntity(item, token) {
  const { entityType, operationType, payload, clientId } = item;
  const tableMap = {
    members: "member",
    cooperatives: "cooperative",
    loans: "loan",
    savings: "savings_account",
    products: "product",
    inventory: "stock",
    transactions: "sale",
    notifications: "notification",
    tasks: "task",
  };

  const tableName = tableMap[entityType] || entityType;

  if (operationType === "create") {
    const insertPayload = {
      ...payload,
      client_id: clientId,
    };
    delete insertPayload.id;
    delete insertPayload.cloudId;
    delete insertPayload.syncedAt;
    delete insertPayload.localId;

    const { data, error } = await supabase
      .from(tableName)
      .insert(insertPayload)
      .select("id")
      .single();

    if (error) throw new Error(error.message);
    return data?.id || null;
  }

  if (operationType === "update") {
    const { error } = await supabase
      .from(tableName)
      .update(payload)
      .eq("client_id", clientId);

    if (error) throw new Error(error.message);
    return null;
  }

  if (operationType === "delete") {
    const { error } = await supabase
      .from(tableName)
      .delete()
      .eq("client_id", clientId);

    if (error) throw new Error(error.message);
    return null;
  }

  return null;
}

async function getLastSyncTime(entityType) {
  return await getSetting(LAST_SYNC_PREFIX + entityType);
}

async function setLastSyncTime(entityType, time) {
  await setSetting(LAST_SYNC_PREFIX + entityType, time);
}

export async function getLastGlobalSync() {
  return await getSetting(LAST_GLOBAL_SYNC);
}

export async function setLastGlobalSync(time = new Date().toISOString()) {
  await setSetting(LAST_GLOBAL_SYNC, time);
}

export async function pullIncremental(token) {
  if (!isOnline() || !token || !supabase) return { pulled: 0, skipped: 0 };
  const user = getUser();
  if (!user) return { pulled: 0, skipped: 0 };

  const entities = [
    { type: "cooperatives", fn: () => pullCooperativeData(token, user.cooperativeId) },
    { type: "members", fn: () => pullMembers(token, user.cooperativeId) },
    { type: "products", fn: () => pullProducts(token, user.cooperativeId) },
    { type: "savings", fn: () => pullSavingsAccounts(token, user.cooperativeId) },
    { type: "loans", fn: () => pullLoans(token, user.cooperativeId) },
    { type: "transactions", fn: () => pullTransactions(token, user.cooperativeId) },
    { type: "tasks", fn: () => pullTasks(token) },
    { type: "notifications", fn: () => pullNotifications(token) },
  ];

  let totalPulled = 0;
  for (const { type, fn } of entities) {
    try {
      const count = await fn();
      totalPulled += count;
    } catch (e) {
      console.warn(`[Sync] pull ${type} failed:`, e.message);
    }
  }
  return { pulled: totalPulled };
}

async function pullCooperativeData(token, cooperativeId) {
  if (!cooperativeId) return 0;
  const lastSync = await getLastSyncTime("cooperatives");

  let query = supabase
    .from("cooperative")
    .select("*")
    .eq("id", cooperativeId)
    .single();

  const { data, error } = await query;
  if (error || !data) return 0;

  const hasPending = await hasPendingOutbox("cooperatives", data.id);
  if (hasPending) return 0;

  await db.cooperatives.put({
    id: data.id,
    name: data.name,
    address: data.address,
    phone: data.phone,
    nib: data.nib,
    skahu: data.skahu,
    status: data.status,
    cloudId: data.id,
    syncedAt: new Date().toISOString(),
  });

  await setLastSyncTime("cooperatives", new Date().toISOString());
  return 1;
}

async function pullMembers(token, cooperativeId) {
  if (!cooperativeId) return 0;
  const lastSync = await getLastSyncTime("members");

  let query = supabase
    .from("member")
    .select("*")
    .eq("cooperative_id", cooperativeId);

  if (lastSync) {
    query = query.gt("updated_at", lastSync);
  }

  const { data, error } = await query;
  if (error || !data?.length) return 0;

  let count = 0;
  for (const m of data) {
    const hasPending = await hasPendingOutbox("members", m.id);
    if (hasPending) continue;

    await db.members.put({
      id: m.id,
      cooperativeId: m.cooperative_id,
      memberNumber: m.member_number,
      nik: m.nik,
      name: m.name,
      phone: m.phone,
      address: m.address,
      status: m.status,
      joinDate: m.join_date,
      cloudId: m.id,
      syncedAt: new Date().toISOString(),
    });
    count++;
  }

  if (data.length > 0) {
    await setLastSyncTime("members", new Date().toISOString());
  }
  return count;
}

async function pullProducts(token, cooperativeId) {
  if (!cooperativeId) return 0;
  const lastSync = await getLastSyncTime("products");

  let query = supabase
    .from("product")
    .select("*")
    .eq("cooperative_id", cooperativeId);

  if (lastSync) {
    query = query.gt("updated_at", lastSync);
  }

  const { data, error } = await query;
  if (error || !data?.length) return 0;

  let count = 0;
  for (const p of data) {
    const hasPending = await hasPendingOutbox("products", p.id);
    if (hasPending) continue;

    await db.products.put({
      id: p.id,
      cooperativeId: p.cooperative_id,
      category: p.category,
      name: p.name,
      unit: p.unit,
      purchasePrice: p.purchase_price,
      salePrice: p.sale_price,
      barcode: p.barcode,
      minimumStock: p.minimum_stock,
      cloudId: p.id,
      syncedAt: new Date().toISOString(),
    });
    count++;
  }

  if (data.length > 0) {
    await setLastSyncTime("products", new Date().toISOString());
  }
  return count;
}

async function pullSavingsAccounts(token, cooperativeId) {
  if (!cooperativeId) return 0;
  const lastSync = await getLastSyncTime("savings");

  let query = supabase
    .from("savings_account")
    .select("*, savings_mutation(id, type, amount, receipt_number, description, transaction_date)")
    .eq("member.cooperative_id", cooperativeId);

  if (lastSync) {
    query = query.gt("updated_at", lastSync);
  }

  const { data, error } = await query;
  if (error || !data?.length) return 0;

  let count = 0;
  for (const s of data) {
    const hasPending = await hasPendingOutbox("savings", s.id);
    if (hasPending) continue;

    await db.savings.put({
      id: s.id,
      memberId: s.member_id,
      type: s.type,
      status: s.status,
      openedAt: s.opened_at,
      cloudId: s.id,
      syncedAt: new Date().toISOString(),
    });
    count++;
  }

  if (data.length > 0) {
    await setLastSyncTime("savings", new Date().toISOString());
  }
  return count;
}

async function pullLoans(token, cooperativeId) {
  if (!cooperativeId) return 0;
  const lastSync = await getLastSyncTime("loans");

  let query = supabase
    .from("loan")
    .select("*, installment_schedule(id, installment_number, due_date, amount_due, amount_paid, status)")
    .eq("member.cooperative_id", cooperativeId);

  if (lastSync) {
    query = query.gt("updated_at", lastSync);
  }

  const { data, error } = await query;
  if (error || !data?.length) return 0;

  let count = 0;
  for (const l of data) {
    const hasPending = await hasPendingOutbox("loans", l.id);
    if (hasPending) continue;

    await db.loans.put({
      id: l.id,
      memberId: l.member_id,
      principal: l.principal,
      interestRate: l.interest_rate,
      tenorMonths: l.tenor_months,
      disbursementDate: l.disbursement_date,
      status: l.status,
      approvedBy: l.approved_by,
      approvedAt: l.approved_at,
      notes: l.notes,
      cloudId: l.id,
      syncedAt: new Date().toISOString(),
    });
    count++;
  }

  if (data.length > 0) {
    await setLastSyncTime("loans", new Date().toISOString());
  }
  return count;
}

async function pullTransactions(token, cooperativeId) {
  if (!cooperativeId) return 0;
  const lastSync = await getLastSyncTime("transactions");

  let query = supabase
    .from("sale")
    .select("*, sale_item(*)")
    .eq("cooperative_id", cooperativeId)
    .order("date", { ascending: false })
    .limit(100);

  if (lastSync) {
    query = query.gt("updated_at", lastSync);
  }

  const { data, error } = await query;
  if (error || !data?.length) return 0;

  let count = 0;
  for (const t of data) {
    const hasPending = await hasPendingOutbox("transactions", t.id);
    if (hasPending) continue;

    await db.transactions.put({
      id: t.id,
      cooperativeId: t.cooperative_id,
      cashierId: t.cashier_id,
      date: t.date,
      totalAmount: t.total_amount,
      paymentMethod: t.payment_method,
      status: t.status,
      cloudId: t.id,
      syncedAt: new Date().toISOString(),
    });
    count++;
  }

  if (data.length > 0) {
    await setLastSyncTime("transactions", new Date().toISOString());
  }
  return count;
}

async function pullTasks(token) {
  const lastSync = await getLastSyncTime("tasks");

  let query = supabase
    .from("task")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  if (lastSync) {
    query = query.gt("updated_at", lastSync);
  }

  const { data, error } = await query;
  if (error || !data?.length) return 0;

  let count = 0;
  for (const t of data) {
    const hasPending = await hasPendingOutbox("tasks", t.id);
    if (hasPending) continue;

    await db.tasks.put({
      id: t.id,
      label: t.label || t.title,
      dueDate: t.due_date,
      status: t.status,
      done: t.done || false,
      createdAt: t.created_at,
      cloudId: t.id,
      syncedAt: new Date().toISOString(),
    });
    count++;
  }

  if (data.length > 0) {
    await setLastSyncTime("tasks", new Date().toISOString());
  }
  return count;
}

async function pullNotifications(token) {
  const user = getUser();
  if (!user) return 0;
  const lastSync = await getLastSyncTime("notifications");

  let query = supabase
    .from("notification")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  if (lastSync) {
    query = query.gt("updated_at", lastSync);
  }

  const { data, error } = await query;
  if (error || !data?.length) return 0;

  let count = 0;
  for (const n of data) {
    await db.notifications.put({
      id: n.id,
      type: n.type,
      title: n.payload?.title,
      message: n.payload?.message,
      read: !!n.read_at,
      createdAt: n.created_at,
      cloudId: n.id,
      syncedAt: new Date().toISOString(),
    });
    count++;
  }

  if (data.length > 0) {
    await setLastSyncTime("notifications", new Date().toISOString());
  }
  return count;
}

async function hasPendingOutbox(entityType, cloudId) {
  const pending = await db.syncQueue
    .where({ entityType, status: "pending" })
    .first();
  return !!pending;
}

export async function pullAllModules(token) {
  if (!isOnline() || !token || !supabase) return { pulled: 0 };
  const user = getUser();
  if (!user) return { pulled: 0 };

  const entities = [
    { type: "cooperatives", fn: () => pullCooperativeDataFull(token, user.cooperativeId) },
    { type: "members", fn: () => pullMembersFull(token, user.cooperativeId) },
    { type: "products", fn: () => pullProductsFull(token, user.cooperativeId) },
    { type: "savings", fn: () => pullSavingsAccountsFull(token, user.cooperativeId) },
    { type: "loans", fn: () => pullLoansFull(token, user.cooperativeId) },
    { type: "transactions", fn: () => pullTransactionsFull(token, user.cooperativeId) },
    { type: "tasks", fn: () => pullTasksFull(token) },
    { type: "notifications", fn: () => pullNotificationsFull(token) },
  ];

  let totalPulled = 0;
  for (const { type, fn } of entities) {
    try {
      const count = await fn();
      totalPulled += count;
    } catch (e) {
      console.warn(`[Sync] full pull ${type} failed:`, e.message);
    }
  }
  return { pulled: totalPulled };
}

async function pullCooperativeDataFull(token, cooperativeId) {
  if (!cooperativeId) return 0;
  const { data, error } = await supabase
    .from("cooperative")
    .select("*")
    .eq("id", cooperativeId)
    .single();
  if (error || !data) return 0;
  await db.cooperatives.put({
    id: data.id,
    name: data.name,
    address: data.address,
    phone: data.phone,
    nib: data.nib,
    skahu: data.skahu,
    status: data.status,
    cloudId: data.id,
    syncedAt: new Date().toISOString(),
  });
  await setLastSyncTime("cooperatives", new Date().toISOString());
  return 1;
}

async function pullMembersFull(token, cooperativeId) {
  if (!cooperativeId) return 0;
  const { data, error } = await supabase
    .from("member")
    .select("*")
    .eq("cooperative_id", cooperativeId);
  if (error || !data?.length) return 0;
  await db.members.bulkPut(
    data.map((m) => ({
      id: m.id,
      cooperativeId: m.cooperative_id,
      memberNumber: m.member_number,
      nik: m.nik,
      name: m.name,
      phone: m.phone,
      address: m.address,
      status: m.status,
      joinDate: m.join_date,
      cloudId: m.id,
      syncedAt: new Date().toISOString(),
    }))
  );
  await setLastSyncTime("members", new Date().toISOString());
  return data.length;
}

async function pullProductsFull(token, cooperativeId) {
  if (!cooperativeId) return 0;
  const { data, error } = await supabase
    .from("product")
    .select("*")
    .eq("cooperative_id", cooperativeId);
  if (error || !data?.length) return 0;
  await db.products.bulkPut(
    data.map((p) => ({
      id: p.id,
      cooperativeId: p.cooperative_id,
      category: p.category,
      name: p.name,
      unit: p.unit,
      purchasePrice: p.purchase_price,
      salePrice: p.sale_price,
      barcode: p.barcode,
      minimumStock: p.minimum_stock,
      cloudId: p.id,
      syncedAt: new Date().toISOString(),
    }))
  );
  await setLastSyncTime("products", new Date().toISOString());
  return data.length;
}

async function pullSavingsAccountsFull(token, cooperativeId) {
  if (!cooperativeId) return 0;
  const { data, error } = await supabase
    .from("savings_account")
    .select("*, savings_mutation(*)")
    .eq("member.cooperative_id", cooperativeId);
  if (error || !data?.length) return 0;
  await db.savings.bulkPut(
    data.map((s) => ({
      id: s.id,
      memberId: s.member_id,
      type: s.type,
      status: s.status,
      openedAt: s.opened_at,
      cloudId: s.id,
      syncedAt: new Date().toISOString(),
    }))
  );
  await setLastSyncTime("savings", new Date().toISOString());
  return data.length;
}

async function pullLoansFull(token, cooperativeId) {
  if (!cooperativeId) return 0;
  const { data, error } = await supabase
    .from("loan")
    .select("*, installment_schedule(*)")
    .eq("member.cooperative_id", cooperativeId);
  if (error || !data?.length) return 0;
  await db.loans.bulkPut(
    data.map((l) => ({
      id: l.id,
      memberId: l.member_id,
      principal: l.principal,
      interestRate: l.interest_rate,
      tenorMonths: l.tenor_months,
      disbursementDate: l.disbursement_date,
      status: l.status,
      approvedBy: l.approved_by,
      approvedAt: l.approved_at,
      notes: l.notes,
      cloudId: l.id,
      syncedAt: new Date().toISOString(),
    }))
  );
  await setLastSyncTime("loans", new Date().toISOString());
  return data.length;
}

async function pullTransactionsFull(token, cooperativeId) {
  if (!cooperativeId) return 0;
  const { data, error } = await supabase
    .from("sale")
    .select("*, sale_item(*)")
    .eq("cooperative_id", cooperativeId)
    .order("date", { ascending: false })
    .limit(100);
  if (error || !data?.length) return 0;
  await db.transactions.bulkPut(
    data.map((t) => ({
      id: t.id,
      cooperativeId: t.cooperative_id,
      cashierId: t.cashier_id,
      date: t.date,
      totalAmount: t.total_amount,
      paymentMethod: t.payment_method,
      status: t.status,
      cloudId: t.id,
      syncedAt: new Date().toISOString(),
    }))
  );
  await setLastSyncTime("transactions", new Date().toISOString());
  return data.length;
}

async function pullTasksFull(token) {
  const { data, error } = await supabase
    .from("task")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);
  if (error || !data?.length) return 0;
  await db.tasks.bulkPut(
    data.map((t) => ({
      id: t.id,
      label: t.label || t.title,
      dueDate: t.due_date,
      status: t.status,
      done: t.done || false,
      createdAt: t.created_at,
      cloudId: t.id,
      syncedAt: new Date().toISOString(),
    }))
  );
  await setLastSyncTime("tasks", new Date().toISOString());
  return data.length;
}

async function pullNotificationsFull(token) {
  const user = getUser();
  if (!user) return 0;
  const { data, error } = await supabase
    .from("notification")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);
  if (error || !data?.length) return 0;
  await db.notifications.bulkPut(
    data.map((n) => ({
      id: n.id,
      type: n.type,
      title: n.payload?.title,
      message: n.payload?.message,
      read: !!n.read_at,
      createdAt: n.created_at,
      cloudId: n.id,
      syncedAt: new Date().toISOString(),
    }))
  );
  await setLastSyncTime("notifications", new Date().toISOString());
  return data.length;
}

let syncInterval = null;

export function startAutoSync(intervalMs = 30000) {
  if (syncInterval) return;
  syncInterval = setInterval(async () => {
    if (!isOnline()) return;
    const token = getAccessToken();
    if (!token) return;
    try {
      const { pushed, failed } = await syncOutbox();
      if (pushed > 0 || failed > 0) {
        console.log(`[Sync] Outbox: ${pushed} pushed, ${failed} failed`);
      }
      await pullIncremental(token);
      await setLastGlobalSync();
    } catch (e) {
      console.warn("[Sync] AutoSync error:", e.message);
    }
  }, intervalMs);
}

export function stopAutoSync() {
  if (syncInterval) {
    clearInterval(syncInterval);
    syncInterval = null;
  }
}

export async function fullSync() {
  if (!isOnline()) return { success: false, reason: "offline" };
  await waitForOnline();
  const token = getAccessToken();
  if (!token) return { success: false, reason: "no_token" };

  const { pushed, failed } = await syncOutbox();
  const { pulled } = await pullAllModules(token);
  await setLastGlobalSync();
  return { success: failed === 0, pushed, pulled, failed };
}

export async function getSyncStatus() {
  const pending = await db.syncQueue.where("status").anyOf(["pending", "syncing"]).count();
  const failed = await db.syncQueue.where("status").equals("failed").count();
  return { pending, failed };
}
