/** @format */
/**
 * useDashboardData — central hook for dashboard real data from Dexie.
 * Falls back to 0/empty gracefully so the UI always renders.
 */

import { useState, useEffect, useCallback } from "react";
import { db } from "../database/index.js";

function formatCurrency(num) {
  if (num >= 1000000000) return (num / 1000000000).toFixed(1).replace(".0", "") + " M";
  if (num >= 1000000) return (num / 1000000).toFixed(1).replace(".0", "") + " Jt";
  if (num >= 1000) return (num / 1000).toFixed(0) + " Rb";
  return num.toLocaleString("id-ID");
}

export function useDashboardData() {
  const [data, setData] = useState({
    stats: {
      totalMembers: 0,
      activeLoans: 0,
      todayTransactions: 0,
      totalRevenue: 0,
    },
    members: [],
    transactions: [],
    notifications: [],
    activityLogs: [],
    syncQueue: { pending: 0 },
    loading: true,
  });

  const load = useCallback(async () => {
    try {
      const [
        allMembers,
        allLoans,
        allTransactions,
        allNotifications,
        allActivityLogs,
        allSyncQueue,
        allProducts,
      ] = await Promise.allSettled([
        db.members.toArray(),
        db.loans.toArray(),
        db.transactions.toArray(),
        db.notifications.toArray(),
        db.activityLogs.toArray(),
        db.syncQueue.toArray(),
        db.products.toArray(),
      ]);

      const members = allMembers.status === "fulfilled" ? allMembers.value : [];
      const loans = allLoans.status === "fulfilled" ? allLoans.value : [];
      const transactions = allTransactions.status === "fulfilled" ? allTransactions.value : [];
      const notifications = allNotifications.status === "fulfilled" ? allNotifications.value : [];
      const activityLogs = allActivityLogs.status === "fulfilled" ? allActivityLogs.value : [];
      const syncQueue = allSyncQueue.status === "fulfilled" ? allSyncQueue.value : [];
      const products = allProducts.status === "fulfilled" ? allProducts.value : [];

      const today = new Date().toDateString();
      const todayTx = transactions.filter(
        (t) => new Date(t.date || t.createdAt).toDateString() === today
      );

      const activeLoans = loans.filter((l) => l.status === "active" || l.status === "approved");
      const pendingSync = syncQueue.filter((s) => s.status === "pending" || s.status === "syncing");

      const totalRevenue = transactions.reduce((sum, t) => sum + (t.totalAmount || 0), 0);

      const recentTx = [...transactions]
        .sort((a, b) => {
          const da = new Date(a.date || a.createdAt || 0);
          const db2 = new Date(b.date || b.createdAt || 0);
          return db2 - da;
        })
        .slice(0, 10)
        .map((t) => ({
          id: t.id,
          name: t.description || t.name || "Transaksi",
          type: t.type || "Lainnya",
          amount: t.totalAmount || t.amount || 0,
          amountFormatted: "Rp " + formatCurrency(t.totalAmount || t.amount || 0),
          status: t.status === "synced" || t.syncStatus === "synced" ? "Berhasil" : "Tertunda",
          date: new Date(t.date || t.createdAt).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
        }));

      const recentNotifs = notifications
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5)
        .map((n) => ({
          id: n.id,
          type: n.type || "info",
          title: n.title || "Notifikasi",
          message: n.message || "",
          read: n.read || false,
          time: timeAgo(new Date(n.createdAt)),
        }));

      const recentActivities = activityLogs
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 6)
        .map((a, i) => ({
          id: a.id,
          text: formatActivityText(a),
          time: timeAgo(new Date(a.createdAt)),
          color: activityColor(i),
          ring: activityRing(i),
        }));

      setData({
        stats: {
          totalMembers: members.length,
          activeLoans: activeLoans.length,
          todayTransactions: todayTx.length,
          totalRevenue,
          totalProducts: products.length,
          pendingSync: pendingSync.length,
        },
        members,
        transactions: recentTx,
        notifications: recentNotifs,
        activityLogs: recentActivities,
        syncQueue: { pending: pendingSync.length },
        loading: false,
      });
    } catch (err) {
      console.warn("[useDashboardData] Failed to load:", err);
      setData((prev) => ({ ...prev, loading: false }));
    }
  }, []);

  useEffect(() => {
    load();
    const interval = setInterval(load, 15000);
    return () => clearInterval(interval);
  }, [load]);

  return { ...data, refresh: load };
}

function timeAgo(date) {
  const now = Date.now();
  const diff = now - date.getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return "Baru saja";
  if (mins < 60) return `${mins} menit lalu`;
  if (hours < 24) return `${hours} jam lalu`;
  if (days === 1) return "Kemarin";
  return `${days} hari lalu`;
}

function formatActivityText(a) {
  const actor = a.actorName || a.actor || "Someone";
  switch (a.action) {
    case "create":
      return <>{actor} membuat {a.entity || "data"} baru.</>;
    case "update":
      return <>{actor} memperbarui {a.entity || "data"}.</>;
    case "delete":
      return <>{actor} menghapus {a.entity || "data"}.</>;
    default:
      return <>{actor} mengubah {a.entity || "data"}.</>;
  }
}

const COLORS = [
  { color: "bg-[#22C55E]", ring: "ring-[#22C55E]" },
  { color: "bg-[#398eb3]", ring: "ring-[#398eb3]" },
  { color: "bg-[#F59E0B]", ring: "ring-[#F59E0B]" },
  { color: "bg-[#4CC9B0]", ring: "ring-[#4CC9B0]" },
  { color: "bg-[#67B2D4]", ring: "ring-[#67B2D4]" },
  { color: "bg-[#8B5CF6]", ring: "ring-[#8B5CF6]" },
];

function activityColor(i) {
  return COLORS[i % COLORS.length].color;
}
function activityRing(i) {
  return COLORS[i % COLORS.length].ring;
}
