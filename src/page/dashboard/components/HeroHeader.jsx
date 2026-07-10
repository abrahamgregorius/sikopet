/** @format */

import { Button } from "../../../components/ui";

export default function HeroHeader({ onOpenTaskModal }) {
	return (
		<section className="reveal in relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#398eb3] via-[#2F7698] to-[#0F172A] px-6 sm:px-8 py-8 sm:py-9">
			<div className="absolute -top-16 -right-10 w-64 h-64 rounded-full bg-white/10 blur-3xl"></div>
			<div className="absolute -bottom-20 left-1/3 w-72 h-72 rounded-full bg-[#4CC9B0]/20 blur-3xl"></div>
			<div className="relative flex flex-col lg:flex-row lg:items-end justify-between gap-6">
				<div>
					<p className="text-white/70 text-[13px] font-medium">Selasa, 14 Juli 2026 · 09:24 WIB</p>
					<h1 className="font-display font-extrabold text-white text-[26px] sm:text-[30px] tracking-tight mt-1.5">Selamat pagi, Andi 👋</h1>
					<p className="text-white/75 text-[14.5px] mt-2 max-w-[460px]">12 koperasi mengirim laporan baru minggu ini. Ada 4 persetujuan yang menunggu tinjauan Anda.</p>
				</div>
				<div className="flex flex-wrap gap-3">
					<Button onClick={onOpenTaskModal} className="!bg-white !text-[#2F7698] !shadow-lift">
						<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M12 5v14M5 12h14" strokeLinecap="round" /></svg>
						Tugas Baru
					</Button>
					<button className="focus-ring inline-flex items-center gap-2 px-5 py-3 rounded-full border border-white/30 text-white font-semibold text-[14px] hover:bg-white/10 transition-all duration-300">
						Unduh Laporan
					</button>
				</div>
			</div>
		</section>
	);
}
