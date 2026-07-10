/** @format */

import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import Sidebar from "./components/Sidebar";
import MobileSidebar from "./components/MobileSidebar";
import TopNav from "./components/TopNav";
import ModuleManager from "./components/ModuleManager";
import Breadcrumb from "./components/Breadcrumb";

export default function ModuleManagerPage() {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [isNotifOpen, setIsNotifOpen] = useState(false);

    const profileMenuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target) && !event.target.closest('#profile-btn')) {
                setIsProfileMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="text-[#0F172A] antialiased bg-[#F7FAFC] font-['Inter',sans-serif]">
            <style>{`
                .font-display { font-family: "Hanken Grotesk", sans-serif; }
                ::selection { background: #67B2D4; color: #fff; }
                .focus-ring:focus-visible { outline: 2px solid #398eb3; outline-offset: 2px; border-radius: 8px; }
                .glass { background: rgba(255,255,255,0.7); backdrop-filter: blur(14px) saturate(160%); -webkit-backdrop-filter: blur(14px) saturate(160%); }
                .overlay { transition: opacity .25s ease; }
                .drawer-panel { transition: transform .32s cubic-bezier(.22,.61,.36,1); }
                .shadow-soft { box-shadow: 0 1px 2px rgba(15,23,42,0.04), 0 8px 24px -8px rgba(15,23,42,0.08); }
                .shadow-lift { box-shadow: 0 4px 10px rgba(15,23,42,0.05), 0 20px 40px -16px rgba(15,23,42,0.16); }
                .shadow-glow { box-shadow: 0 0 0 1px rgba(57,142,179,0.10), 0 12px 32px -8px rgba(57,142,179,0.28); }
                #sidebar-scroll::-webkit-scrollbar { width: 5px; }
                #sidebar-scroll::-webkit-scrollbar-thumb { background: #D8E4EA; border-radius: 10px; }
            `}</style>

            <div className="flex min-h-screen">
                <Sidebar collapsed={isSidebarCollapsed} onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />
                <MobileSidebar isOpen={isMobileSidebarOpen} onClose={() => setIsMobileSidebarOpen(false)} />

                <div className="flex-1 min-w-0 flex flex-col">
                    <TopNav
                        onMobileMenuToggle={() => setIsMobileSidebarOpen(true)}
                        onNotifToggle={() => setIsNotifOpen(true)}
                        onProfileToggle={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                        isNotifOpen={isNotifOpen}
                        isProfileOpen={isProfileMenuOpen}
                        profileRef={profileMenuRef}
                    />

                    <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-7">
                        <Breadcrumb />
                        <ModuleManager />
                    </main>
                </div>
            </div>
        </div>
    );
}
