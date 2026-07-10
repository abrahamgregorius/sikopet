/** @format */

import { useState } from "react";

export default function Login() {
	const [showPassword, setShowPassword] = useState(false);
	const [form, setForm] = useState({
		email: "",
		password: "",
		remember: false,
	});

	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		setForm((prev) => ({
			...prev,
			[name]: type === "checkbox" ? checked : value,
		}));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
	};

	return (
		<div className="font-['Inter',sans-serif] text-[#0F172A] antialiased bg-[#F7F9FB] min-h-screen flex items-center justify-center px-4 py-10">
			<style>{`
                .font-display { font-family: "Hanken Grotesk", sans-serif; }
                .shadow-soft { box-shadow: 0 1px 2px rgba(15,23,42,0.04), 0 8px 24px -8px rgba(15,23,42,0.08); }
                .shadow-lift { box-shadow: 0 4px 10px rgba(15,23,42,0.05), 0 20px 40px -16px rgba(15,23,42,0.16); }
                .shadow-glow { box-shadow: 0 0 0 1px rgba(57,142,179,0.10), 0 12px 32px -8px rgba(57,142,179,0.28); }
                .focus-ring:focus-visible { outline: 2px solid #398eb3; outline-offset: 3px; border-radius: 8px; }
                .blob { filter: blur(70px); }
                ::selection { background: #67b2d4; color: #fff; }
            `}</style>

			<a
				href="#login-form"
				className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:bg-white focus:px-4 focus:py-2 focus:rounded-lg shadow-lift"
			>
				Lompat ke formulir login
			</a>

			<div className="relative w-full max-w-[440px]">
				<div className="blob absolute -top-20 -left-20 w-[340px] h-[340px] rounded-full bg-[#67B2D4]/25 -z-10"></div>
				<div className="blob absolute -bottom-16 -right-16 w-[300px] h-[300px] rounded-full bg-[#4CC9B0]/20 -z-10"></div>

				<div className="rounded-[24px] bg-white border border-[#D8E4EA] shadow-lift p-8 sm:p-10">
					<div className="text-center mb-8">
						<a
							href="/"
							className="inline-flex items-center gap-2.5 focus-ring"
							aria-label="SIKOPET — Beranda"
						>
							<span className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-[#398eb3] to-[#4CC9B0] grid place-items-center shadow-soft">
								<svg
									width="20"
									height="20"
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
							<span className="font-display font-extrabold text-[20px] tracking-tight text-[#0F172A]">
								SIKOPET
							</span>
						</a>
						<h1 className="font-display font-bold text-[24px] text-[#0F172A] mt-5">
							Selamat Datang Kembali
						</h1>
						<p className="text-[14.5px] text-[#6B7280] mt-2">
							Masuk ke akun koperasi Anda
						</p>
					</div>

					<form id="login-form" onSubmit={handleSubmit} className="space-y-5">
						<div>
							<label
								htmlFor="email"
								className="block text-[13.5px] font-medium text-[#374151] mb-1.5"
							>
								Email
							</label>
							<input
								id="email"
								name="email"
								type="email"
								autoComplete="email"
								required
								placeholder="nama@koperasi.id"
								value={form.email}
								onChange={handleChange}
								className="focus-ring w-full h-[48px] px-4 rounded-[12px] border border-[#E5E7EB] bg-white text-[15px] text-[#0F172A] placeholder-[#9CA3AF] transition-colors duration-200 hover:border-[#D1D5DB] focus:border-[#398EB3] focus:outline-none"
							/>
						</div>

						<div>
							<label
								htmlFor="password"
								className="block text-[13.5px] font-medium text-[#374151] mb-1.5"
							>
								Kata Sandi
							</label>
							<div className="relative">
								<input
									id="password"
									name="password"
									type={showPassword ? "text" : "password"}
									autoComplete="current-password"
									required
									placeholder="Masukkan kata sandi"
									value={form.password}
									onChange={handleChange}
									className="focus-ring w-full h-[48px] px-4 pr-12 rounded-[12px] border border-[#E5E7EB] bg-white text-[15px] text-[#0F172A] placeholder-[#9CA3AF] transition-colors duration-200 hover:border-[#D1D5DB] focus:border-[#398EB3] focus:outline-none"
								/>
								<button
									type="button"
									onClick={() => setShowPassword(!showPassword)}
									className="focus-ring absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-[#9CA3AF] hover:text-[#6B7280] transition-colors"
									aria-label={
										showPassword
											? "Sembunyikan kata sandi"
											: "Tampilkan kata sandi"
									}
								>
									{showPassword ? (
										<svg
											width="18"
											height="18"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="1.8"
										>
											<path
												d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"
												strokeLinecap="round"
												strokeLinejoin="round"
											/>
											<line
												x1="1"
												y1="1"
												x2="23"
												y2="23"
												stroke="currentColor"
												strokeWidth="1.8"
												strokeLinecap="round"
											/>
										</svg>
									) : (
										<svg
											width="18"
											height="18"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="1.8"
										>
											<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
											<circle cx="12" cy="12" r="3" />
										</svg>
									)}
								</button>
							</div>
						</div>

						<div className="flex items-center justify-between">
							<label className="flex items-center gap-2 cursor-pointer">
								<input
									type="checkbox"
									name="remember"
									checked={form.remember}
									onChange={handleChange}
									className="focus-ring w-4 h-4 rounded border-[#D1D5DB] text-[#398EB3] accent-[#398EB3] cursor-pointer"
								/>
								<span className="text-[13.5px] text-[#6B7280]">Ingat saya</span>
							</label>
							<a
								href="#"
								className="text-[13.5px] font-medium text-[#398EB3] hover:text-[#2F7A9A] transition-colors focus-ring"
							>
								Lupa kata sandi?
							</a>
						</div>

						<button
							type="submit"
							className="focus-ring w-full h-[48px] rounded-[12px] bg-[#398EB3] text-white font-semibold text-[15px] shadow-glow hover:bg-[#2F7A9A] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200"
						>
							Masuk
						</button>
					</form>
				</div>

				<p className="text-center text-[12px] text-[#9CA3AF] mt-6">
					&copy; 2026 SIKOPET &middot; Sistem Informasi Koperasi Terintegrasi
				</p>
			</div>
		</div>
	);
}
