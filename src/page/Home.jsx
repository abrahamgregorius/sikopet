/** @format */

import React, { useEffect, useRef, useState } from "react";

const StatCounter = ({ end, decimals = 0, suffix = "" }) => {
	const [count, setCount] = useState(0);
	const ref = useRef(null);

	useEffect(() => {
		const el = ref.current;
		if (!el) return;

		const io = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting) {
					const duration = 1400;
					const start = performance.now();

					const tick = (now) => {
						const progress = Math.min((now - start) / duration, 1);
						const eased = 1 - Math.pow(1 - progress, 3);
						setCount(end * eased);
						if (progress < 1) requestAnimationFrame(tick);
					};
					requestAnimationFrame(tick);
					io.unobserve(el);
				}
			},
			{ threshold: 0.4 },
		);

		io.observe(el);
		return () => io.disconnect();
	}, [end]);

	const displayValue = decimals
		? count.toFixed(decimals)
		: Math.round(count).toLocaleString("id-ID");

	return (
		<span ref={ref}>
			{displayValue}
			{suffix}
		</span>
	);
};

const faqs = [
	{
		q: "Bagaimana KOPET bekerja saat tidak ada internet sama sekali?",
		a: "Semua data transaksi tersimpan langsung di perangkat menggunakan basis data lokal Dexie di atas IndexedDB. Aplikasi tetap berfungsi penuh untuk POS, simpan pinjam, gudang, dan logistik — begitu koneksi tersedia kembali, data tersinkron otomatis ke server.",
	},
	{
		q: "Apakah KOPET bisa menggantikan SIMKOPDES?",
		a: "Ya. KOPET dirancang sebagai pengganti SIMKOPDES untuk KDMP — mengintegrasikan profil legal, dokumen, potensi desa, dan permohonan pembiayaan, ditambah unit usaha operasional (POS, simpan pinjam, gudang, logistik) yang tidak ada di SIMKOPDES.",
	},
	{
		q: "Bagaimana dengan integrasi ke sistem pemerintah seperti Dukcapil dan Kemenkumham?",
		a: "KOPET terintegrasi langsung ke API Dukcapil, Kemenkumham/AHU, DJP, Agrinas, dan Bank Himbara — verifikasi NIK, NPAK, NPWP, dan lahan bisa dilakukan dari satu platform tanpa berpindah sistem.",
	},
	{
		q: "Apakah data dari sistem lama bisa dipindahkan ke KOPET?",
		a: "Bisa. Tim implementasi KOPET membantu migrasi data anggota, legalitas, dan riwayat transaksi dari SIMKOPDES maupun spreadsheet tanpa biaya tambahan pada paket tahunan.",
	},
	{
		q: "Berapa lama proses implementasi hingga koperasi bisa mulai memakai KOPET?",
		a: "Rata-rata koperasi dapat mulai beroperasi penuh dalam 1–2 minggu, termasuk pelatihan pengurus, migrasi data awal, dan verifikasi legalitas ke sistem pemerintah.",
	},
];

