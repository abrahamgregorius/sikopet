/** @format */

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
	moduleService,
	SIDEBAR_ICONS,
	getCategoryLabel,
} from "../../../modules/index.js";
import { isOnline } from "../../../lib/offline.js";
import { getLastGlobalSync } from "../../../lib/syncService.js";
import Logo from "../../../components/Home/Logo.jsx";

const CATEGORY_ORDER = ["utama", "operasional", "tim", "lainnya"];

function formatTimeAgo(isoString) {
	if (!isoString) return "Belum pernah";
	const diff = Date.now() - new Date(isoString).getTime();
	const minutes = Math.floor(diff / 60000);
	if (minutes < 1) return "Baru saja";
	if (minutes < 60) return `${minutes} menit lalu`;
	const hours = Math.floor(minutes / 60);
	if (hours < 24) return `${hours} jam lalu`;
	const days = Math.floor(hours / 24);
	return `${days} hari lalu`;
}

export default function Sidebar({ collapsed, onToggleCollapse }) {
	const [openNested, setOpenNested] = useState(null);
	const [modules, setModules] = useState([]);
	const [loading, setLoading] = useState(true);
	const [online, setOnline] = useState(navigator.onLine);
	const [lastSync, setLastSync] = useState(null);

	useEffect(() => {
		loadSidebarModules();
		const handleModulesUpdated = () => loadSidebarModules();
		window.addEventListener("modules-updated", handleModulesUpdated);
		return () =>
			window.removeEventListener("modules-updated", handleModulesUpdated);
	}, []);

	useEffect(() => {
		const handleOnline = () => setOnline(true);
		const handleOffline = () => setOnline(false);
		window.addEventListener("online", handleOnline);
		window.addEventListener("offline", handleOffline);
		return () => {
			window.removeEventListener("online", handleOnline);
			window.removeEventListener("offline", handleOffline);
		};
	}, []);

	useEffect(() => {
		let mounted = true;
		async function loadLastSync() {
			const ts = await getLastGlobalSync();
			if (mounted) setLastSync(ts);
		}
		loadLastSync();
		const interval = setInterval(loadLastSync, 30000);
		return () => {
			mounted = false;
			clearInterval(interval);
		};
	}, []);

	async function loadSidebarModules() {
		try {
			let grouped = await moduleService.getSidebarModules();
			let flat = [];
			for (const cat of CATEGORY_ORDER) {
				if (grouped[cat]) {
					flat.push(...grouped[cat]);
				}
			}

			if (flat.length === 0) {
				await moduleService.initializeModules();
				grouped = await moduleService.getSidebarModules();
				flat = [];
				for (const cat of CATEGORY_ORDER) {
					if (grouped[cat]) {
						flat.push(...grouped[cat]);
					}
				}
			}

			setModules(flat);
		} catch (err) {
			console.error("[Sidebar] Failed to load modules:", err);
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

	if (loading) {
		return (
			<aside
				id="sidebar"
				className={`hidden lg:flex flex-col shrink-0 bg-white border-r border-[#E5E7EB] sticky top-0 h-screen z-40 transition-[width] duration-[320ms] ease-[cubic-bezier(.22,.61,.36,1)] ${collapsed ? "w-[84px]" : "w-64"}`}
			>
				<div className="h-[72px] flex items-center justify-center">
					<div className="w-5 h-5 border-2 border-[#398eb3] border-t-transparent rounded-lg animate-spin" />
				</div>
			</aside>
		);
	}

	return (
		<aside
			id="sidebar"
			className={`hidden lg:flex flex-col shrink-0 bg-white border-r border-[#E5E7EB] sticky top-0 h-screen z-40 transition-[width] duration-[320ms] ease-[cubic-bezier(.22,.61,.36,1)] ${collapsed ? "w-[84px]" : "w-64"}`}
		>
			<div className="h-[72px] flex items-center gap-2.5 px-5 border-b border-[#E5E7EB] shrink-0">
				<Logo collapsed={collapsed} />
			</div>

			<nav
				id="sidebar-scroll"
				className="flex-1 overflow-y-auto px-3.5 py-5 space-y-6"
				style={{
					scrollbarWidth: "thin",
					scrollbarColor: "#D8E4EA transparent",
				}}
				aria-label="Navigasi sisi"
			>
				{CATEGORY_ORDER.map((category) => {
					const items = groupedModules[category] || [];
					if (items.length === 0) return null;
					return (
						<div key={category}>
							{!collapsed && (
								<p className="px-3 text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider mb-2">
									{getCategoryLabel(category)}
								</p>
							)}
							<ul className="space-y-1">
								{items.map((item) => (
									<li
										key={item.key}
										className={
											item.nested
												? `nested-group ${openNested === item.key ? "nested-open" : ""}`
												: ""
										}
									>
										{item.nested ? (
											<button
												onClick={() =>
													setOpenNested(
														openNested === item.key ? null : item.key,
													)
												}
												className={`nested-toggle w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-[14px] text-[#475569] hover:bg-[#F1F5F9] transition-colors focus-ring ${collapsed ? "justify-center" : ""}`}
												aria-expanded={openNested === item.key}
												data-tip={collapsed ? item.name : ""}
											>
												<span className="shrink-0 w-[18px] h-[18px]">
													<svg
														width="18"
														height="18"
														viewBox="0 0 24 24"
														fill="none"
														stroke="currentColor"
														strokeWidth="1.8"
														className="shrink-0"
													>
														{SIDEBAR_ICONS[item.icon] || SIDEBAR_ICONS.circle}
													</svg>
												</span>
												{!collapsed && (
													<>
														<span className="flex-1 text-left">
															{item.name}
														</span>
														<svg
															className="chev-nested w-3.5 h-3.5 shrink-0 transition-transform duration-300"
															viewBox="0 0 24 24"
															fill="none"
															stroke="currentColor"
															strokeWidth="2.2"
														>
															<path
																d="M6 9l6 6 6-6"
																strokeLinecap="round"
																strokeLinejoin="round"
															/>
														</svg>
													</>
												)}
											</button>
										) : item.key === "moduleManager" ? (
											<Link
												to="/dashboard/modules"
												className={`nav-item relative flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-[14px] focus-ring transition-colors text-[#475569] hover:bg-[#F1F5F9] ${collapsed ? "justify-center" : ""}`}
												data-tip={collapsed ? item.name : ""}
											>
												{!collapsed && (
													<span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-lg bg-[#398eb3]"></span>
												)}
												<span className="shrink-0 w-[18px] h-[18px]">
													<svg
														width="18"
														height="18"
														viewBox="0 0 24 24"
														fill="none"
														stroke="currentColor"
														strokeWidth="1.8"
														className="shrink-0"
													>
														{SIDEBAR_ICONS[item.icon] || SIDEBAR_ICONS.circle}
													</svg>
												</span>
												{!collapsed && <span>{item.name}</span>}
											</Link>
										) : (
											<Link
												to={item.route}
												className={`nav-item relative flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-[14px] focus-ring transition-colors text-[#475569] hover:bg-[#F1F5F9] ${collapsed ? "justify-center" : ""}`}
												data-tip={collapsed ? item.name : ""}
											>
												<span className="shrink-0 w-[18px] h-[18px]">
													<svg
														width="18"
														height="18"
														viewBox="0 0 24 24"
														fill="none"
														stroke="currentColor"
														strokeWidth="1.8"
														className="shrink-0"
													>
														{SIDEBAR_ICONS[item.icon] || SIDEBAR_ICONS.circle}
													</svg>
												</span>
												{!collapsed && <span>{item.name}</span>}
											</Link>
										)}
										{item.nested && !collapsed && (
											<div className="nested-panel pl-[42px]">
												<ul className="space-y-0.5 py-1.5 border-l border-[#E5E7EB] ml-[3px]">
													{item.nested.map((sub) => (
														<li key={sub.key}>
															<Link
																to={sub.route}
																className="block px-3 py-2 text-[13.5px] text-[#475569] hover:text-[#2F7698] transition-colors focus-ring"
															>
																{sub.label}
															</Link>
														</li>
													))}
												</ul>
											</div>
										)}
									</li>
								))}
							</ul>
						</div>
					);
				})}
			</nav>

			<div className="p-3.5 border-t border-[#E5E7EB] shrink-0">
				{!collapsed && (
					<div className="flex items-center gap-2.5 rounded-lg bg-[#EAF6FB] px-3.5 py-3 mb-3">
						<span className="relative w-2.5 h-2.5 shrink-0">
							<span
								className={`absolute inset-0 rounded-full ${online ? "bg-[#22C55E]" : "bg-[#EAB308]"}`}
							></span>
							{online && (
								<span className="absolute inset-0 rounded-full bg-[#22C55E] animate-ping opacity-60"></span>
							)}
						</span>
						<div className="min-w-0">
							<p className="text-[12px] font-semibold text-[#2F7698]">
								{online ? "Sinkron Aktif" : "Offline"}
							</p>
							<p className="text-[10.5px] text-[#2F7698]/70">
								{online
									? `Terakhir ${formatTimeAgo(lastSync)}`
									: "Tidak tersinkron"}
							</p>
						</div>
					</div>
				)}
				<button
					onClick={onToggleCollapse}
					data-tip={collapsed ? "Perluas sidebar" : "Ciutkan sidebar"}
					className="focus-ring w-full flex items-center justify-center gap-2 py-2 rounded-lg text-[#94A3B8] hover:bg-[#F1F5F9] hover:text-[#0F172A] transition-colors"
					aria-label="Ciutkan atau perluas sidebar"
				>
					<svg
						style={{ transform: collapsed ? "rotate(180deg)" : "rotate(0)" }}
						className="transition-transform"
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
					>
						<path
							d="M11 19l-7-7 7-7M18 19l-7-7 7-7"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
					{!collapsed && (
						<span className="text-[12.5px] font-medium">Ciutkan</span>
					)}
				</button>
			</div>
		</aside>
	);
}
