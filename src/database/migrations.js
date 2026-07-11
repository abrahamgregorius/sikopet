import { db } from "./db.js";

/**
 * Migration utilities for future schema changes.
 *
 * To add a new migration:
 * 1. Increment db.version in db.js
 * 2. Add a new case block below
 * 3. Perform schema changes within the upgrade callback
 *
 * Example:
 *
 * case 2: {
 *   const oldDb = upgrading;
 *   oldDb.table('members').createIndex('phone', 'phone');
 *   oldDb.table('loans').createIndex('memberId_status', '[memberId+status]');
 * }
 */

export async function runMigrations() {
    // Placeholder for future migrations
    // Called during app initialization if needed
    console.log("[Migrations] No migrations to run.");
}

export function createIndex(tableName, indexName, keyPath) {
    console.warn(
        `[Migrations] Index creation deferred until Dexie supports dynamic indexes.`,
    );
}
