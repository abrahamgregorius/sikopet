/** @format */

import { useState, useEffect } from "react";
import { moduleService, getCategoryLabel, SIDEBAR_ICONS } from "../../../modules/index.js";

const STATUS_COLORS = {
  enabled: { bg: "bg-[#22C55E]/10", text: "text-[#22C55E]", dot: "bg-[#22C55E]" },
  disabled: { bg: "bg-[#94A3B8]/10", text: "text-[#94A3B8]", dot: "bg-[#94A3B8]" },
  coming_soon: { bg: "bg-[#F59E0B]/10", text: "text-[#F59E0B]", dot: "bg-[#F59E0B]" },
};

const CATEGORY_COLORS = {
  utama: "text-[#398eb3] bg-[#398eb3]/10",
  operasional: "text-[#22C55E] bg-[#22C55E]/10",
  tim: "text-[#8B5CF6] bg-[#8B5CF6]/10",
  lainnya: "text-[#F59E0B] bg-[#F59E0B]/10",
};

export default function ModuleManager() {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("category");
  const [toggling, setToggling] = useState(null);
  const [toast, setToast] = useState(null);
  const [stats, setStats] = useState({ total: 0, enabled: 0, disabled: 0, comingSoon: 0 });

  useEffect(() => {
    loadModules();
    const handleModulesUpdated = () => loadModules();
    window.addEventListener('modules-updated', handleModulesUpdated);
    return () => window.removeEventListener('modules-updated', handleModulesUpdated);
  }, []);

  async function loadModules() {
    setLoading(true);
    try {
      const [allModules, moduleStats] = await Promise.all([
        moduleService.getAllModules(),
        moduleService.getStats(),
      ]);
      setModules(allModules);
      setStats(moduleStats);
    } catch (err) {
      console.error("[ModuleManager] Failed to load modules:", err);
      showToast("Gagal memuat modul", "error");
    } finally {
      setLoading(false);
    }
  }

  async function handleToggle(key) {
    setToggling(key);
    try {
      const modBefore = modules.find(m => m.key === key);
      const wasEnabled = modBefore?.enabled;
      await moduleService.toggleModule(key);
      await loadModules();
      window.dispatchEvent(new CustomEvent('modules-updated'));
      showToast(
        `${modBefore?.name} ${wasEnabled ? "dinonaktifkan" : "diaktifkan"}`,
        "success"
      );
    } catch (err) {
      console.error("[ModuleManager] Toggle failed:", err);
      showToast("Gagal mengubah status modul", "error");
    } finally {
      setToggling(null);
    }
  }

  function showToast(message, type) {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }

  function getFilteredModules() {
    let filtered = [...modules];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.description.toLowerCase().includes(q) ||
          m.key.toLowerCase().includes(q)
      );
    }

    if (filterCategory !== "all") {
      filtered = filtered.filter((m) => m.category === filterCategory);
    }

    if (filterStatus !== "all") {
      if (filterStatus === "enabled") {
        filtered = filtered.filter((m) => m.enabled);
      } else if (filterStatus === "disabled") {
        filtered = filtered.filter((m) => !m.enabled && !m.comingSoon);
      } else if (filterStatus === "coming_soon") {
        filtered = filtered.filter((m) => m.comingSoon);
      }
    }

    if (sortBy === "alphabetical") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "category") {
      const order = ["utama", "operasional", "tim", "lainnya"];
      filtered.sort((a, b) => order.indexOf(a.category) - order.indexOf(b.category) || a.order - b.order);
    }

    return filtered;
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

  const filtered = getFilteredModules();
  const grouped = groupByCategory(filtered);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#398eb3] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display font-extrabold text-[28px] sm:text-[32px] text-[#0F172A] tracking-tight">
            Kelola Modul
          </h1>
          <p className="text-[14px] text-[#6B7280] mt-1">
            Aktifkan atau nonaktifkan modul sesuai kebutuhan
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Modul" value={stats.total} color="text-[#0F172A]" />
        <StatCard label="Aktif" value={stats.enabled} color="text-[#22C55E]" />
        <StatCard label="Nonaktif" value={stats.disabled} color="text-[#94A3B8]" />
        <StatCard label="Coming Soon" value={stats.comingSoon} color="text-[#F59E0B]" />
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            placeholder="Cari modul..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="focus-ring w-full h-[44px] pl-10 pr-4 rounded-[12px] border border-[#E5E7EB] bg-white text-[14px] text-[#0F172A] placeholder-[#9CA3AF] transition-colors"
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="focus-ring h-[44px] px-4 rounded-[12px] border border-[#E5E7EB] bg-white text-[14px] text-[#0F172A] transition-colors"
        >
          <option value="all">Semua Kategori</option>
          <option value="utama">Utama</option>
          <option value="operasional">Operasional</option>
          <option value="tim">Tim</option>
          <option value="lainnya">Lainnya</option>
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="focus-ring h-[44px] px-4 rounded-[12px] border border-[#E5E7EB] bg-white text-[14px] text-[#0F172A] transition-colors"
        >
          <option value="all">Semua Status</option>
          <option value="enabled">Aktif</option>
          <option value="disabled">Nonaktif</option>
          <option value="coming_soon">Coming Soon</option>
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="focus-ring h-[44px] px-4 rounded-[12px] border border-[#E5E7EB] bg-white text-[14px] text-[#0F172A] transition-colors"
        >
          <option value="category">Sortir: Kategori</option>
          <option value="alphabetical">Sortir: A-Z</option>
        </select>
      </div>

      {Object.keys(grouped).length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 rounded-2xl bg-[#F1F5F9] border border-[#D8E4EA]">
          <svg className="w-12 h-12 text-[#94A3B8] mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <p className="text-[14px] text-[#94A3B8]">Tidak ada modul ditemukan</p>
        </div>
      ) : (
        Object.entries(grouped).map(([category, mods]) => (
          <div key={category} className="space-y-3">
            <div className="flex items-center gap-2">
              <h2 className="font-display font-bold text-[16px] text-[#0F172A]">
                {getCategoryLabel(category)}
              </h2>
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${CATEGORY_COLORS[category]}`}>
                {mods.length}
              </span>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {mods.map((mod) => {
                const status = mod.comingSoon
                  ? "coming_soon"
                  : mod.enabled
                  ? "enabled"
                  : "disabled";
                const colors = STATUS_COLORS[status];
                return (
                  <div
                    key={mod.key}
                    className={`rounded-2xl bg-white border border-[#D8E4EA] p-5 transition-all duration-200 hover:shadow-lift ${
                      mod.comingSoon ? "opacity-70" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-10 h-10 rounded-xl grid place-items-center shrink-0 ${
                        mod.comingSoon ? "bg-[#F59E0B]/10" : "bg-[#EAF6FB]"
                      }`}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={mod.comingSoon ? "#F59E0B" : "#398eb3"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                          {SIDEBAR_ICONS[mod.icon] || SIDEBAR_ICONS.circle}
                        </svg>
                      </div>
                      <div className="flex items-center gap-2">
                        {mod.comingSoon && (
                          <span className="text-[10px] font-bold text-[#F59E0B] bg-[#F59E0B]/10 px-2 py-0.5 rounded-full uppercase">
                            Coming Soon
                          </span>
                        )}
                        <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2 py-0.5 rounded-full ${colors.bg} ${colors.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
                          {status === "enabled" ? "Aktif" : status === "disabled" ? "Nonaktif" : "Segera"}
                        </span>
                      </div>
                    </div>
                    <h3 className="font-display font-bold text-[14px] text-[#0F172A] mb-1">
                      {mod.name}
                    </h3>
                    <p className="text-[12px] text-[#6B7280] leading-relaxed mb-4">
                      {mod.description}
                    </p>
                    {!mod.comingSoon && mod.key !== "moduleManager" && (
                      <button
                        onClick={() => handleToggle(mod.key)}
                        disabled={toggling === mod.key}
                        className={`focus-ring w-full h-[36px] rounded-full font-semibold text-[13px] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                          mod.enabled
                            ? "bg-[#FEE2E2] text-[#EF4444] hover:bg-[#FECACA]"
                            : "bg-[#DCFCE7] text-[#22C55E] hover:bg-[#BBF7D0]"
                        }`}
                      >
                        {toggling === mod.key ? (
                          <span className="inline-flex items-center gap-2">
                            <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                            Processing...
                          </span>
                        ) : mod.enabled ? (
                          "Nonaktifkan"
                        ) : (
                          "Aktifkan"
                        )}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}

      {toast && (
        <div className={`fixed bottom-6 right-6 z-[100] px-5 py-3 rounded-2xl shadow-lift flex items-center gap-3 animate-pop-in ${
          toast.type === "success" ? "bg-[#22C55E] text-white" : "bg-[#EF4444] text-white"
        }`}>
          {toast.type === "success" ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10" /><path d="M15 9l-6 6M9 9l6 6" strokeLinecap="round" />
            </svg>
          )}
          <span className="text-[13.5px] font-medium">{toast.message}</span>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div className="rounded-2xl bg-white border border-[#D8E4EA] p-4 shadow-soft">
      <p className="text-[12px] text-[#94A3B8] font-medium mb-1">{label}</p>
      <p className={`font-display font-extrabold text-[28px] ${color} tracking-tight`}>{value}</p>
    </div>
  );
}
