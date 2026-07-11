/** @format */

import { useEffect, useRef, useState } from "react";

import { SharedStyles } from "../../components/Home";
import MobileSidebar from "../dashboard/components/MobileSidebar";
import Sidebar from "../dashboard/components/Sidebar";
import TopNav from "../dashboard/components/TopNav";

export default function ModuleLayout({ children }) {
	const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
	const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
	const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
	const profileMenuRef = useRef(null);

	useEffect(() => {
		const io = new IntersectionObserver(
			(entries) => {
				entries.forEach((e) => {
					if (e.isIntersecting) {
						e.target.setAttribute("data-revealed", "");
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
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	return (
		<div className="text-[#0F172A] antialiased bg-[#F7FAFC] font-['Inter',sans-serif]">
			<SharedStyles />

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

				<div className="flex-1 min-w-0 flex flex-col">
					<TopNav
						onMobileMenuToggle={() => setIsMobileSidebarOpen(true)}
						onNotifToggle={() => {}}
						onProfileToggle={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
						isNotifOpen={false}
						isProfileOpen={isProfileMenuOpen}
						profileRef={profileMenuRef}
					/>

					<main
						id="main-content"
						className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-7"
					>
						{children}
					</main>
				</div>
			</div>
		</div>
	);
}
