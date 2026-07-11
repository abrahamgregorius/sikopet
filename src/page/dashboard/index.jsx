/** @format */

import React, { useState, useEffect, useRef } from "react";

import Sidebar from "./components/Sidebar";
import MobileSidebar from "./components/MobileSidebar";
import TopNav from "./components/TopNav";
import HeroHeader from "./components/HeroHeader";
import QuickActions from "./components/QuickActions";
import StatsGrid from "./components/StatsGrid";
import {
	AnalyticsSection,
	ModuleUsage,
	ProgressOverview,
} from "./components/AnalyticsSection";
import TransactionTable from "./components/TransactionTable";
import ActivityTimeline from "./components/ActivityTimeline";
import TaskList from "./components/TaskList";
import TeamList from "./components/TeamList";
import DocumentList from "./components/DocumentList";
import MiniCalendar from "./components/MiniCalendar";
import NotificationCenter from "./components/NotificationCenter";
import AnggotaPanel from "./components/AnggotaPanel";
import RightPanel from "./components/RightPanel";
import FAB from "./components/FAB";
import ContextMenu from "./components/ContextMenu";
import TaskModal from "./components/TaskModal";
import NotificationDrawer from "./components/NotificationDrawer";
import UserModal from "./components/UserModal";
import Breadcrumb from "./components/Breadcrumb";
import BIExecutiveSummary from "./components/BIExecutiveSummary";
import BISimpanPinjam from "./components/BISimpanPinjam";
import BIInventori from "./components/BIInventori";
import BIPenjualan from "./components/BIPenjualan";
import BIPengadaan from "./components/BIPengadaan";
import BIKeuangan from "./components/BIKeuangan";

const BI_TABS = [
	{ id: "executive", label: "Eksekutif" },
	{ id: "simpanpinjam", label: "Simpan Pinjam" },
	{ id: "inventori", label: "Inventori" },
	{ id: "penjualan", label: "Penjualan" },
	{ id: "pengadaan", label: "Pengadaan" },
	{ id: "keuangan", label: "Keuangan" },
];

