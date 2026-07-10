/** @format */

import { useState } from "react";

const navGroups = [
	{
		label: "Utama",
		items: [
			{ href: "#main-content", label: "Dasbor", icon: "rect", active: true, tip: "Dasbor" },
			{ href: "#analitik", label: "Analitik", icon: "chart", tip: "Analitik" },
		],
	},
	{
		label: "Operasional",
		items: [
			{ href: "#anggota-panel", label: "Keanggotaan", icon: "users", tip: "Keanggotaan" },
			{
				label: "Keuangan",
				icon: "dollar",
				tip: "Keuangan",
				nested: [
					{ href: "#transaksi", label: "Jurnal Umum" },
					{ href: "#transaksi", label: "Neraca" },
					{ href: "#transaksi", label: "Laporan SHU" },
				],
			},
			{ href: "#transaksi", label: "Kasir", icon: "briefcase", tip: "Kasir" },
			{ href: "#", label: "Simpan Pinjam", icon: "circle", tip: "Simpan Pinjam" },
			{ href: "#dokumen-panel", label: "Inventaris", icon: "layers", tip: "Inventaris" },
		],
	},
	{
		label: "Tim",
		items: [
			{ href: "#tim-panel", label: "Anggota Tim", icon: "people", tip: "Anggota Tim" },
			{ href: "#tugas-panel", label: "Tugas", icon: "check", tip: "Tugas" },
			{ href: "#", label: "Pengaturan", icon: "gear", tip: "Pengaturan" },
		],
	},
];

const sidebarIcons = {
	rect: <><rect x="3" y="3" width="7" height="9" rx="2" /><rect x="14" y="3" width="7" height="5" rx="2" /><rect x="14" y="12" width="7" height="9" rx="2" /><rect x="3" y="16" width="7" height="5" rx="2" /></>,
	chart: <><path d="M3 3v18h18M7 15l4-6 3 4 4-7" strokeLinecap="round" strokeLinejoin="round" /></>,
	users: <><path d="M17 20v-1a4 4 0 00-4-4H7a4 4 0 00-4 4v1M10 11a4 4 0 100-8 4 4 0 000 8z" strokeLinecap="round" strokeLinejoin="round" /></>,
	dollar: <><path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" strokeLinecap="round" strokeLinejoin="round" /></>,
	briefcase: <><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" strokeLinecap="round" /></>,
	circle: <><circle cx="12" cy="12" r="9" /><path d="M9 12h6M12 9v6" strokeLinecap="round" /></>,
	layers: <><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" strokeLinecap="round" strokeLinejoin="round" /></>,
	people: <><circle cx="9" cy="8" r="3" /><path d="M2 20a7 7 0 0114 0M16 6a3 3 0 010 6M22 20a7 7 0 00-6-6.9" strokeLinecap="round" strokeLinejoin="round" /></>,
	check: <><rect x="4" y="4" width="16" height="16" rx="3" /><path d="M8 12l2.5 2.5L16 9" strokeLinecap="round" strokeLinejoin="round" /></>,
	gear: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06A1.65 1.65 0 004.6 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06A1.65 1.65 0 009 4.6a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" strokeLinecap="round" strokeLinejoin="round" /></>,
};

const sidebarStats = [
	{ group: "Keanggotaan", items: [{ label: "Total Anggota", value: "2,318" }, { label: "Baru Bulan Ini", value: "+47", color: "text-[#22C55E]" }] },
	{ group: "Kasir", items: [{ label: "Transaksi Hari Ini", value: "1,042" }, { label: "Total Penjualan", value: "Rp 12.8M", color: "text-[#398eb3]" }] },
	{ group: "Simpan Pinjam", items: [{ label: "Total Simpanan", value: "Rp 8.4M" }, { label: "Total Pinjaman", value: "Rp 3.2M", color: "text-[#F59E0B]" }] },
	{ group: "Inventaris", items: [{ label: "Total Barang", value: "156" }, { label: "Perlu Diperiksa", value: "8", color: "text-[#EF4444]" }] },
	{ group: "Anggota Tim", items: [{ label: "Total Tim", value: "12" }, { label: "Online", value: "8", color: "text-[#22C55E]" }] },
	{ group: "Tugas", items: [{ label: "Aktif", value: "24" }, { label: "Selesai Bulan Ini", value: "67", color: "text-[#22C55E]" }] },
];

