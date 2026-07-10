/** @format */

import React, { useState, useEffect, useRef } from "react";

import Sidebar from "./components/Sidebar";
import MobileSidebar from "./components/MobileSidebar";
import TopNav from "./components/TopNav";
import HeroHeader from "./components/HeroHeader";
import QuickActions from "./components/QuickActions";
import StatsGrid from "./components/StatsGrid";
import { AnalyticsSection, ModuleUsage, ProgressOverview } from "./components/AnalyticsSection";
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

	const profileMenuRef = useRef(null);
	const fabMenuRef = useRef(null);

	useEffect(() => {
		const io = new IntersectionObserver((entries) => {
			entries.forEach(e => {
				if (e.isIntersecting) {
					e.target.classList.add('in');
					io.unobserve(e.target);
				}
			});
		}, { threshold: 0.1 });
		document.querySelectorAll('.reveal').forEach(el => io.observe(el));
		return () => io.disconnect();
	}, []);

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (profileMenuRef.current && !profileMenuRef.current.contains(event.target) && !event.target.closest('#profile-btn')) {
				setIsProfileMenuOpen(false);
			}
			if (fabMenuRef.current && !fabMenuRef.current.contains(event.target) && !event.target.closest('#fab-btn')) {
				setIsFabMenuOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	useEffect(() => {
		const handleKeyDown = (e) => {
			if (e.key === 'Escape') {
				setIsTaskModalOpen(false);
				setIsNotifOpen(false);
				setIsMobileSidebarOpen(false);
			}
		};
		document.addEventListener('keydown', handleKeyDown);
		return () => document.removeEventListener('keydown', handleKeyDown);
	}, []);

	const handleRefreshStats = (e) => {
		const svg = e.currentTarget.querySelector('svg');
		svg.style.animation = 'spin .6s linear';
		setRefreshTrigger(prev => prev + 1);
		setTimeout(() => { svg.style.animation = ''; }, 650);
	};

	const handleCtxMenuClick = (e) => {
		e.stopPropagation();
		const rect = e.currentTarget.getBoundingClientRect();
		setCtxMenu({
			isOpen: true,
			y: rect.bottom + window.scrollY + 6,
			x: rect.right - 176 + window.scrollX
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

				.shadow-soft { box-shadow: 0 1px 2px rgba(15,23,42,0.04), 0 8px 24px -8px rgba(15,23,42,0.08); }
				.shadow-lift { box-shadow: 0 4px 10px rgba(15,23,42,0.05), 0 20px 40px -16px rgba(15,23,42,0.16); }
				.shadow-glow { box-shadow: 0 0 0 1px rgba(57,142,179,0.10), 0 12px 32px -8px rgba(57,142,179,0.28); }
			`}</style>

			<a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[200] focus:bg-white focus:px-4 focus:py-2 focus:rounded-lg shadow-lift">Lompat ke konten</a>

			<div className="flex min-h-screen">
				<Sidebar collapsed={isSidebarCollapsed} onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />
				<MobileSidebar isOpen={isMobileSidebarOpen} onClose={() => setIsMobileSidebarOpen(false)} />

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
						<main id="main-content" className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-7 space-y-7">
							<Breadcrumb />
							<HeroHeader onOpenTaskModal={() => setIsTaskModalOpen(true)} />
							<QuickActions onOpenTaskModal={() => setIsTaskModalOpen(true)} />
							<StatsGrid refreshTrigger={refreshTrigger} onRefresh={handleRefreshStats} />
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
						</main>

						<RightPanel />
					</div>
				</div>
			</div>

			<FAB
				isOpen={isFabMenuOpen}
				onToggle={() => setIsFabMenuOpen(!isFabMenuOpen)}
				onNewTransaction={() => setIsFabMenuOpen(false)}
				onNewTask={() => { setIsFabMenuOpen(false); setIsTaskModalOpen(true); }}
				onNewMember={() => setIsFabMenuOpen(false)}
				onNewUser={() => { setIsFabMenuOpen(false); setIsUserModalOpen(true); }}
			/>

			<NotificationDrawer isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />

			{ctxMenu.isOpen && (
				<ContextMenu x={ctxMenu.x} y={ctxMenu.y} onClose={() => setCtxMenu(prev => ({ ...prev, isOpen: false }))} />
			)}

			<TaskModal isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)} />

			<UserModal isOpen={isUserModalOpen} onClose={() => setIsUserModalOpen(false)} />
		</div>
	);
}
