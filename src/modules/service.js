import { db } from '../database/index.js';
import { MODULE_REGISTRY, getModuleByKey, getCategories } from './registry.jsx';

const CATEGORY_LABELS = {
  utama: 'Utama',
  operasional: 'Operasional',
  tim: 'Tim',
  lainnya: 'Lainnya',
};

export const moduleService = {
  async initializeModules() {
    const count = await db.modules.count();
    if (count > 0) return false;

    const now = new Date();
    const modulesToAdd = MODULE_REGISTRY.map(mod => ({
      key: mod.key,
      name: mod.name,
      description: mod.description,
      icon: mod.icon,
      route: mod.route,
      category: mod.category,
      enabled: true,
      order: mod.order,
      comingSoon: mod.comingSoon || false,
      createdAt: now,
      updatedAt: now,
    }));

    await db.modules.bulkAdd(modulesToAdd);
    console.log('[ModuleService] Initialized', modulesToAdd.length, 'modules');
    return true;
  },

  async getAllModules() {
    return db.modules.orderBy('order').toArray();
  },

  async getEnabledModules() {
    const all = await this.getAllModules();
    return all.filter(m => m.enabled).sort((a, b) => a.order - b.order);
  },

  async getModulesByCategory(category) {
    return db.modules.where('category').equals(category).sortBy('order');
  },

  async getModuleByKey(key) {
    return db.modules.where('key').equals(key).first();
  },

  async enableModule(key) {
    const mod = await db.modules.where('key').equals(key).first();
    if (!mod) throw new Error(`Module ${key} not found`);

    const dependencies = getModuleByKey(key)?.dependencies || [];
    for (const depKey of dependencies) {
      const dep = await db.modules.where('key').equals(depKey).first();
      if (dep && !dep.enabled) {
        await this.enableModule(depKey);
      }
    }

    await db.modules.update(mod.id, { enabled: true, updatedAt: new Date() });
    return true;
  },

  async disableModule(key) {
    const mod = await db.modules.where('key').equals(key).first();
    if (!mod) throw new Error(`Module ${key} not found`);

    const dependentModules = MODULE_REGISTRY.filter(m => m.dependencies?.includes(key));
    for (const depMod of dependentModules) {
      const dep = await db.modules.where('key').equals(depMod.key).first();
      if (dep && dep.enabled) {
        await this.disableModule(depMod.key);
      }
    }

    await db.modules.update(mod.id, { enabled: false, updatedAt: new Date() });
    return true;
  },

  async toggleModule(key) {
    const mod = await db.modules.where('key').equals(key).first();
    if (!mod) throw new Error(`Module ${key} not found`);

    if (mod.enabled) {
      return this.disableModule(key);
    } else {
      return this.enableModule(key);
    }
  },

  async getSidebarModules() {
    const enabled = await this.getEnabledModules();
    const grouped = {};

    for (const cat of getCategories()) {
      grouped[cat] = enabled.filter(m => m.category === cat);
    }

    return grouped;
  },

  async isModuleEnabled(key) {
    const mod = await db.modules.where('key').equals(key).first();
    return mod ? mod.enabled : false;
  },

  async getStats() {
    const all = await this.getAllModules();
    const enabled = all.filter(m => m.enabled);
    const disabled = all.filter(m => !m.enabled && !m.comingSoon);
    const comingSoon = all.filter(m => m.comingSoon);

    return {
      total: all.length,
      enabled: enabled.length,
      disabled: disabled.length,
      comingSoon: comingSoon.length,
    };
  },

  async searchModules(query) {
    const all = await this.getAllModules();
    const q = query.toLowerCase();
    return all.filter(m =>
      m.name.toLowerCase().includes(q) ||
      m.description.toLowerCase().includes(q) ||
      m.key.toLowerCase().includes(q)
    );
  },

  async resetToDefault() {
    await db.modules.clear();
    return this.initializeModules();
  },
};

export function getCategoryLabel(category) {
  return CATEGORY_LABELS[category] || category;
}

export { CATEGORY_LABELS };
