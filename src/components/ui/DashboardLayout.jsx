/** @format */

import { useState, useRef, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../../page/dashboard/components/Sidebar";
import MobileSidebar from "../../page/dashboard/components/MobileSidebar";
import TopNav from "../../page/dashboard/components/TopNav";
import Breadcrumb from "../../page/dashboard/components/Breadcrumb";
import NotificationDrawer from "../../page/dashboard/components/NotificationDrawer";

export default function DashboardLayout({ children }) {
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

	return (
		<div className="text-[#0F172A] antialiased bg-[#F7FAFC] font-['Inter',sans-serif]">
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
							className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-7"
						>
							<Breadcrumb />
							{children ? children : <Outlet />}
						</main>
					</div>
				</div>
			</div>

			<NotificationDrawer
				isOpen={isNotifOpen}
				onClose={() => setIsNotifOpen(false)}
			/>
		</div>
	);
}
