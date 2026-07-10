/** @format */

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { moduleService, getCategoryLabel } from "../../../modules/index.js";

const CATEGORY_ORDER = ["utama", "operasional", "tim", "lainnya"];

export default function MobileSidebar({ isOpen, onClose }) {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      loadModules();
    }
  }, [isOpen]);

  async function loadModules() {
    try {
      const grouped = await moduleService.getSidebarModules();
      const flat = [];
      for (const cat of CATEGORY_ORDER) {
        if (grouped[cat]) {
          flat.push(...grouped[cat]);
        }
      }
      setModules(flat);
    } catch (err) {
      console.error("[MobileSidebar] Failed to load modules:", err);
    } finally {
      setLoading(false);
    }
  }

  function groupByCategory(mods) {
    const grouped = {};
    for (const mod of mods) {
      if (!grouped[mod.category]) {
        grouped[mod.category] = [];
      }
      grouped[mod.category].push(mod);
    }
    return grouped;
  }

  const groupedModules = groupByCategory(modules);

  return (
    <>
      <div
        onClick={onClose}
        className={`overlay fixed inset-0 bg-[#0F172A]/40 z-40 lg:hidden ${isOpen ? "opacity-100 block" : "opacity-0 hidden"}`}
      />
      <aside
        className={`drawer-panel fixed top-0 left-0 h-full w-72 bg-white z-50 lg:hidden flex flex-col ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="h-[72px] flex items-center justify-between px-5 border-b border-[#D8E4EA]">
          <span className="font-display font-extrabold text-[18px]">SIKOPET</span>
          <button onClick={onClose} className="focus-ring p-1.5" aria-label="Tutup menu">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto px-3.5 py-5 space-y-4 text-[14.5px] font-medium text-[#475569]">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-5 h-5 border-2 border-[#398eb3] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            CATEGORY_ORDER.map((category) => {
              const items = groupedModules[category] || [];
              if (items.length === 0) return null;
              return (
                <div key={category}>
                  <p className="px-3 text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider mb-1">
                    {getCategoryLabel(category)}
                  </p>
                    <div className="space-y-0.5">
                    {items.map((item) => (
                      <Link
                        key={item.key}
                        to={item.key === "moduleManager" ? "/dashboard/modules" : item.route}
                        onClick={onClose}
                        className="block px-3 py-2.5 rounded-xl hover:bg-[#F1F5F9] transition-colors"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </nav>
      </aside>
    </>
  );
}
