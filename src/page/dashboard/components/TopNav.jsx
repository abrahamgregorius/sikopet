/** @format */

import { useState, useRef, useEffect } from "react";
import { Avatar } from "../../../components/ui";

export default function TopNav({ onMobileMenuToggle, onNotifToggle, onProfileToggle, isNotifOpen, isProfileOpen, profileRef }) {
	return (
		<header className="sticky top-0 z-30 glass border-b border-[#D8E4EA]">
			<div className="h-[72px] flex items-center gap-3 px-4 sm:px-6">
				<button onClick={onMobileMenuToggle} className="focus-ring lg:hidden p-2 -ml-2 text-[#0F172A]" aria-label="Buka menu">
					<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" /></svg>
				</button>

				<div className="flex-1 flex justify-center px-2">
					<label className="relative w-full max-w-[420px]">
						<span className="sr-only">Cari</span>
						<svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" strokeLinecap="round" /></svg>
						<input type="search" placeholder="Cari koperasi, anggota, transaksi…" className="focus-ring w-full pl-10 pr-4 py-2.5 rounded-full bg-[#F1F5F9] border border-transparent focus:border-[#67B2D4] focus:bg-white text-[13.5px] placeholder:text-[#94A3B8] transition-colors" />
					</label>
				</div>

				<div className="flex items-center gap-1.5 sm:gap-2.5">
					<button data-tip="Pesan" className="focus-ring relative p-2.5 rounded-full hover:bg-[#F1F5F9] transition-colors" aria-label="Pesan">
						<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" strokeLinecap="round" strokeLinejoin="round" /></svg>
						<span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#4CC9B0]"></span>
					</button>

					<div className="relative">
						<button onClick={onNotifToggle} data-tip="Notifikasi" className="focus-ring relative p-2.5 rounded-full hover:bg-[#F1F5F9] transition-colors" aria-label="Notifikasi" aria-haspopup="true">
							<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9" strokeLinecap="round" strokeLinejoin="round" /><path d="M13.7 21a2 2 0 01-3.4 0" strokeLinecap="round" /></svg>
							<span className="absolute top-1.5 right-1.5 min-w-[15px] h-[15px] px-[3px] rounded-full bg-[#EF4444] text-white text-[9.5px] font-bold grid place-items-center">5</span>
						</button>
					</div>

					<div className="w-px h-6 bg-[#D8E4EA] mx-1 hidden sm:block"></div>

					<div className="relative" ref={profileRef}>
						<button id="profile-btn" onClick={onProfileToggle} className="focus-ring flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-full hover:bg-[#F1F5F9] transition-colors" aria-haspopup="true" aria-expanded={isProfileOpen}>
							<Avatar size="sm" color="bg-gradient-to-br from-[#398eb3] to-[#2F7698]" initials="AS" />
							<span className="hidden md:flex flex-col items-start leading-tight">
								<span className="text-[13px] font-semibold text-[#0F172A]">Andi Saputra</span>
								<span className="text-[11px] text-[#94A3B8]">Administrator</span>
							</span>
							<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="hidden md:block text-[#94A3B8]"><path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" /></svg>
						</button>

						{isProfileOpen && (
							<div className="pop-enter absolute right-0 top-[calc(100%+10px)] w-64 bg-white rounded-2xl border border-[#D8E4EA] shadow-lift p-2 z-50">
								<div className="px-3.5 py-3 border-b border-[#E8EEF2] mb-1.5">
									<p className="text-[13.5px] font-semibold text-[#0F172A]">Andi Saputra</p>
									<p className="text-[12px] text-[#94A3B8]">andi.saputra@SIKOPET.id</p>
								</div>
								<a href="#" className="focus-ring flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-[13.5px] text-[#475569] hover:bg-[#F1F5F9] transition-colors">
									<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 3.5-7 8-7s8 3 8 7" strokeLinecap="round" /></svg>
									Profil Saya
								</a>
								<a href="#" className="focus-ring flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-[13.5px] text-[#475569] hover:bg-[#F1F5F9] transition-colors">
									<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82" strokeLinecap="round" /></svg>
									Pengaturan Akun
								</a>
								<a href="#" className="focus-ring flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-[13.5px] text-[#475569] hover:bg-[#F1F5F9] transition-colors">
									<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="9" /><path d="M9.5 9a2.5 2.5 0 015 0c0 1.5-2 2-2.5 3M12 17h.01" strokeLinecap="round" /></svg>
									Bantuan
								</a>
								<div className="h-px bg-[#E8EEF2] my-1.5"></div>
								<a href="#" className="focus-ring flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-[13.5px] text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors">
									<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" strokeLinecap="round" strokeLinejoin="round" /></svg>
									Keluar
								</a>
							</div>
						)}
					</div>
				</div>
			</div>
		</header>
	);
}