export default function KOPETApp() {
	const [isScrolled, setIsScrolled] = useState(false);
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [openFaqIndex, setOpenFaqIndex] = useState(null);

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 12);
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	useEffect(() => {
		const io = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						entry.target.setAttribute("data-revealed", "");
						io.unobserve(entry.target);
					}
				});
			},
			{ threshold: 0.15 },
		);

		document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
		return () => io.disconnect();
	}, []);

	const toggleFaq = (index) => {
		setOpenFaqIndex(openFaqIndex === index ? null : index);
	};

	return (
		<div className="font-['Inter',sans-serif] text-[#0F172A] antialiased bg-[#F7FAFC] overflow-x-hidden">
			<style>{`
                html { scroll-behavior: smooth; }
                .font-display { font-family: "Hanken Grotesk", sans-serif; }
                
                .glass-nav {
                    background: rgba(247, 250, 252, 0.72);
                    backdrop-filter: blur(14px) saturate(160%);
                    -webkit-backdrop-filter: blur(14px) saturate(160%);
                    border-bottom: 1px solid rgba(216, 228, 234, 0.6);
                }
                .glass-card {
                    background: rgba(255, 255, 255, 0.62);
                    backdrop-filter: blur(16px) saturate(160%);
                    -webkit-backdrop-filter: blur(16px) saturate(160%);
                    border: 1px solid rgba(255, 255, 255, 0.5);
                }

                .shadow-soft { box-shadow: 0 1px 2px rgba(15,23,42,0.04), 0 8px 24px -8px rgba(15,23,42,0.08); }
                .shadow-lift { box-shadow: 0 4px 10px rgba(15,23,42,0.05), 0 20px 40px -16px rgba(15,23,42,0.16); }
                .shadow-glow { box-shadow: 0 0 0 1px rgba(57,142,179,0.10), 0 12px 32px -8px rgba(57,142,179,0.28); }
                .hover\\:shadow-lift:hover { box-shadow: 0 4px 10px rgba(15,23,42,0.05), 0 20px 40px -16px rgba(15,23,42,0.16); }
                .hover\\:shadow-soft:hover { box-shadow: 0 1px 2px rgba(15,23,42,0.04), 0 8px 24px -8px rgba(15,23,42,0.08); }
                .focus-ring:focus-visible { outline: 2px solid #398eb3; outline-offset: 3px; border-radius: 8px; }

                .reveal {
                    opacity: 0;
                    transform: translateY(18px);
                    transition: opacity 0.7s cubic-bezier(0.22, 0.61, 0.36, 1), transform 0.7s cubic-bezier(0.22, 0.61, 0.36, 1);
                }
                .reveal[data-revealed] { opacity: 1; transform: translateY(0); }
                .reveal-delay-1 { transition-delay: 0.08s; }
                .reveal-delay-2 { transition-delay: 0.16s; }
                .reveal-delay-3 { transition-delay: 0.24s; }

                .blob { filter: blur(70px); }
                
                .node-pulse { animation: nodePulse 2.6s ease-out infinite; }
                @keyframes nodePulse { 0% { transform: scale(0.6); opacity: 0.85; } 70% { transform: scale(2.6); opacity: 0; } 100% { transform: scale(2.6); opacity: 0; } }
                .node-pulse.d1 { animation-delay: 0.3s; }
                .node-pulse.d2 { animation-delay: 0.9s; }
                .node-pulse.d3 { animation-delay: 1.5s; }
                .node-pulse.d4 { animation-delay: 0.6s; }

                .float-y { animation: floatY 6s ease-in-out infinite; }
                .float-y.slow { animation-duration: 8s; }
                .float-y.rev { animation-direction: reverse; }
                @keyframes floatY { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }

                .dash { stroke-dasharray: 6 6; animation: dashMove 3.5s linear infinite; }
                @keyframes dashMove { to { stroke-dashoffset: -60; } }

                .faq-panel { max-height: 0; overflow: hidden; transition: max-height 0.45s ease, padding 0.3s ease; }
                .faq-item.open .faq-panel { max-height: 320px; }
                .faq-item .chev { transition: transform 0.3s ease; }
                .faq-item.open .chev { transform: rotate(180deg); }
                
                ::selection { background: #67b2d4; color: #fff; }
            `}</style>

			{}
			<a
				href="#hero-heading"
				className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:bg-white focus:px-4 focus:py-2 focus:rounded-lg shadow-lift"
			>
				Lompat ke konten utama
			</a>

			<header
				id="site-nav"
				className={`fixed top-0 inset-x-0 z-50 transition-colors duration-300 ${
					isScrolled ? "shadow-soft" : ""
				}`}
			>
				<nav className="glass-nav" aria-label="Navigasi utama">
					<div className="max-w-[1280px] mx-auto px-6 lg:px-10 h-[72px] flex items-center justify-between">
						<a
							href="#hero-heading"
							className="flex items-center gap-2.5 focus-ring"
							aria-label="KOPET — Beranda"
						>
							<span className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-[#398eb3] to-[#4CC9B0] grid place-items-center shadow-soft">
								<svg
									width="18"
									height="18"
									viewBox="0 0 24 24"
									fill="none"
									aria-hidden="true"
								>
									<circle cx="5" cy="12" r="2.2" fill="white" />
									<circle
										cx="12"
										cy="6"
										r="2.2"
										fill="white"
										fillOpacity="0.85"
									/>
									<circle cx="19" cy="12" r="2.2" fill="white" />
									<circle
										cx="12"
										cy="18"
										r="2.2"
										fill="white"
										fillOpacity="0.85"
									/>
									<path
										d="M5 12L12 6M12 6L19 12M19 12L12 18M12 18L5 12"
										stroke="white"
										strokeWidth="1.3"
										strokeOpacity="0.6"
									/>
								</svg>
							</span>
							<span className="font-display font-extrabold text-[19px] tracking-tight text-[#0F172A]">
								KOPET
							</span>
						</a>

						<ul className="hidden lg:flex items-center gap-8 font-medium text-[14.5px] text-[#475569]">
							<li>
								<a
									className="hover:text-[#0F172A] transition-colors focus-ring"
									href="#fitur"
								>
									Modul
								</a>
							</li>
							<li>
								<a
									className="hover:text-[#0F172A] transition-colors focus-ring"
									href="#offline-first"
								>
									Offline-First
								</a>
							</li>
							<li>
								<a
									className="hover:text-[#0F172A] transition-colors focus-ring"
									href="#peran"
								>
									Ekosistem
								</a>
							</li>
							<li>
								<a
									className="hover:text-[#0F172A] transition-colors focus-ring"
									href="#testimoni"
								>
									Testimoni
								</a>
							</li>
							<li>
								<a
									className="hover:text-[#0F172A] transition-colors focus-ring"
									href="#faq"
								>
									FAQ
								</a>
							</li>
						</ul>

						<div className="hidden md:flex items-center gap-2">
							<a
								href="#"
								className="focus-ring px-4 py-2.5 text-[14.5px] font-semibold text-[#475569] hover:text-[#0F172A] transition-colors"
							>
								Masuk
							</a>
							<a
								href="#cta-akhir"
								className="focus-ring px-5 py-2.5 rounded-full bg-[#0F172A] text-white text-[14.5px] font-semibold shadow-soft hover:shadow-lift hover:-translate-y-0.5 transition-all duration-300"
							>
								Coba Gratis
							</a>
						</div>

						<button
							id="menu-toggle"
							className="lg:hidden focus-ring p-2 -mr-2"
							aria-label="Buka menu"
							aria-expanded={isMenuOpen}
							onClick={() => setIsMenuOpen(!isMenuOpen)}
						>
							<svg
								width="22"
								height="22"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="1.8"
							>
								<path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
							</svg>
						</button>
					</div>

					{}
					<div
						id="mobile-menu"
						className={`${isMenuOpen ? "block" : "hidden"} lg:hidden border-t border-[#D8E4EA] px-6 py-5 bg-white/95`}
					>
						<ul className="flex flex-col gap-4 font-medium text-[#475569]">
							<li>
								<a
									href="#fitur"
									className="focus-ring"
									onClick={() => setIsMenuOpen(false)}
								>
									Modul
								</a>
							</li>
							<li>
								<a
									href="#offline-first"
									className="focus-ring"
									onClick={() => setIsMenuOpen(false)}
								>
									Offline-First
								</a>
							</li>
							<li>
								<a
									href="#peran"
									className="focus-ring"
									onClick={() => setIsMenuOpen(false)}
								>
									Ekosistem
								</a>
							</li>
							<li>
								<a
									href="#testimoni"
									className="focus-ring"
									onClick={() => setIsMenuOpen(false)}
								>
									Testimoni
								</a>
							</li>
							<li>
								<a
									href="#faq"
									className="focus-ring"
									onClick={() => setIsMenuOpen(false)}
								>
									FAQ
								</a>
							</li>
						</ul>
						<div className="flex gap-3 mt-5">
							<a
								href="#"
								className="focus-ring flex-1 text-center px-4 py-2.5 rounded-full border border-[#D8E4EA] text-[14.5px] font-semibold text-[#0F172A]"
							>
								Masuk
							</a>
							<a
								href="#cta-akhir"
								className="focus-ring flex-1 text-center px-4 py-2.5 rounded-full bg-[#0F172A] text-white text-[14.5px] font-semibold"
							>
								Coba Gratis
							</a>
						</div>
					</div>
				</nav>
			</header>

			<main>
				{}
				<section className="relative overflow-hidden pt-[150px] pb-20 lg:pt-[176px] lg:pb-28">
					<div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#EAF6FB] via-[#F7FAFC] to-[#F7FAFC]"></div>
					<div className="blob absolute -top-24 -left-24 w-[420px] h-[420px] rounded-full bg-[#67B2D4]/30 -z-10"></div>
					<div className="blob absolute top-40 -right-32 w-[460px] h-[460px] rounded-full bg-[#4CC9B0]/20 -z-10"></div>

					<div className="max-w-[1280px] mx-auto px-6 lg:px-10 grid lg:grid-cols-[1.05fr_0.95fr] gap-16 items-center">
						<div className="reveal">
							<h1
								id="hero-heading"
								className="font-display font-extrabold text-[38px] leading-[1.12] sm:text-[46px] lg:text-[56px] tracking-tight text-[#0F172A] mt-6"
							>
								Platform ERP offline-first untuk{" "}
								<span className="relative inline-block text-[#2F7698]">
									Koperasi Desa.
									<svg
										className="absolute left-0 -bottom-1 w-full"
										height="10"
										viewBox="0 0 220 10"
										fill="none"
										preserveAspectRatio="none"
										aria-hidden="true"
									>
										<path
											d="M2 8C40 2 100 2 218 7"
											stroke="#67B2D4"
											strokeWidth="4"
											strokeLinecap="round"
										/>
									</svg>
								</span>
							</h1>

							<p className="text-[#475569] text-[17px] lg:text-[18px] leading-relaxed mt-6 max-w-[540px]">
								KOPET mengintegrasikan POS toko sembako, simpan pinjam,
								gudang, logistik, dan legalitas koperasi dalam satu sistem
								yang tetap berfungsi penuh tanpa internet — siap menggantikan
								SIMKOPDES untuk KDMP di seluruh Indonesia.
							</p>

							<div className="flex flex-wrap gap-3.5 mt-9">
								<a
									href="#cta-akhir"
									className="focus-ring group inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#398eb3] text-white font-semibold text-[15px] shadow-glow hover:bg-[#2F7698] hover:-translate-y-0.5 transition-all duration-300"
								>
									Mulai Uji Coba Gratis
									<svg
										width="16"
										height="16"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										className="group-hover:translate-x-1 transition-transform"
									>
										<path
											d="M5 12h14M13 6l6 6-6 6"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
									</svg>
								</a>
								<a
									href="#dasbor"
									className="focus-ring inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-[#D8E4EA] bg-white/70 text-[#0F172A] font-semibold text-[15px] hover:bg-white hover:shadow-soft transition-all duration-300"
								>
									<svg width="16" height="16" viewBox="0 0 24 24" fill="none">
										<path d="M8 5v14l11-7z" fill="currentColor" />
									</svg>
									Lihat Demo Produk
								</a>
							</div>

							<div className="flex items-center gap-4 mt-10">
								<div className="flex -space-x-3">
									<span className="w-9 h-9 rounded-full bg-[#67B2D4] border-2 border-white"></span>
									<span className="w-9 h-9 rounded-full bg-[#4CC9B0] border-2 border-white"></span>
									<span className="w-9 h-9 rounded-full bg-[#2F7698] border-2 border-white"></span>
									<span className="w-9 h-9 rounded-full bg-[#0F172A] border-2 border-white grid place-items-center text-[10px] text-white font-bold">
										1K+
									</span>
								</div>
							<p className="text-[13.5px] text-[#94A3B8] leading-snug">
								Dirancang untuk8.494 Koperasi Desa
								<br className="hidden sm:block" />
								Kelurahan Merah Putih se-Indonesia
							</p>
							</div>
						</div>

						<div className="relative reveal reveal-delay-2">
							<div className="relative rounded-[2.25rem] bg-white shadow-lift border border-[#D8E4EA] p-6 sm:p-8 overflow-hidden">
								<div className="flex items-center justify-between mb-5">
									<div>
										<p className="text-[12px] font-semibold text-[#94A3B8] uppercase tracking-wide">
											Status Sinkronisasi
										</p>
										<p className="font-display font-bold text-[#0F172A] text-[16px] mt-0.5">
											Monitoring Blankspot KDP
										</p>
									</div>
									<span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#22C55E] bg-[#22C55E]/10 px-2.5 py-1 rounded-full">
										<span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]"></span>
										Tersambung
									</span>
								</div>

								<svg
									viewBox="0 0 460 280"
									className="w-full h-auto"
									role="img"
									aria-label="Peta sinkronisasi koperasi"
								>
									<g opacity="0.16" fill="#398eb3">
										<ellipse cx="60" cy="150" rx="42" ry="16" />
										<ellipse cx="150" cy="170" rx="60" ry="20" />
										<ellipse cx="255" cy="140" rx="34" ry="14" />
										<ellipse cx="300" cy="180" rx="70" ry="24" />
										<ellipse cx="395" cy="160" rx="40" ry="16" />
										<ellipse cx="230" cy="90" rx="26" ry="10" />
									</g>
									<g
										stroke="#67B2D4"
										strokeWidth="1.4"
										fill="none"
										opacity="0.7"
									>
										<path
											className="dash"
											d="M70 140 C 120 100, 160 100, 190 130"
										/>
										<path
											className="dash"
											d="M190 130 C 230 110, 260 110, 290 135"
										/>
										<path
											className="dash"
											d="M290 135 C 330 110, 360 110, 390 140"
										/>
										<path
											className="dash"
											d="M150 150 C 180 170, 220 175, 250 155"
										/>
									</g>
									<g>
										<circle cx="70" cy="140" r="5" fill="#398eb3" />
										<circle
											cx="70"
											cy="140"
											r="5"
											fill="#398eb3"
											opacity="0.5"
											className="node-pulse d1"
										/>
										<circle cx="190" cy="130" r="6" fill="#2F7698" />
										<circle
											cx="190"
											cy="130"
											r="6"
											fill="#2F7698"
											opacity="0.5"
											className="node-pulse d2"
										/>
										<circle cx="290" cy="135" r="5" fill="#398eb3" />
										<circle
											cx="290"
											cy="135"
											r="5"
											fill="#398eb3"
											opacity="0.5"
											className="node-pulse d3"
										/>
										<circle cx="390" cy="140" r="7" fill="#4CC9B0" />
										<circle
											cx="390"
											cy="140"
											r="7"
											fill="#4CC9B0"
											opacity="0.5"
											className="node-pulse d4"
										/>
										<circle cx="250" cy="155" r="4.5" fill="#67B2D4" />
									</g>
								</svg>

								<div className="grid grid-cols-2 gap-3 mt-5">
									<div className="rounded-2xl bg-[#F1F5F9] px-4 py-3">
										<p className="text-[11.5px] text-[#94A3B8] font-medium">
											Koperasi Blankspot Terlayani
										</p>
										<p className="font-display font-bold text-[#0F172A] text-[18px] mt-0.5">
											216 KDP
										</p>
									</div>
									<div className="rounded-2xl bg-[#F1F5F9] px-4 py-3">
										<p className="text-[11.5px] text-[#94A3B8] font-medium">
											Sinkronisasi Offline
										</p>
										<p className="font-display font-bold text-[#0F172A] text-[18px] mt-0.5">
											99.8%
										</p>
									</div>
								</div>
							</div>

								<div className="float-y absolute -left-6 -bottom-8 sm:-left-10 glass-card rounded-2xl shadow-lift px-4 py-3.5 hidden sm:block">
								<div className="flex items-center gap-2.5">
									<span className="w-8 h-8 rounded-full bg-[#4CC9B0]/15 grid place-items-center">
										<svg
											width="15"
											height="15"
											viewBox="0 0 24 24"
											fill="none"
											stroke="#2F7698"
											strokeWidth="2"
										>
											<path
												d="M5 13l4 4L19 7"
												strokeLinecap="round"
												strokeLinejoin="round"
											/>
										</svg>
									</span>
									<div>
										<p className="text-[11px] text-[#94A3B8] font-medium">
											Sync Otomatis
										</p>
										<p className="text-[13.5px] font-bold text-[#0F172A]">
											Saat Kembali Online
										</p>
									</div>
								</div>
							</div>

							<div className="float-y rev slow absolute -right-4 top-10 sm:-right-8 glass-card rounded-2xl shadow-lift px-4 py-3.5 hidden sm:block">
								<div className="flex items-center gap-2.5">
									<span className="w-8 h-8 rounded-full bg-[#EAF6FB] grid place-items-center">
										<svg
											width="15"
											height="15"
											viewBox="0 0 24 24"
											fill="none"
											stroke="#398eb3"
											strokeWidth="2"
										>
											<circle cx="12" cy="12" r="9" />
											<path d="M12 7v5l3 3" strokeLinecap="round" />
										</svg>
									</span>
									<div>
										<p className="text-[11px] text-[#94A3B8] font-medium">
											Bekerja Tanpa Internet
										</p>
										<p className="text-[13.5px] font-bold text-[#0F172A]">
											Aktif
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>

				{}
				<section
					className="relative -mt-2 lg:-mt-6 pb-6"
					aria-label="Statistik penggunaan KOPET"
				>
					<div className="max-w-[1280px] mx-auto px-6 lg:px-10">
						<div className="reveal rounded-[1.75rem] bg-[#0F172A] px-6 sm:px-10 py-9 sm:py-11 grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 shadow-lift">
							<div className="text-center lg:text-left lg:border-r lg:border-white/10 lg:pr-6">
								<p className="font-display font-extrabold text-white text-[30px] sm:text-[36px] tracking-tight">
									<StatCounter end={8494} suffix="" />
								</p>
								<p className="text-[13px] text-white/60 font-medium mt-1">
									KDMP Target Nasional
								</p>
							</div>
							<div className="text-center lg:text-left lg:border-r lg:border-white/10 lg:pr-6">
								<p className="font-display font-extrabold text-white text-[30px] sm:text-[36px] tracking-tight">
									<StatCounter end={216} suffix="" />
								</p>
								<p className="text-[13px] text-white/60 font-medium mt-1">
									Koperasi Blankspot Jatim
								</p>
							</div>
							<div className="text-center lg:text-left lg:border-r lg:border-white/10 lg:pr-6">
								<p className="font-display font-extrabold text-white text-[30px] sm:text-[36px] tracking-tight">
									<StatCounter end={5} suffix="" />
								</p>
								<p className="text-[13px] text-white/60 font-medium mt-1">
									Modul Operasional Inti
								</p>
							</div>
							<div className="text-center lg:text-left">
								<p className="font-display font-extrabold text-white text-[30px] sm:text-[36px] tracking-tight">
									<StatCounter end={99.8} decimals={1} suffix="%" />
								</p>
								<p className="text-[13px] text-white/60 font-medium mt-1">
									Sinkronisasi Offline Berhasil
								</p>
							</div>
						</div>
					</div>
				</section>

				{}
				<section
					id="fitur"
					className="max-w-[1280px] mx-auto px-6 lg:px-10 py-24 lg:py-32"
				>
					<div className="reveal max-w-[620px] mx-auto text-center mb-16 lg:mb-20">
						<span className="text-[13px] font-bold text-[#2F7698] uppercase tracking-wider">
							Modul Inti
						</span>
						<h2 className="font-display font-extrabold text-[30px] sm:text-[38px] text-[#0F172A] tracking-tight mt-3 leading-tight">
							Seluruh operasional koperasi dalam satu ekosistem
						</h2>
						<p className="text-[#475569] text-[16px] leading-relaxed mt-4">
							Dari kasir toko sembako hingga pengiriman logistik — KOPET
							mengintegrasikan setiap unit usaha dalam satu platform yang
							saling terhubung dan tetap berfungsi tanpa internet.
						</p>
					</div>

					{/* Feature 1 */}
					<div className="reveal grid lg:grid-cols-2 gap-10 lg:gap-16 items-center py-10 lg:py-14">
						<div className="order-2 lg:order-1 rounded-[1.75rem] bg-[#F1F5F9] border border-[#D8E4EA] p-6 lg:p-8">
							<div className="rounded-2xl bg-white border border-[#D8E4EA] shadow-soft p-5">
								<div className="flex items-center justify-between mb-4">
									<p className="font-display font-bold text-[#0F172A] text-[14.5px]">
										Toko Sembako — POS
									</p>
									<span className="text-[11px] font-semibold text-[#22C55E] bg-[#22C55E]/10 px-2 py-0.5 rounded-full">
										Offline OK
									</span>
								</div>
								<div className="space-y-2">
									<div className="flex justify-between text-[13.5px] py-1.5 border-b border-[#E8EEF2]">
										<span className="text-[#475569]">Beras 5kg × 2</span>
										<span className="font-semibold text-[#0F172A]">
											Rp 130.000
										</span>
									</div>
									<div className="flex justify-between text-[13.5px] py-1.5 border-b border-[#E8EEF2]">
										<span className="text-[#475569]">Minyak Goreng 1L</span>
										<span className="font-semibold text-[#0F172A]">
											Rp 18.500
										</span>
									</div>
									<div className="flex justify-between text-[13.5px] py-1.5">
										<span className="text-[#475569]">Gula Pasir 1kg</span>
										<span className="font-semibold text-[#0F172A]">
											Rp 15.000
										</span>
									</div>
								</div>
								<div className="flex justify-between items-center mt-3 pt-3 border-t border-[#D8E4EA]">
									<span className="font-display font-bold text-[#0F172A] text-[15px]">
										Total
									</span>
									<span className="font-display font-bold text-[#2F7698] text-[17px]">
										Rp 163.500
									</span>
								</div>
							</div>
						</div>

						<div className="order-1 lg:order-2">
							<span className="w-12 h-12 rounded-2xl bg-[#EAF6FB] grid place-items-center mb-5">
								<svg
									width="22"
									height="22"
									viewBox="0 0 24 24"
									fill="none"
									stroke="#398eb3"
									strokeWidth="1.8"
								>
									<rect x="3" y="7" width="18" height="13" rx="2" />
									<path
										d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2"
										strokeLinecap="round"
									/>
								</svg>
							</span>
							<h3 className="font-display font-bold text-[24px] text-[#0F172A] tracking-tight">
								Toko Sembako (POS + Inventaris)
							</h3>
							<p className="text-[#475569] leading-relaxed mt-3.5">
								Transaksi jual-beli harian di outlet koperasi berfungsi
								penuh tanpa internet — kasir scan barcode, cetak struk,
								dan pantau stok secara real-time dari perangkat Android.
							</p>
							<ul className="mt-5 space-y-2.5">
								{[
									"Transaksi offline penuh — struk tetap tercetak",
									"Barcode scan & input manual barang",
									"Alert stok menipis dari aturan lokal",
								].map((text, i) => (
									<li
										key={i}
										className="flex items-center gap-2.5 text-[14.5px] text-[#475569]"
									>
										<svg
											width="16"
											height="16"
											viewBox="0 0 24 24"
											fill="none"
											stroke="#4CC9B0"
											strokeWidth="2.5"
											className="shrink-0"
										>
											<path
												d="M5 13l4 4L19 7"
												strokeLinecap="round"
												strokeLinejoin="round"
											/>
										</svg>
										{text}
									</li>
								))}
							</ul>
						</div>
					</div>

					{/* Feature 2 */}
					<div className="reveal grid lg:grid-cols-2 gap-10 lg:gap-16 items-center py-10 lg:py-14">
						<div>
							<span className="w-12 h-12 rounded-2xl bg-[#EAF6FB] grid place-items-center mb-5">
								<svg
									width="22"
									height="22"
									viewBox="0 0 24 24"
									fill="none"
									stroke="#398eb3"
									strokeWidth="1.8"
								>
									<path
										d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
							</span>
							<h3 className="font-display font-bold text-[24px] text-[#0F172A] tracking-tight">
								Simpan Pinjam
							</h3>
							<p className="text-[#475569] leading-relaxed mt-3.5">
								Kelola simpanan wajib, sukarela, dan pengajuan pinjaman anggota
								dengan skema bunga fleksibel — petugas lapangan bisa mencatat
								setoran langsung di lokasi anggota tanpa sinyal.
							</p>
							<ul className="mt-5 space-y-2.5">
								{[
									"Catat mutasi simpanan offline di lokasi anggota",
									"Simulasi & pengajuan pinjaman draft offline",
									"Notifikasi jatuh tempo dari aturan lokal",
								].map((text, i) => (
									<li
										key={i}
										className="flex items-center gap-2.5 text-[14.5px] text-[#475569]"
									>
										<svg
											width="16"
											height="16"
											viewBox="0 0 24 24"
											fill="none"
											stroke="#4CC9B0"
											strokeWidth="2.5"
											className="shrink-0"
										>
											<path
												d="M5 13l4 4L19 7"
												strokeLinecap="round"
												strokeLinejoin="round"
											/>
										</svg>
										{text}
									</li>
								))}
							</ul>
						</div>

						<div className="rounded-[1.75rem] bg-[#F1F5F9] border border-[#D8E4EA] p-6 lg:p-8">
							<div className="rounded-2xl bg-white border border-[#D8E4EA] shadow-soft p-5">
								<p className="font-display font-bold text-[#0F172A] text-[14.5px] mb-3">
									Pinjaman Siti Rahayu
								</p>
								<div className="w-full h-2.5 rounded-full bg-[#D8E4EA] overflow-hidden mb-2">
									<div
										className="h-full rounded-full bg-gradient-to-r from-[#398eb3] to-[#4CC9B0]"
										style={{ width: "68%" }}
									></div>
								</div>
								<div className="flex justify-between text-[12px] text-[#94A3B8] font-medium">
									<span>Rp 3.400.000 terbayar</span>
									<span>68%</span>
								</div>
								<div className="grid grid-cols-3 gap-2 mt-4">
									<div className="rounded-xl bg-[#F1F5F9] px-2.5 py-2 text-center">
										<p className="text-[10px] text-[#94A3B8]">Tenor</p>
										<p className="text-[13px] font-bold text-[#0F172A]">
											12 bln
										</p>
									</div>
									<div className="rounded-xl bg-[#F1F5F9] px-2.5 py-2 text-center">
										<p className="text-[10px] text-[#94A3B8]">Bunga</p>
										<p className="text-[13px] font-bold text-[#0F172A]">1.2%</p>
									</div>
									<div className="rounded-xl bg-[#F1F5F9] px-2.5 py-2 text-center">
										<p className="text-[10px] text-[#94A3B8]">Sisa</p>
										<p className="text-[13px] font-bold text-[#0F172A]">
											4 bln
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Feature 3 */}
					<div className="reveal grid lg:grid-cols-2 gap-10 lg:gap-16 items-center py-10 lg:py-14">
						<div className="order-2 lg:order-1 rounded-[1.75rem] bg-[#F1F5F9] border border-[#D8E4EA] p-6 lg:p-8">
							<div className="rounded-2xl bg-white border border-[#D8E4EA] shadow-soft p-5">
								<div className="flex justify-between items-center mb-4">
									<p className="font-display font-bold text-[#0F172A] text-[14.5px]">
										Stok Gudang
									</p>
									<span className="text-[11px] font-semibold text-[#2F7698] bg-[#EAF6FB] px-2 py-0.5 rounded-full">
										Real-time
									</span>
								</div>
								<div className="space-y-2">
									<div className="flex justify-between text-[13.5px] py-1.5 border-b border-[#E8EEF2]">
										<span className="text-[#475569]">Beras Premium 5kg</span>
										<span className="font-semibold text-[#0F172A]">
											1.200 kg
										</span>
									</div>
									<div className="flex justify-between text-[13.5px] py-1.5 border-b border-[#E8EEF2]">
										<span className="text-[#475569]">Minyak Goreng 1L</span>
										<span className="font-semibold text-[#0F172A]">
											480 liter
										</span>
									</div>
									<div className="flex justify-between text-[13.5px] py-1.5">
										<span className="text-[#475569]">Gula Pasir 1kg</span>
										<span className="font-semibold text-[#0F172A]">
											320 kg
										</span>
									</div>
								</div>
								<div className="flex justify-between items-center mt-3 pt-3 border-t border-[#D8E4EA]">
									<span className="font-display font-bold text-[#0F172A] text-[15px]">
										Total Item
									</span>
									<span className="font-display font-bold text-[#2F7698] text-[17px]">
										24 Produk
									</span>
								</div>
							</div>
						</div>

						<div className="order-1 lg:order-2">
							<span className="w-12 h-12 rounded-2xl bg-[#EAF6FB] grid place-items-center mb-5">
								<svg
									width="22"
									height="22"
									viewBox="0 0 24 24"
									fill="none"
									stroke="#398eb3"
									strokeWidth="1.8"
								>
									<path
										d="M20 7h-3V5a2 2 0 00-2-2H9a2 2 0 00-2 2v2H4a1 1 0 00-1 1v11a1 1 0 001 1h16a1 1 0 001-1V8a1 1 0 00-1-1zM9 5h6v2H9V5z"
										strokeLinejoin="round"
									/>
								</svg>
							</span>
							<h3 className="font-display font-bold text-[24px] text-[#0F172A] tracking-tight">
								Gudang & Inventaris
							</h3>
							<p className="text-[#475569] leading-relaxed mt-3.5">
								Kelola penerimaan barang dari petani/produsen, transfer stok
								antar gudang dan toko, serta stok opname — semua dengan foto
								QC dan pencatatan ledger yang tidak bisa di-overwrite.
							</p>
							<ul className="mt-5 space-y-2.5">
								{[
									"Penerimaan barang + foto QC tanpa sinyal",
									"Transfer stok antar gudang & toko",
									"Stok opname dengan approval otomatis",
								].map((text, i) => (
									<li
										key={i}
										className="flex items-center gap-2.5 text-[14.5px] text-[#475569]"
									>
										<svg
											width="16"
											height="16"
											viewBox="0 0 24 24"
											fill="none"
											stroke="#4CC9B0"
											strokeWidth="2.5"
											className="shrink-0"
										>
											<path
												d="M5 13l4 4L19 7"
												strokeLinecap="round"
												strokeLinejoin="round"
											/>
										</svg>
										{text}
									</li>
								))}
							</ul>
						</div>
					</div>

					{/* Feature 4 */}
					<div className="reveal grid lg:grid-cols-2 gap-10 lg:gap-16 items-center py-10 lg:py-14">
						<div>
							<span className="w-12 h-12 rounded-2xl bg-[#EAF6FB] grid place-items-center mb-5">
								<svg
									width="22"
									height="22"
									viewBox="0 0 24 24"
									fill="none"
									stroke="#398eb3"
									strokeWidth="1.8"
								>
									<path
										d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
									<circle cx="12" cy="12" r="3" />
								</svg>
							</span>
							<h3 className="font-display font-bold text-[24px] text-[#0F172A] tracking-tight">
								Logistik & Pengiriman
							</h3>
							<p className="text-[#475569] leading-relaxed mt-3.5">
								Atur jadwal pengiriman, penugasan sopir dan kendaraan, serta
								appointment dengan tujuan — semuanya bisa diakses sepanjang hari
								meski tidak ada sinyal di jalan.
							</p>
							<ul className="mt-5 space-y-2.5">
								{[
									"Jadwal & appointment terlihat tanpa internet",
									"Bukti terima tanda tangan & foto di lokasi",
									"Deteksi konflik alokasi kendaraan saat sync",
								].map((text, i) => (
									<li
										key={i}
										className="flex items-center gap-2.5 text-[14.5px] text-[#475569]"
									>
										<svg
											width="16"
											height="16"
											viewBox="0 0 24 24"
											fill="none"
											stroke="#4CC9B0"
											strokeWidth="2.5"
											className="shrink-0"
										>
											<path
												d="M5 13l4 4L19 7"
												strokeLinecap="round"
												strokeLinejoin="round"
											/>
										</svg>
										{text}
									</li>
								))}
							</ul>
						</div>

						<div className="rounded-[1.75rem] bg-[#F1F5F9] border border-[#D8E4EA] p-6 lg:p-8">
							<div className="rounded-2xl bg-white border border-[#D8E4EA] shadow-soft p-5">
								<p className="font-display font-bold text-[#0F172A] text-[14.5px] mb-3">
									Jadwal Pengiriman Hari Ini
								</p>
								<div className="space-y-2.5">
									<div className="flex items-center gap-3 rounded-xl bg-[#F1F5F9] px-3 py-2.5">
										<span className="w-8 h-8 rounded-full bg-[#4CC9B0] grid place-items-center text-white text-[11px] font-bold shrink-0">
											1
										</span>
										<div className="flex-1">
											<p className="text-[13px] font-semibold text-[#0F172A]">
												Toko Maju Jaya
											</p>
											<p className="text-[11px] text-[#94A3B8]">
												08:00 — B 1234 CD
											</p>
										</div>
										<span className="text-[11px] font-semibold text-[#22C55E] bg-[#22C55E]/10 px-2 py-0.5 rounded-full">
											Selesai
										</span>
									</div>
									<div className="flex items-center gap-3 rounded-xl bg-[#F1F5F9] px-3 py-2.5">
										<span className="w-8 h-8 rounded-full bg-[#398eb3] grid place-items-center text-white text-[11px] font-bold shrink-0">
											2
										</span>
										<div className="flex-1">
											<p className="text-[13px] font-semibold text-[#0F172A]">
												Gudang Pusat
											</p>
											<p className="text-[11px] text-[#94A3B8]">
												11:00 — B 5678 EF
											</p>
										</div>
										<span className="text-[11px] font-semibold text-[#F59E0B] bg-[#F59E0B]/10 px-2 py-0.5 rounded-full">
											Dalam Perjalanan
										</span>
									</div>
									<div className="flex items-center gap-3 rounded-xl bg-[#F1F5F9] px-3 py-2.5">
										<span className="w-8 h-8 rounded-full bg-[#67B2D4] grid place-items-center text-white text-[11px] font-bold shrink-0">
											3
										</span>
										<div className="flex-1">
											<p className="text-[13px] font-semibold text-[#0F172A]">
												Toko Barokah
											</p>
											<p className="text-[11px] text-[#94A3B8]">
												14:00 — B 9012 GH
											</p>
										</div>
										<span className="text-[11px] font-semibold text-[#94A3B8] bg-[#F1F5F9] px-2 py-0.5 rounded-full">
											Terjadwal
										</span>
									</div>
								</div>
							</div>
						</div>
					</div>

					{}
					<div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-8">
						<div className="reveal rounded-2xl bg-white border border-[#D8E4EA] p-6 hover:shadow-lift hover:-translate-y-1 transition-all duration-300">
							<span className="w-10 h-10 rounded-xl bg-[#EAF6FB] grid place-items-center mb-4">
								<svg
									width="18"
									height="18"
									viewBox="0 0 24 24"
									fill="none"
									stroke="#398eb3"
									strokeWidth="1.8"
								>
									<path
										d="M9 12h6M12 9v6M3 7h18v14H3z"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
							</span>
							<h4 className="font-display font-bold text-[#0F172A] text-[16px]">
								Legalitas & Integrasi
							</h4>
							<p className="text-[13.5px] text-[#475569] leading-relaxed mt-2">
								Verifikasi NIK, NPAK, NPWP ke Dukcapil, Kemenkumham, DJP
								dari satu platform — pengganti SIMKOPDES.
							</p>
						</div>
						<div className="reveal reveal-delay-1 rounded-2xl bg-white border border-[#D8E4EA] p-6 hover:shadow-lift hover:-translate-y-1 transition-all duration-300">
							<span className="w-10 h-10 rounded-xl bg-[#EAF6FB] grid place-items-center mb-4">
								<svg
									width="18"
									height="18"
									viewBox="0 0 24 24"
									fill="none"
									stroke="#398eb3"
									strokeWidth="1.8"
								>
									<path
										d="M4 12a8 8 0 0114-5.3M20 12a8 8 0 01-14 5.3M4 4v5h5M20 20v-5h-5"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
							</span>
							<h4 className="font-display font-bold text-[#0F172A] text-[16px]">
								Sync Engine Batch
							</h4>
							<p className="text-[13.5px] text-[#475569] leading-relaxed mt-2">
								Seluruh mutasi lokal tersinkron otomatis ke server dengan
								idempotency key & resolusi konflik.
							</p>
						</div>
						<div className="reveal reveal-delay-2 rounded-2xl bg-white border border-[#D8E4EA] p-6 hover:shadow-lift hover:-translate-y-1 transition-all duration-300">
							<span className="w-10 h-10 rounded-xl bg-[#EAF6FB] grid place-items-center mb-4">
								<svg
									width="18"
									height="18"
									viewBox="0 0 24 24"
									fill="none"
									stroke="#398eb3"
									strokeWidth="1.8"
								>
									<path
										d="M9 17V9M13 17v-4M17 17V6M4 4h16v16H4z"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
							</span>
							<h4 className="font-display font-bold text-[#0F172A] text-[16px]">
								Dashboard Bertingkat
							</h4>
							<p className="text-[13.5px] text-[#475569] leading-relaxed mt-2">
								Visibilitas berjenjang untuk Pengurus, BA, PMO, hingga
								Dinas/Kementerian — sesuai peran masing-masing.
							</p>
						</div>
						<div className="reveal reveal-delay-3 rounded-2xl bg-white border border-[#D8E4EA] p-6 hover:shadow-lift hover:-translate-y-1 transition-all duration-300">
							<span className="w-10 h-10 rounded-xl bg-[#EAF6FB] grid place-items-center mb-4">
								<svg
									width="18"
									height="18"
									viewBox="0 0 24 24"
									fill="none"
									stroke="#398eb3"
									strokeWidth="1.8"
								>
									<path
										d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
							</span>
							<h4 className="font-display font-bold text-[#0F172A] text-[16px]">
								AI Cache & Rules
							</h4>
							<p className="text-[13.5px] text-[#475569] leading-relaxed mt-2">
								Alert stok, rekomendasi restock, dan deteksi tren tunggakan
								berjalan lokal tanpa perlu inferensi server.
							</p>
						</div>
					</div>
				</section>

				{}
				<section
					id="dasbor"
					className="relative py-24 lg:py-32 overflow-hidden"
				>
					<div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#F7FAFC] via-[#EAF6FB]/60 to-[#F7FAFC]"></div>
					<div className="max-w-[1280px] mx-auto px-6 lg:px-10">
					<div className="reveal max-w-[620px] mx-auto text-center mb-14">
						<span className="text-[13px] font-bold text-[#2F7698] uppercase tracking-wider">
							Dashboard Bertingkat
						</span>
						<h2 className="font-display font-extrabold text-[30px] sm:text-[38px] text-[#0F172A] tracking-tight mt-3 leading-tight">
							Visibilitas sesuai peran — dari lapangan hingga pusat
						</h2>
					</div>

						<div className="reveal relative max-w-[980px] mx-auto">
							<div className="rounded-[2.25rem] bg-white border border-[#D8E4EA] shadow-lift p-3 sm:p-4">
								<div className="rounded-[1.75rem] bg-[#F1F5F9] overflow-hidden">
									<div className="flex items-center gap-1.5 px-5 py-3.5 border-b border-[#D8E4EA] bg-white">
										<span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]/70"></span>
										<span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]/70"></span>
										<span className="w-2.5 h-2.5 rounded-full bg-[#22C55E]/70"></span>
										<span className="ml-4 text-[12px] text-[#94A3B8] font-medium">
											app.nusara.id/dasbor
										</span>
									</div>
									<div className="grid lg:grid-cols-[220px_1fr] min-h-[340px]">
										<div className="hidden lg:block border-r border-[#D8E4EA] bg-white p-5 space-y-1.5">
											<div className="px-3 py-2 rounded-lg bg-[#EAF6FB] text-[#2F7698] text-[13px] font-semibold">
												Ringkasan
											</div>
											<div className="px-3 py-2 rounded-lg text-[#475569] text-[13px] font-medium">
												Toko Sembako
											</div>
											<div className="px-3 py-2 rounded-lg text-[#475569] text-[13px] font-medium">
												Simpan Pinjam
											</div>
											<div className="px-3 py-2 rounded-lg text-[#475569] text-[13px] font-medium">
												Gudang
											</div>
											<div className="px-3 py-2 rounded-lg text-[#475569] text-[13px] font-medium">
												Logistik
											</div>
											<div className="px-3 py-2 rounded-lg text-[#475569] text-[13px] font-medium">
												Legalitas
											</div>
										</div>
										<div className="p-5 sm:p-7 grid sm:grid-cols-2 gap-4">
											<div className="rounded-2xl bg-white border border-[#D8E4EA] p-5 shadow-soft">
												<p className="text-[12px] text-[#94A3B8] font-medium">
													Total Anggota
												</p>
												<p className="font-display font-bold text-[#0F172A] text-[22px] mt-1">
													2.318
												</p>
												<p className="text-[12px] text-[#22C55E] font-semibold mt-1">
													+48 minggu ini
												</p>
											</div>
											<div className="rounded-2xl bg-white border border-[#D8E4EA] p-5 shadow-soft">
												<p className="text-[12px] text-[#94A3B8] font-medium">
													Pengajuan Pending
												</p>
												<p className="font-display font-bold text-[#0F172A] text-[22px] mt-1">
													12 Pinjaman
												</p>
												<p className="text-[12px] text-[#F59E0B] font-semibold mt-1">
													Butuh approval BA
												</p>
											</div>
											<div className="rounded-2xl bg-white border border-[#D8E4EA] p-5 shadow-soft">
												<p className="text-[12px] text-[#94A3B8] font-medium">
													Item Pending Sync
												</p>
												<p className="font-display font-bold text-[#0F172A] text-[22px] mt-1">
													34 Item
												</p>
												<p className="text-[12px] text-[#EF4444] font-semibold mt-1">
													Butuh koneksi stabil
												</p>
											</div>
											<div className="rounded-2xl bg-white border border-[#D8E4EA] p-5 shadow-soft">
												<p className="text-[12px] text-[#94A3B8] font-medium">
													Status Sinkronisasi
												</p>
												<p className="font-display font-bold text-[#0F172A] text-[22px] mt-1">
													Tersambung
												</p>
												<p className="text-[12px] text-[#94A3B8] font-semibold mt-1">
													Terakhir: 2 menit lalu
												</p>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className="float-y absolute -left-6 sm:-left-12 top-16 glass-card rounded-2xl shadow-lift px-4 py-3 hidden md:block">
								<p className="text-[11px] text-[#94A3B8] font-medium">
									Anggota Baru
								</p>
								<p className="text-[15px] font-bold text-[#0F172A]">
									+48{" "}
									<span className="text-[#22C55E] text-[11px] font-semibold">
										minggu ini
									</span>
								</p>
							</div>
							<div className="float-y rev slow absolute -right-6 sm:-right-10 bottom-16 glass-card rounded-2xl shadow-lift px-4 py-3 hidden md:block">
								<p className="text-[11px] text-[#94A3B8] font-medium">
									Audit Terjadwal
								</p>
								<p className="text-[15px] font-bold text-[#0F172A]">
									14 Agu 2026
								</p>
							</div>
						</div>
					</div>
				</section>

				{}
				<section
					id="offline-first"
					className="max-w-[1280px] mx-auto px-6 lg:px-10 py-24 lg:py-32"
				>
					<div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-14 items-center">
						<div className="reveal">
							<span className="text-[13px] font-bold text-[#2F7698] uppercase tracking-wider">
								Arsitektur Offline-First
							</span>
							<h2 className="font-display font-extrabold text-[30px] sm:text-[36px] text-[#0F172A] tracking-tight mt-3 leading-tight">
								Dibangun untuk koperasi di area blankspot
							</h2>
							<p className="text-[#475569] leading-relaxed mt-4">
								SIMKOPDES tidak bisa diakses tanpa internet — KOPET dirancang
								untuk wilayah di mana konektivitas terbatas. Data tersimpan
								langsung di perangkat, lalu tersinkron otomatis begitu koneksi
								kembali, tanpa ada transaksi yang hilang.
							</p>

							<div className="mt-7 space-y-4">
								<div className="flex gap-3.5">
									<span className="w-8 h-8 shrink-0 rounded-lg bg-[#EAF6FB] grid place-items-center text-[#2F7698] font-display font-bold text-[13px]">
										1
									</span>
									<div>
										<p className="font-semibold text-[#0F172A] text-[15px]">
											Transaksi dicatat lokal
										</p>
										<p className="text-[13.5px] text-[#475569] mt-0.5">
											Disimpan langsung di perangkat lewat basis data lokal
											Dexie di atas IndexedDB browser.
										</p>
									</div>
								</div>
								<div className="flex gap-3.5">
									<span className="w-8 h-8 shrink-0 rounded-lg bg-[#EAF6FB] grid place-items-center text-[#2F7698] font-display font-bold text-[13px]">
										2
									</span>
									<div>
										<p className="font-semibold text-[#0F172A] text-[15px]">
											Sinkron otomatis di latar belakang
										</p>
										<p className="text-[13.5px] text-[#475569] mt-0.5">
											Begitu sinyal kembali, data terkirim ke server tanpa perlu
											tindakan manual dari pengguna.
										</p>
									</div>
								</div>
								<div className="flex gap-3.5">
									<span className="w-8 h-8 shrink-0 rounded-lg bg-[#EAF6FB] grid place-items-center text-[#2F7698] font-display font-bold text-[13px]">
										3
									</span>
									<div>
										<p className="font-semibold text-[#0F172A] text-[15px]">
											Konflik data diselesaikan otomatis
										</p>
										<p className="text-[13.5px] text-[#475569] mt-0.5">
											Perubahan ganda dari beberapa perangkat digabung dengan
											aturan penyelesaian konflik yang aman.
										</p>
									</div>
								</div>
							</div>
						</div>

						<div className="reveal reveal-delay-2 rounded-[2.25rem] bg-[#0F172A] p-8 sm:p-10 relative overflow-hidden">
							<div className="blob absolute -top-10 -right-10 w-64 h-64 rounded-full bg-[#398eb3]/30"></div>
							<div className="relative grid gap-4">
								<div className="glass-card rounded-2xl px-5 py-4 flex items-center justify-between !bg-white/10 !border-white/15">
									<div className="flex items-center gap-3">
										<svg
											width="18"
											height="18"
											viewBox="0 0 24 24"
											fill="none"
											stroke="#67B2D4"
											strokeWidth="1.8"
										>
											<rect x="4" y="2" width="16" height="20" rx="2" />
											<path d="M9 6h6" strokeLinecap="round" />
										</svg>
										<span className="text-white font-semibold text-[14px]">
											Perangkat Pengurus / Kasir
										</span>
									</div>
									<span className="text-[11px] text-white/60 font-medium">
										Aktif
									</span>
								</div>

								<div className="flex justify-center">
									<svg width="2" height="28" viewBox="0 0 2 28">
										<line
											x1="1"
											y1="0"
											x2="1"
											y2="28"
											stroke="#67B2D4"
											strokeWidth="2"
											strokeDasharray="4 4"
											className="dash"
										/>
									</svg>
								</div>

								<div className="glass-card rounded-2xl px-5 py-4 !bg-white/10 !border-white/15">
									<div className="flex items-center gap-3 mb-1">
										<svg
											width="18"
											height="18"
											viewBox="0 0 24 24"
											fill="none"
											stroke="#4CC9B0"
											strokeWidth="1.8"
										>
											<ellipse cx="12" cy="6" rx="8" ry="3" />
											<path
												d="M4 6v6c0 1.66 3.58 3 8 3s8-1.34 8-3V6M4 12v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6"
												strokeLinecap="round"
											/>
										</svg>
										<span className="text-white font-semibold text-[14px]">
											Basis Data Lokal — Dexie / IndexedDB
										</span>
									</div>
									<p className="text-white/55 text-[12.5px] pl-8">
										Menyimpan seluruh transaksi walau tanpa sinyal
									</p>
								</div>

								<div className="flex justify-center">
									<svg width="2" height="28" viewBox="0 0 2 28">
										<line
											x1="1"
											y1="0"
											x2="1"
											y2="28"
											stroke="#67B2D4"
											strokeWidth="2"
											strokeDasharray="4 4"
											className="dash"
										/>
									</svg>
								</div>

								<div className="glass-card rounded-2xl px-5 py-4 !bg-white/10 !border-white/15">
									<div className="flex items-center gap-3 mb-1">
										<svg
											width="18"
											height="18"
											viewBox="0 0 24 24"
											fill="none"
											stroke="#67B2D4"
											strokeWidth="1.8"
										>
											<path
												d="M4 12a8 8 0 0114-5.3M20 12a8 8 0 01-14 5.3M4 4v5h5M20 20v-5h-5"
												strokeLinecap="round"
												strokeLinejoin="round"
											/>
										</svg>
										<span className="text-white font-semibold text-[14px]">
											Mesin Sinkronisasi
										</span>
									</div>
									<p className="text-white/55 text-[12.5px] pl-8">
										Mendeteksi & menyatukan konflik data antar perangkat
									</p>
								</div>

								<div className="flex justify-center">
									<svg width="2" height="28" viewBox="0 0 2 28">
										<line
											x1="1"
											y1="0"
											x2="1"
											y2="28"
											stroke="#67B2D4"
											strokeWidth="2"
											strokeDasharray="4 4"
											className="dash"
										/>
									</svg>
								</div>

								<div className="rounded-2xl px-5 py-4 bg-gradient-to-r from-[#398eb3] to-[#4CC9B0] flex items-center gap-3">
									<svg
										width="18"
										height="18"
										viewBox="0 0 24 24"
										fill="none"
										stroke="white"
										strokeWidth="1.8"
									>
										<path
											d="M12 3v12M6 9l6-6 6 6M5 21h14"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
									</svg>
									<span className="text-white font-semibold text-[14px]">
										Server Pusat KOPET
									</span>
								</div>
							</div>
						</div>
					</div>
				</section>

				{}
				<section id="peran" className="py-24 lg:py-32 bg-[#F1F5F9]">
					<div className="max-w-[1280px] mx-auto px-6 lg:px-10">
					<div className="reveal max-w-[620px] mx-auto text-center mb-14">
						<span className="text-[13px] font-bold text-[#2F7698] uppercase tracking-wider">
							Untuk Seluruh Ekosistem
						</span>
						<h2 className="font-display font-extrabold text-[30px] sm:text-[38px] text-[#0F172A] tracking-tight mt-3 leading-tight">
							Satu platform, setiap peran terhubung
						</h2>
						<p className="text-[#475569] text-[16px] leading-relaxed mt-4">
							Dari kasir di lapangan hingga Dinas Kementerian di pusat — hak
							akses disesuaikan otomatis sesuai tugas masing-masing.
						</p>
					</div>

					<div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
						{[
							{
								l: "K",
								title: "Kasir",
								desc: "Transaksi POS harian",
								g: "from-[#4CC9B0] to-[#398eb3]",
							},
							{
								l: "P",
								title: "Petugas Lapangan",
								desc: "Simpan pinjam offline",
								g: "from-[#398eb3] to-[#2F7698]",
							},
							{
								l: "G",
								title: "Petugas Gudang",
								desc: "Stok & penerimaan",
								g: "from-[#67B2D4] to-[#398eb3]",
							},
							{
								l: "S",
								title: "Sopir & Koordinator",
								desc: "Logistik & pengiriman",
								g: "from-[#398eb3] to-[#4CC9B0]",
							},
							{
								l: "P",
								title: "Pengurus",
								desc: "Profil & legalitas",
								g: "from-[#2F7698] to-[#0F172A]",
							},
							{
								l: "A",
								title: "Anggota",
								desc: "Simpanan & pinjaman",
								g: "from-[#EAF6FB] to-[#67B2D4]",
								tc: "text-[#2F7698]",
							},
							{
								l: "B",
								title: "Business Assistant",
								desc: "Approval & monitoring",
								g: "from-[#F59E0B] to-[#2F7698]",
							},
							{
								l: "M",
								title: "PMO & Dinas",
								desc: "Agregasi lintas-koperasi",
								g: "from-[#4CC9B0] to-[#0F172A]",
							},
						].map((role, i) => (
								<div
									key={i}
									className={`reveal reveal-delay-${i % 4} rounded-2xl bg-white border border-[#D8E4EA] p-5 text-center hover:-translate-y-1 hover:shadow-soft transition-all duration-300`}
								>
									<span
										className={`w-14 h-14 mx-auto rounded-full bg-gradient-to-br ${role.g} grid place-items-center ${role.tc || "text-white"} font-display font-bold text-[16px]`}
									>
										{role.l}
									</span>
									<p className="font-semibold text-[#0F172A] text-[14.5px] mt-3">
										{role.title}
									</p>
									<p className="text-[12px] text-[#94A3B8] mt-0.5">
										{role.desc}
									</p>
								</div>
							))}
						</div>
					</div>
				</section>

				{}
				<section className="max-w-[1280px] mx-auto px-6 lg:px-10 py-24 lg:py-32">
					<div className="reveal max-w-[620px] mx-auto text-center mb-14">
						<span className="text-[13px] font-bold text-[#2F7698] uppercase tracking-wider">
							Sebelum & Sesudah
						</span>
						<h2 className="font-display font-extrabold text-[30px] sm:text-[38px] text-[#0F172A] tracking-tight mt-3 leading-tight">
							Dari keterbatasan SIMKOPDES, ke solusi yang bekerja untuk Anda
						</h2>
					</div>

					<div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
						{[
							{
								old: "SIMKOPDES tidak bisa diakses di area blankspot — 216 koperasi di Jatim gagal update data.",
								new: "KOPET berfungsi penuh tanpa internet, data tersinkron otomatis saat kembali online.",
							},
							{
								old: "POS dan simpan pinjam masih dicatat manual di kertas/Excel, rawan selisih.",
								new: "Seluruh unit usaha tercatat digital real-time dari satu platform.",
							},
							{
								old: "Data keuangan tersebar di banyak buku dan file, sulit direkonsiliasi.",
								new: "Semua data teragregasi dalam satu sistem dengan jejak audit lengkap.",
							},
							{
								old: "Verifikasi legalitas harus dilakukan terpisah di berbagai sistem pemerintah.",
								new: "Integrasi Dukcapil, Kemenkumham, DJP, dan Bank Himbara dari satu platform.",
							},
						].map((item, i) => (
							<div
								key={i}
								className={`reveal reveal-delay-${i} rounded-[1.75rem] border border-[#D8E4EA] overflow-hidden`}
							>
								<div className="p-6 bg-[#F1F5F9]">
									<p className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wide mb-2">
										SIMKOPDES / Manual
									</p>
									<p className="text-[14.5px] text-[#475569] leading-relaxed">
										{item.old}
									</p>
								</div>
								<div className="p-6 bg-white border-t border-[#D8E4EA]">
									<p className="text-[11px] font-bold text-[#2F7698] uppercase tracking-wide mb-2">
										Dengan KOPET
									</p>
									<p className="text-[14.5px] text-[#0F172A] font-medium leading-relaxed">
										{item.new}
									</p>
								</div>
							</div>
						))}
					</div>
				</section>

				{}
				<section
					id="testimoni"
					className="relative py-24 lg:py-32 overflow-hidden"
				>
					<div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#EAF6FB]/70 via-[#F7FAFC] to-[#F7FAFC]"></div>
					<div className="max-w-[1280px] mx-auto px-6 lg:px-10">
						<div className="reveal max-w-[620px] mx-auto text-center mb-14">
						<span className="text-[13px] font-bold text-[#2F7698] uppercase tracking-wider">
							Kata Pengurus Koperasi Desa
						</span>
						<h2 className="font-display font-extrabold text-[30px] sm:text-[38px] text-[#0F172A] tracking-tight mt-3 leading-tight">
							Dipercaya pengurus KDMP dari Sabang sampai Merauke
						</h2>
					</div>

						<div className="grid lg:grid-cols-3 gap-6">
							<blockquote className="reveal glass-card rounded-[1.75rem] p-7 shadow-soft">
								<svg
									width="26"
									height="20"
									viewBox="0 0 26 20"
									fill="#67B2D4"
									className="mb-4"
								>
									<path d="M0 20V11.5C0 4.5 4 0 10.5 0v4.5C7 5 5 7 5 11.5H10V20H0zM15.5 20V11.5C15.5 4.5 19.5 0 26 0v4.5c-3.5.5-5.5 2.5-5.5 7H26V20h-10.5z" />
								</svg>
								<p className="text-[#475569] leading-relaxed text-[15px]">
									Sejak pakai KOPET, tutup buku bulanan yang dulu makan waktu
									seminggu sekarang selesai dalam sehari. Pengurus jadi bisa
									fokus melayani anggota.
								</p>
								<footer className="flex items-center gap-3 mt-6">
									<span className="w-10 h-10 rounded-full bg-[#67B2D4]"></span>
									<div>
										<p className="font-semibold text-[#0F172A] text-[14px]">
											Rina Wulandari
										</p>
										<p className="text-[12.5px] text-[#94A3B8]">
											Ketua Koperasi Sejahtera Bersama, Klaten
										</p>
									</div>
								</footer>
							</blockquote>

							<blockquote className="reveal reveal-delay-1 glass-card rounded-[1.75rem] p-7 shadow-soft lg:mt-8">
								<svg
									width="26"
									height="20"
									viewBox="0 0 26 20"
									fill="#67B2D4"
									className="mb-4"
								>
									<path d="M0 20V11.5C0 4.5 4 0 10.5 0v4.5C7 5 5 7 5 11.5H10V20H0zM15.5 20V11.5C15.5 4.5 19.5 0 26 0v4.5c-3.5.5-5.5 2.5-5.5 7H26V20h-10.5z" />
								</svg>
								<p className="text-[#475569] leading-relaxed text-[15px]">
									Lokasi kami sering mati sinyal. Justru fitur offline KOPET
									yang membuat kasir tetap jalan tanpa gangguan — transaksi
									tidak pernah hilang.
								</p>
								<footer className="flex items-center gap-3 mt-6">
									<span className="w-10 h-10 rounded-full bg-[#4CC9B0]"></span>
									<div>
										<p className="font-semibold text-[#0F172A] text-[14px]">
											Bambang Sutrisno
										</p>
										<p className="text-[12.5px] text-[#94A3B8]">
											Bendahara Koperasi Tani Makmur, Toraja
										</p>
									</div>
								</footer>
							</blockquote>

							<blockquote className="reveal reveal-delay-2 glass-card rounded-[1.75rem] p-7 shadow-soft">
								<svg
									width="26"
									height="20"
									viewBox="0 0 26 20"
									fill="#67B2D4"
									className="mb-4"
								>
									<path d="M0 20V11.5C0 4.5 4 0 10.5 0v4.5C7 5 5 7 5 11.5H10V20H0zM15.5 20V11.5C15.5 4.5 19.5 0 26 0v4.5c-3.5.5-5.5 2.5-5.5 7H26V20h-10.5z" />
								</svg>
								<p className="text-[#475569] leading-relaxed text-[15px]">
									Laporan simpan pinjam yang dulu sering selisih, sekarang
									selalu cocok setiap bulan. Audit tahunan kami jadi jauh lebih
									cepat.
								</p>
								<footer className="flex items-center gap-3 mt-6">
									<span className="w-10 h-10 rounded-full bg-[#2F7698]"></span>
									<div>
										<p className="font-semibold text-[#0F172A] text-[14px]">
											Made Ayu Kartika
										</p>
										<p className="text-[12.5px] text-[#94A3B8]">
											Auditor Internal Koperasi Nusa Bakti, Buleleng
										</p>
									</div>
								</footer>
							</blockquote>
						</div>
					</div>
				</section>

				{}
				<section
					id="faq"
					className="max-w-[820px] mx-auto px-6 lg:px-10 py-24 lg:py-32"
				>
					<div className="reveal text-center mb-14">
						<span className="text-[13px] font-bold text-[#2F7698] uppercase tracking-wider">
							Pertanyaan Umum
						</span>
						<h2 className="font-display font-extrabold text-[30px] sm:text-[36px] text-[#0F172A] tracking-tight mt-3">
							Yang sering ditanyakan
						</h2>
					</div>

					<div className="space-y-3.5" id="faq-list">
						{faqs.map((faq, idx) => (
							<div
								key={idx}
								className={`faq-item reveal rounded-2xl border border-[#D8E4EA] bg-white overflow-hidden ${openFaqIndex === idx ? "open" : ""}`}
							>
								<button
									onClick={() => toggleFaq(idx)}
									className="faq-trigger w-full flex items-center justify-between gap-4 px-6 py-5 text-left focus-ring"
									aria-expanded={openFaqIndex === idx}
								>
									<span className="font-semibold text-[#0F172A] text-[15.5px]">
										{faq.q}
									</span>
									<svg
										className="chev shrink-0"
										width="18"
										height="18"
										viewBox="0 0 24 24"
										fill="none"
										stroke="#398eb3"
										strokeWidth="2"
									>
										<path
											d="M6 9l6 6 6-6"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
									</svg>
								</button>
								<div className="faq-panel px-6">
									<p className="text-[#475569] text-[14.5px] leading-relaxed pb-5">
										{faq.a}
									</p>
								</div>
							</div>
						))}
					</div>
				</section>

				{}
				<section
					id="cta-akhir"
					className="max-w-[1280px] mx-auto px-6 lg:px-10 pb-24 lg:pb-32"
				>
					<div className="reveal relative rounded-[2.25rem] overflow-hidden bg-gradient-to-br from-[#398eb3] via-[#2F7698] to-[#0F172A] px-6 sm:px-14 py-16 sm:py-20 text-center">
						<div className="blob absolute -top-20 -left-10 w-72 h-72 rounded-full bg-white/10"></div>
						<div className="blob absolute -bottom-24 -right-10 w-80 h-80 rounded-full bg-[#4CC9B0]/20"></div>
						<div className="relative max-w-[640px] mx-auto">
							<h2 className="font-display font-extrabold text-white text-[30px] sm:text-[40px] tracking-tight leading-tight">
								Siap bawa Koperasi Desa Anda ke era digital?
							</h2>
							<p className="text-white/75 text-[16px] leading-relaxed mt-4">
								Coba KOPET gratis selama 30 hari — tanpa kartu kredit,
								siap menggantikan SIMKOPDES untuk koperasi Anda.
							</p>
							<div className="flex flex-wrap justify-center gap-3.5 mt-9">
								<a
									href="#"
									className="focus-ring px-7 py-3.5 rounded-full bg-white text-[#2F7698] font-semibold text-[15px] shadow-lift hover:-translate-y-0.5 hover:shadow-xl transition-all duration-300"
								>
									Mulai Uji Coba Gratis
								</a>
								<a
									href="#"
									className="focus-ring px-7 py-3.5 rounded-full border border-white/30 text-white font-semibold text-[15px] hover:bg-white/10 transition-all duration-300"
								>
									Jadwalkan Demo
								</a>
							</div>
						</div>
					</div>
				</section>
			</main>

			{}
			<footer className="border-t border-[#D8E4EA] bg-white">
				<div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-16">
					<div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-10">
						<div className="lg:col-span-1 sm:col-span-2">
							<a
								href="#hero-heading"
								className="flex items-center gap-2.5 focus-ring"
							>
								<span className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#398eb3] to-[#4CC9B0] grid place-items-center">
									<svg width="16" height="16" viewBox="0 0 24 24" fill="none">
										<circle cx="5" cy="12" r="2.2" fill="white" />
										<circle
											cx="12"
											cy="6"
											r="2.2"
											fill="white"
											fillOpacity="0.85"
										/>
										<circle cx="19" cy="12" r="2.2" fill="white" />
										<circle
											cx="12"
											cy="18"
											r="2.2"
											fill="white"
											fillOpacity="0.85"
										/>
									</svg>
								</span>
								<span className="font-display font-extrabold text-[18px] text-[#0F172A]">
									KOPET
								</span>
							</a>
							<p className="text-[13.5px] text-[#94A3B8] leading-relaxed mt-4 max-w-[240px]">
								Platform ERP offline-first untuk Koperasi Desa/Kelurahan Merah
								Putih — bekerja di area blankspot sekalipun.
							</p>
						</div>

						<div>
							<h5 className="font-display font-bold text-[#0F172A] text-[13.5px] uppercase tracking-wide mb-4">
								Modul
							</h5>
							<ul className="space-y-2.5 text-[14px] text-[#475569]">
								<li>
									<a
										className="hover:text-[#2F7698] transition-colors focus-ring"
										href="#fitur"
									>
										Toko Sembako (POS)
									</a>
								</li>
								<li>
									<a
										className="hover:text-[#2F7698] transition-colors focus-ring"
										href="#fitur"
									>
										Simpan Pinjam
									</a>
								</li>
								<li>
									<a
										className="hover:text-[#2F7698] transition-colors focus-ring"
										href="#fitur"
									>
										Gudang & Inventaris
									</a>
								</li>
								<li>
									<a
										className="hover:text-[#2F7698] transition-colors focus-ring"
										href="#fitur"
									>
										Logistik & Pengiriman
									</a>
								</li>
							</ul>
						</div>

						<div>
							<h5 className="font-display font-bold text-[#0F172A] text-[13.5px] uppercase tracking-wide mb-4">
								Perusahaan
							</h5>
							<ul className="space-y-2.5 text-[14px] text-[#475569]">
								<li>
									<a
										className="hover:text-[#2F7698] transition-colors focus-ring"
										href="#"
									>
										Tentang Kami
									</a>
								</li>
								<li>
									<a
										className="hover:text-[#2F7698] transition-colors focus-ring"
										href="#testimoni"
									>
										Kisah Pelanggan
									</a>
								</li>
								<li>
									<a
										className="hover:text-[#2F7698] transition-colors focus-ring"
										href="#"
									>
										Karier
									</a>
								</li>
								<li>
									<a
										className="hover:text-[#2F7698] transition-colors focus-ring"
										href="#"
									>
										Kontak
									</a>
								</li>
							</ul>
						</div>

						<div>
							<h5 className="font-display font-bold text-[#0F172A] text-[13.5px] uppercase tracking-wide mb-4">
								Sumber Daya
							</h5>
							<ul className="space-y-2.5 text-[14px] text-[#475569]">
								<li>
									<a
										className="hover:text-[#2F7698] transition-colors focus-ring"
										href="#offline-first"
									>
										Arsitektur Offline-First
									</a>
								</li>
								<li>
									<a
										className="hover:text-[#2F7698] transition-colors focus-ring"
										href="#faq"
									>
										Pusat Bantuan
									</a>
								</li>
								<li>
									<a
										className="hover:text-[#2F7698] transition-colors focus-ring"
										href="#"
									>
										Dokumentasi API
									</a>
								</li>
								<li>
									<a
										className="hover:text-[#2F7698] transition-colors focus-ring"
										href="#"
									>
										Status Sistem
									</a>
								</li>
							</ul>
						</div>

						<div>
							<h5 className="font-display font-bold text-[#0F172A] text-[13.5px] uppercase tracking-wide mb-4">
								Legal
							</h5>
							<ul className="space-y-2.5 text-[14px] text-[#475569]">
								<li>
									<a
										className="hover:text-[#2F7698] transition-colors focus-ring"
										href="#"
									>
										Kebijakan Privasi
									</a>
								</li>
								<li>
									<a
										className="hover:text-[#2F7698] transition-colors focus-ring"
										href="#"
									>
										Syarat Layanan
									</a>
								</li>
								<li>
									<a
										className="hover:text-[#2F7698] transition-colors focus-ring"
										href="#"
									>
										Keamanan Data
									</a>
								</li>
							</ul>
						</div>
					</div>

					<div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-14 pt-8 border-t border-[#E8EEF2]">
						<p className="text-[13px] text-[#94A3B8]">
							&copy; 2026 KOPET. Dibuat untuk Koperasi Desa/Kelurahan Merah
							Putih di seluruh Indonesia.
						</p>
						<div className="flex items-center gap-3">
							<a
								href="#"
								aria-label="Instagram"
								className="focus-ring w-9 h-9 rounded-full bg-[#F1F5F9] grid place-items-center hover:bg-[#EAF6FB] transition-colors"
							>
								<svg
									width="15"
									height="15"
									viewBox="0 0 24 24"
									fill="none"
									stroke="#475569"
									strokeWidth="1.8"
								>
									<rect x="3" y="3" width="18" height="18" rx="5" />
									<circle cx="12" cy="12" r="4" />
									<circle cx="17.5" cy="6.5" r="1" />
								</svg>
							</a>
							<a
								href="#"
								aria-label="LinkedIn"
								className="focus-ring w-9 h-9 rounded-full bg-[#F1F5F9] grid place-items-center hover:bg-[#EAF6FB] transition-colors"
							>
								<svg
									width="15"
									height="15"
									viewBox="0 0 24 24"
									fill="none"
									stroke="#475569"
									strokeWidth="1.8"
								>
									<rect x="3" y="3" width="18" height="18" rx="3" />
									<path
										d="M7 10v6M7 7v.01M11 16v-4a2 2 0 014 0v4M11 12v4"
										strokeLinecap="round"
									/>
								</svg>
							</a>
							<a
								href="#"
								aria-label="YouTube"
								className="focus-ring w-9 h-9 rounded-full bg-[#F1F5F9] grid place-items-center hover:bg-[#EAF6FB] transition-colors"
							>
								<svg
									width="15"
									height="15"
									viewBox="0 0 24 24"
									fill="none"
									stroke="#475569"
									strokeWidth="1.8"
								>
									<rect x="2.5" y="6" width="19" height="12" rx="3" />
									<path d="M10.5 10l4 2-4 2v-4z" fill="#475569" stroke="none" />
								</svg>
							</a>
						</div>
					</div>
				</div>
			</footer>
		</div>
	);
}