export default function Sidebar({ collapsed, onToggleCollapse }) {
	const [openNested, setOpenNested] = useState(null);

	return (
		<aside id="sidebar" className={`hidden lg:flex flex-col shrink-0 bg-white border-r border-[#D8E4EA] sticky top-0 h-screen z-40 transition-[width] duration-[320ms] ease-[cubic-bezier(.22,.61,.36,1)] ${collapsed ? "w-[84px]" : "w-64"}`}>
			<div className="h-[72px] flex items-center gap-2.5 px-5 border-b border-[#D8E4EA] shrink-0">
				<span className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#398eb3] to-[#4CC9B0] grid place-items-center shrink-0">
					<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
						<circle cx="5" cy="12" r="2.2" fill="white" />
						<circle cx="12" cy="6" r="2.2" fill="white" fillOpacity="0.85" />
						<circle cx="19" cy="12" r="2.2" fill="white" />
						<circle cx="12" cy="18" r="2.2" fill="white" fillOpacity="0.85" />
						<path d="M5 12L12 6M12 6L19 12M19 12L12 18M12 18L5 12" stroke="white" strokeWidth="1.3" strokeOpacity="0.6" />
					</svg>
				</span>
				{!collapsed && <span className="font-display font-extrabold text-[18px] tracking-tight">SIKOPET</span>}
			</div>

			<nav id="sidebar-scroll" className="flex-1 overflow-y-auto px-3.5 py-5 space-y-6" style={{ scrollbarWidth: "thin", scrollbarColor: "#D8E4EA transparent" }} aria-label="Navigasi sisi">
				{navGroups.map((group) => (
					<div key={group.label}>
						{!collapsed && <p className="px-3 text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider mb-2">{group.label}</p>}
						<ul className="space-y-1">
							{group.items.map((item) => (
								<li key={item.label} className={item.nested ? `nested-group ${openNested === item.label ? "nested-open" : ""}` : ""}>
									{item.nested ? (
										<button onClick={() => setOpenNested(openNested === item.label ? null : item.label)} className={`nested-toggle w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-[14px] text-[#475569] hover:bg-[#F1F5F9] transition-colors focus-ring ${collapsed ? "justify-center" : ""}`} aria-expanded={openNested === item.label} data-tip={item.tip}>
											<span className="shrink-0 w-[18px] h-[18px]"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="shrink-0">{sidebarIcons[item.icon]}</svg></span>
											{!collapsed && <><span className="flex-1 text-left">{item.label}</span><svg className="chev-nested w-3.5 h-3.5 shrink-0 transition-transform duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" /></svg></>}
										</button>
									) : (
										<a href={item.href} className={`nav-item relative flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-[14px] focus-ring transition-colors ${item.active ? "text-[#0F172A] bg-[#F1F5F9]" : "text-[#475569] hover:bg-[#F1F5F9]"} ${collapsed ? "justify-center" : ""}`} data-tip={item.tip}>
											{item.active && !collapsed && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-full bg-[#398eb3]"></span>}
											<span className="shrink-0 w-[18px] h-[18px]"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="shrink-0">{sidebarIcons[item.icon]}</svg></span>
											{!collapsed && <span>{item.label}</span>}
										</a>
									)}
									{item.nested && !collapsed && (
										<div className="nested-panel pl-[42px]">
											<ul className="space-y-0.5 py-1.5 border-l border-[#D8E4EA] ml-[3px]">
												{item.nested.map((sub) => (
													<li key={sub.label}><a href={sub.href} className="block px-3 py-2 text-[13.5px] text-[#475569] hover:text-[#2F7698] transition-colors focus-ring">{sub.label}</a></li>
												))}
											</ul>
										</div>
									)}
								</li>
							))}
						</ul>
						{!collapsed && (
							<div className="mt-3 px-3 space-y-2">
								{sidebarStats.filter(s => {
									const map = { Utama: false, Operasional: true, Tim: true };
									return map[group.label] && s.group !== group.label;
								}).slice(0, group.label === "Operasional" ? 4 : 2).map((stat) => (
									<div key={stat.group} className="rounded-xl bg-[#F1F5F9] border border-[#D8E4EA] p-3">
										<p className="text-[10px] font-semibold text-[#475569] uppercase tracking-wider mb-2">{stat.group}</p>
										<div className="space-y-1.5">
											{stat.items.map((item) => (
												<div key={item.label} className="flex justify-between items-center">
													<span className="text-[10px] text-[#94A3B8]">{item.label}</span>
													<span className={`text-[12px] font-bold ${item.color || "text-[#0F172A]"}`}>{item.value}</span>
												</div>
											))}
										</div>
									</div>
								))}
							</div>
						)}
					</div>
				))}
			</nav>

			<div className="p-3.5 border-t border-[#D8E4EA] shrink-0">
				{!collapsed && (
					<div className="flex items-center gap-2.5 rounded-xl bg-[#EAF6FB] px-3.5 py-3 mb-3">
						<span className="relative w-2.5 h-2.5 shrink-0">
							<span className="absolute inset-0 rounded-full bg-[#22C55E]"></span>
							<span className="absolute inset-0 rounded-full bg-[#22C55E] animate-ping opacity-60"></span>
						</span>
						<div className="min-w-0">
							<p className="text-[12px] font-semibold text-[#2F7698]">Sinkron Aktif</p>
							<p className="text-[10.5px] text-[#2F7698]/70">Terakhir 2 menit lalu</p>
						</div>
					</div>
				)}
				<button onClick={onToggleCollapse} data-tip={collapsed ? "Perluas sidebar" : "Ciutkan sidebar"} className="focus-ring w-full flex items-center justify-center gap-2 py-2 rounded-xl text-[#94A3B8] hover:bg-[#F1F5F9] hover:text-[#0F172A] transition-colors" aria-label="Ciutkan atau perluas sidebar">
					<svg style={{ transform: collapsed ? "rotate(180deg)" : "rotate(0)" }} className="transition-transform" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 19l-7-7 7-7M18 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" /></svg>
					{!collapsed && <span className="text-[12.5px] font-medium">Ciutkan</span>}
				</button>
			</div>
		</aside>
	);
}
