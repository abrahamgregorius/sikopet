/** @format */

import { useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import Sidebar from "./components/Sidebar";
import MobileSidebar from "./components/MobileSidebar";
import TopNav from "./components/TopNav";
import Breadcrumb from "./components/Breadcrumb";
import NotificationDrawer from "./components/NotificationDrawer";

export default function GenericModulePage() {
	const params = useParams();
	const moduleKey = Object.values(params)[0];
	const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
	const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
	const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
	const [isNotifOpen, setIsNotifOpen] = useState(false);

	const profileMenuRef = useRef(null);

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (
				profileMenuRef.current &&
				!profileMenuRef.current.contains(event.target) &&
				!event.target.closest("#profile-btn")
			) {
				setIsProfileMenuOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const displayName =
		moduleKey?.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) ||
		"Module";

	return (
		<div className="text-[#0F172A] antialiased bg-[#F7FAFC] font-['Inter',sans-serif]">
			<style>{`
                .font-display { font-family: "Hanken Grotesk", sans-serif; }
                ::selection { background: #67B2D4; color: #fff; }
                .focus-ring:focus-visible { outline: 2px solid #398eb3; outline-offset: 2px; border-radius: 8px; }
                .glass { background: rgba(255,255,255,0.7); backdrop-filter: blur(14px) saturate(160%); -webkit-backdrop-filter: blur(14px) saturate(160%); }
                .overlay { transition: opacity .25s ease; }
                .drawer-panel { transition: transform .32s cubic-bezier(.22,.61,.36,1); }
                .shadow-soft, .shadow-lift, .shadow-glow { box-shadow: none; }
                #sidebar-scroll::-webkit-scrollbar { width: 5px; }
                #sidebar-scroll::-webkit-scrollbar-thumb { background: #D8E4EA; border-radius: 10px; }
            `}</style>

			<div className="flex min-h-screen">
				<Sidebar
					collapsed={isSidebarCollapsed}
					onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
				/>
				<MobileSidebar
					isOpen={isMobileSidebarOpen}
					onClose={() => setIsMobileSidebarOpen(false)}
				/>

				<div className="flex-1 min-w-0 flex flex-col">
					<TopNav
						onMobileMenuToggle={() => setIsMobileSidebarOpen(true)}
						onNotifToggle={() => setIsNotifOpen(true)}
						onProfileToggle={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
						isNotifOpen={isNotifOpen}
						isProfileOpen={isProfileMenuOpen}
						profileRef={profileMenuRef}
					/>

					<main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-7 space-y-6">
						<Breadcrumb />
						<div className="rounded-lg bg-white border border-[#E5E7EB] p-8 text-center">
							<div className="w-16 h-16 rounded-lg bg-[#EAF6FB] grid place-items-center mx-auto mb-4">
								<svg
									width="28"
									height="28"
									viewBox="0 0 24 24"
									fill="none"
									stroke="#398eb3"
									strokeWidth="1.8"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
								</svg>
							</div>
							<h1 className="font-display font-bold text-[24px] text-[#0F172A] mb-2 capitalize">
								{displayName}
							</h1>
							<p className="text-[14px] text-[#6B7280]">
								Halaman ini sedang dalam pengembangan
							</p>
						</div>
					</main>
				</div>
			</div>

			<NotificationDrawer
				isOpen={isNotifOpen}
				onClose={() => setIsNotifOpen(false)}
			/>
		</div>
	);
}