export default function Dashboard() {
	const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
	const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
	const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
	const [isFabMenuOpen, setIsFabMenuOpen] = useState(false);
	const [isNotifOpen, setIsNotifOpen] = useState(false);
	const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
	const [isUserModalOpen, setIsUserModalOpen] = useState(false);
	const [refreshTrigger, setRefreshTrigger] = useState(0);
	const [ctxMenu, setCtxMenu] = useState({ isOpen: false, x: 0, y: 0 });
	const [biTab, setBiTab] = useState("executive");
	const [viewMode, setViewMode] = useState("overview");

	const profileMenuRef = useRef(null);
	const fabMenuRef = useRef(null);

	useEffect(() => {
		const io = new IntersectionObserver(
			(entries) => {
				entries.forEach((e) => {
					if (e.isIntersecting) {
						e.target.classList.add("in");
						io.unobserve(e.target);
					}
				});
			},
			{ threshold: 0.1 },
		);
		document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
		return () => io.disconnect();
	}, []);

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (
				profileMenuRef.current &&
				!profileMenuRef.current.contains(event.target) &&
				!event.target.closest("#profile-btn")
			) {
				setIsProfileMenuOpen(false);
			}
			if (
				fabMenuRef.current &&
				!fabMenuRef.current.contains(event.target) &&
				!event.target.closest("#fab-btn")
			) {
				setIsFabMenuOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	useEffect(() => {
		const handleKeyDown = (e) => {
			if (e.key === "Escape") {
				setIsTaskModalOpen(false);
				setIsNotifOpen(false);
				setIsMobileSidebarOpen(false);
			}
		};
		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, []);

	const handleRefreshStats = (e) => {
		const svg = e.currentTarget.querySelector("svg");
		svg.style.animation = "spin .6s linear";
		setRefreshTrigger((prev) => prev + 1);
		setTimeout(() => {
			svg.style.animation = "";
		}, 650);
	};

	const handleCtxMenuClick = (e) => {
		e.stopPropagation();
		const rect = e.currentTarget.getBoundingClientRect();
		setCtxMenu({
			isOpen: true,
			y: rect.bottom + window.scrollY + 6,
			x: rect.right - 176 + window.scrollX,
		});
	};

	return (
		<div className="text-[#0F172A] antialiased bg-[#F7FAFC] font-['Inter',sans-serif]">
			<style>{`
				html { scroll-behavior: smooth; }
				.font-display { font-family: "Hanken Grotesk", sans-serif; }
				::selection { background: #67B2D4; color: #fff; }
				.focus-ring:focus-visible { outline: 2px solid #398eb3; outline-offset: 2px; border-radius: 8px; }

				.glass { background: rgba(255,255,255,0.7); backdrop-filter: blur(14px) saturate(160%); -webkit-backdrop-filter: blur(14px) saturate(160%); }

				.tooltip { position: relative; }
				.tooltip::after {
					content: attr(data-tip); position: absolute; bottom: calc(100% + 8px); left: 50%; transform: translateX(-50%) translateY(4px);
					background: #0F172A; color: #fff; font-size: 11.5px; font-weight: 500; padding: 5px 9px; border-radius: 8px; white-space: nowrap;
					opacity: 0; pointer-events: none; transition: opacity .18s ease, transform .18s ease; z-index: 60;
				}
				.tooltip:hover::after, .tooltip:focus-visible::after { opacity: 1; transform: translateX(-50%) translateY(0); }

				.skel { background: linear-gradient(90deg, #EDF2F5 25%, #F7FAFC 37%, #EDF2F5 63%); background-size: 400% 100%; animation: skel 1.4s ease infinite; border-radius: 10px; }
				@keyframes skel { 0% { background-position: 100% 50%; } 100% { background-position: 0 50%; } }

				.overlay { transition: opacity .25s ease; }
				.sheet-modal { transition: opacity .25s ease, transform .25s ease; }
				.drawer-panel { transition: transform .32s cubic-bezier(.22,.61,.36,1); }

				.ring { border-radius: 50%; background: conic-gradient(var(--ring-color,#398eb3) calc(var(--p,0)*1%), #E8EEF2 0); }
				.ring-inner { background: #fff; border-radius: 50%; }

				.pop-enter { animation: popIn .18s cubic-bezier(.22,.61,.36,1); }
				@keyframes popIn { from { opacity: 0; transform: scale(.96) translateY(-4px); } to { opacity: 1; transform: scale(1) translateY(0); } }

				.reveal { opacity: 0; transform: translateY(14px); transition: opacity .6s ease, transform .6s ease; }
				.reveal.in { opacity: 1; transform: translateY(0); }
				@media (prefers-reduced-motion: reduce) {
					* { animation-duration: .001ms !important; transition-duration: .001ms !important; }
				}

				#sidebar-scroll::-webkit-scrollbar { width: 5px; }
				#sidebar-scroll::-webkit-scrollbar-thumb { background: #D8E4EA; border-radius: 10px; }
				@keyframes spin { from { transform: rotate(0); } to { transform: rotate(360deg); } }

				.shadow-soft, .shadow-lift, .shadow-glow { box-shadow: none; }
			`}</style>

			<a
				href="#main-content"
				className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[200] focus:bg-white focus:px-4 focus:py-2 focus:rounded-lg"
			>
				Lompat ke konten
			</a>

			<div className="flex min-h-screen">
				<Sidebar
					collapsed={isSidebarCollapsed}
					onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
				/>
				<MobileSidebar
					isOpen={isMobileSidebarOpen}
					onClose={() => setIsMobileSidebarOpen(false)}
				/>

				<div id="app-shell" className="flex-1 min-w-0 flex flex-col">
					<TopNav
						onMobileMenuToggle={() => setIsMobileSidebarOpen(true)}
						onNotifToggle={() => setIsNotifOpen(true)}
						onProfileToggle={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
						isNotifOpen={isNotifOpen}
						isProfileOpen={isProfileMenuOpen}
						profileRef={profileMenuRef}
					/>

					<div className="flex-1 flex">
						<main
							id="main-content"
							className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-7 space-y-7"
						>
							<Breadcrumb />
							<div className="flex items-center justify-between gap-4 flex-wrap">
								<HeroHeader onOpenTaskModal={() => setIsTaskModalOpen(true)} />
								<div className="flex items-center gap-2 bg-[#F1F5F9] rounded-xl p-1">
									<button
										onClick={() => setViewMode("overview")}
										className={`px-4 py-2 rounded-lg text-[13px] font-semibold transition-all ${
											viewMode === "overview"
												? "bg-white text-[#0F172A] shadow-sm"
												: "text-[#475569] hover:text-[#0F172A]"
										}`}
									>
										Overview
									</button>
									<button
										onClick={() => setViewMode("bi")}
										className={`px-4 py-2 rounded-lg text-[13px] font-semibold transition-all ${
											viewMode === "bi"
												? "bg-white text-[#0F172A] shadow-sm"
												: "text-[#475569] hover:text-[#0F172A]"
										}`}
									>
										BI Dashboard
									</button>
								</div>
							</div>

							{viewMode === "bi" && (
								<>
									<div
										role="tablist"
										className="flex items-center gap-1 bg-[#F1F5F9] rounded-xl p-1 overflow-x-auto"
									>
										{BI_TABS.map((tab) => (
											<button
												key={tab.id}
												role="tab"
												aria-selected={biTab === tab.id}
												onClick={() => setBiTab(tab.id)}
												className={`px-4 py-2 rounded-lg text-[13px] font-semibold transition-all whitespace-nowrap ${
													biTab === tab.id
														? "bg-white text-[#398eb3] shadow-sm"
														: "text-[#475569] hover:text-[#0F172A]"
												}`}
											>
												{tab.label}
											</button>
										))}
									</div>

									{biTab === "executive" && <BIExecutiveSummary />}
									{biTab === "simpanpinjam" && <BISimpanPinjam />}
									{biTab === "inventori" && <BIInventori />}
									{biTab === "penjualan" && <BIPenjualan />}
									{biTab === "pengadaan" && <BIPengadaan />}
									{biTab === "keuangan" && <BIKeuangan />}
								</>
							)}

							{viewMode === "overview" && (
								<>
							<QuickActions onOpenTaskModal={() => setIsTaskModalOpen(true)} />
							<StatsGrid
								refreshTrigger={refreshTrigger}
								onRefresh={handleRefreshStats}
							/>
							<AnalyticsSection />
							<section className="reveal in grid lg:grid-cols-2 gap-5">
								<ModuleUsage />
								<ProgressOverview />
							</section>
							<TransactionTable onCtxMenu={handleCtxMenuClick} />
							<section className="reveal in grid lg:grid-cols-3 gap-5">
								<ActivityTimeline />
								<TaskList onOpenModal={() => setIsTaskModalOpen(true)} />
								<TeamList />
							</section>
							<section className="reveal in grid lg:grid-cols-3 gap-5">
								<DocumentList />
								<MiniCalendar />
								<NotificationCenter />
							</section>
							<AnggotaPanel />
								</>
							)}
						</main>

						{/*<RightPanel />*/}
					</div>
				</div>
			</div>

			<FAB
				isOpen={isFabMenuOpen}
				onToggle={() => setIsFabMenuOpen(!isFabMenuOpen)}
				onNewTransaction={() => setIsFabMenuOpen(false)}
				onNewTask={() => {
					setIsFabMenuOpen(false);
					setIsTaskModalOpen(true);
				}}
				onNewMember={() => setIsFabMenuOpen(false)}
				onNewUser={() => {
					setIsFabMenuOpen(false);
					setIsUserModalOpen(true);
				}}
			/>

			<NotificationDrawer
				isOpen={isNotifOpen}
				onClose={() => setIsNotifOpen(false)}
			/>

			{ctxMenu.isOpen && (
				<ContextMenu
					x={ctxMenu.x}
					y={ctxMenu.y}
					onClose={() => setCtxMenu((prev) => ({ ...prev, isOpen: false }))}
				/>
			)}

			<TaskModal
				isOpen={isTaskModalOpen}
				onClose={() => setIsTaskModalOpen(false)}
			/>

			<UserModal
				isOpen={isUserModalOpen}
				onClose={() => setIsUserModalOpen(false)}
			/>
		</div>
	);
}
