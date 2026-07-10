import Dexie from "dexie";

class SikopetDatabase extends Dexie {
    constructor() {
        super("SikopetDB");

        this.version(1).stores({
            users: "++id, email, cooperativeId",
            cooperatives: "++id, name",
            members: "++id, &memberNumber, name, cooperativeId",
            savings: "++id, memberId, type, createdAt",
            loans: "++id, memberId, status, dueDate",
            products: "++id, name, category",
            inventory: "++id, productId, stock",
            transactions: "++id, type, createdAt",
            notifications: "++id, read, createdAt",
            activityLogs: "++id, action, entity, entityId, createdAt",
            syncQueue: "++id, status, createdAt",
            settings: "++id, &key",
        });

        this.version(2).stores({
            modules: "++id, &key, category, enabled, order",
        }).upgrade(tx => {
            return tx.table("modules").toCollection().modify(mod => {
                if (mod.enabled === undefined) mod.enabled = true;
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
        }))
    );
    return {
        name: db.name,
        version: db.verno,
        tables: tableInfos,
    };
}
