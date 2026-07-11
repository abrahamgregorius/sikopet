import Dexie from "dexie";

const SCHEMA_VER = 4;

class SikopetDatabase extends Dexie {
    constructor() {
        super("SikopetDB");

        this.version(1).stores({
            users: "++id, email, name, role, cooperativeId",
            cooperatives: "++id, name",
            members: "++id, &memberNumber, name, cooperativeId",
            savings: "++id, memberId, type, createdAt",
            loans: "++id, memberId, status, dueDate",
            products: "++id, name, category",
            inventory: "++id, productId, stock",
            transactions: "++id, type, createdAt",
            notifications: "++id, read, createdAt",
            activityLogs: "++id, action, entity, entityId, createdAt",
            syncQueue:
                "++id, &clientId, entityType, operationType, status, createdAt",
            settings: "++id, &key",
        });

        this.version(2)
            .stores({
                users: "++id, email, name, role, cooperativeId, cloudId, syncedAt",
                cooperatives: "++id, name, cloudId, syncedAt",
                members:
                    "++id, &memberNumber, &cloudId, name, cooperativeId, syncedAt",
                savings: "++id, &cloudId, memberId, type, createdAt, syncedAt",
                loans: "++id, &cloudId, memberId, status, dueDate, syncedAt",
                products: "++id, &cloudId, name, category, syncedAt",
                inventory: "++id, productId, cloudId, syncedAt",
                transactions: "++id, &cloudId, type, createdAt, syncedAt",
                notifications: "++id, cloudId, read, createdAt, syncedAt",
                activityLogs: "++id, action, entity, entityId, createdAt",
                syncQueue:
                    "++id, &clientId, entityType, operationType, status, createdAt",
                settings: "++id, &key",
                tasks: "++id, status, dueDate, createdAt, cloudId, syncedAt",
                modules: "++id, &key, category, enabled, order",
            })
            .upgrade((tx) => {
                return tx
                    .table("modules")
                    .toCollection()
                    .modify((mod) => {
                        if (mod.enabled === undefined) mod.enabled = true;
                    });
            });

        this.version(SCHEMA_VER)
            .stores({
                users: "++id, email, name, role, cooperativeId, cloudId, syncedAt",
                cooperatives: "++id, name, cloudId, syncedAt",
                members:
                    "++id, &memberNumber, &cloudId, name, cooperativeId, syncedAt",
                savings: "++id, &cloudId, memberId, type, createdAt, syncedAt",
                loans: "++id, &cloudId, memberId, status, dueDate, syncedAt",
                products: "++id, &cloudId, name, category, syncedAt",
                inventory: "++id, productId, cloudId, syncedAt",
                transactions: "++id, &cloudId, type, createdAt, syncedAt",
                notifications: "++id, cloudId, read, createdAt, syncedAt",
                activityLogs: "++id, action, entity, entityId, createdAt",
                syncQueue:
                    "++id, &clientId, entityType, operationType, status, createdAt",
                settings: "++id, &key",
                tasks: "++id, status, dueDate, createdAt, cloudId, syncedAt",
            })
            .upgrade((tx) => {
                return tx
                    .table("syncQueue")
                    .toCollection()
                    .modify((item) => {
                        if (item.attemptCount === undefined)
                            item.attemptCount = 0;
                        if (!item.createdAt)
                            item.createdAt = new Date().toISOString();
                    });
            });

        this.users = this.table("users");
        this.cooperatives = this.table("cooperatives");
        this.members = this.table("members");
        this.savings = this.table("savings");
        this.loans = this.table("loans");
        this.products = this.table("products");
        this.inventory = this.table("inventory");
        this.transactions = this.table("transactions");
        this.notifications = this.table("notifications");
        this.activityLogs = this.table("activityLogs");
        this.syncQueue = this.table("syncQueue");
        this.settings = this.table("settings");
        this.modules = this.table("modules");
        this.tasks = this.table("tasks");
    }
}

export const db = new SikopetDatabase();

export async function clearAllData() {
    await db.delete();
    await db.open();
}

export async function getDatabaseInfo() {
    const tableInfos = await Promise.all(
        db.tables.map(async (t) => ({
            name: t.name,
            count: await t.count(),
            schema: t.schema,
        })),
    );
    return {
        name: db.name,
        version: db.verno,
        tables: tableInfos,
    };
}

export async function getSetting(key) {
    const s = await db.settings.where("key").equals(key).first();
    return s?.value;
}

export async function setSetting(key, value) {
    const existing = await db.settings.where("key").equals(key).first();
    if (existing) {
        await db.settings.update(existing.id, { value });
    } else {
        await db.settings.add({ key, value });
    }
}
