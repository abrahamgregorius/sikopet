/** @format */

import { useState } from "react";
import { SharedStyles, Logo, SkipLink } from "../../components/Home";
import { Input, Button } from "../../components/ui";

export default function Login() {
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
			<SharedStyles />

			<SkipLink href="#login-form" label="Lompat ke formulir login" />

			<div className="relative w-full max-w-[440px]">
				<div className="blob absolute -top-20 -left-20 w-[340px] h-[340px] rounded-full bg-[#67B2D4]/25 -z-10"></div>
				<div className="blob absolute -bottom-16 -right-16 w-[300px] h-[300px] rounded-full bg-[#4CC9B0]/20 -z-10"></div>

				<div className="rounded-[24px] bg-white border border-[#D8E4EA] shadow-lift p-8 sm:p-10">
					<div className="text-center mb-8">
						<div className="inline-flex">
							<Logo size="md" name="SIKOPET" href="/" />
						</div>
						<h1 className="font-display font-bold text-[24px] text-[#0F172A] mt-5">
							Selamat Datang Kembali
						</h1>
						<p className="text-[14.5px] text-[#6B7280] mt-2">
							Masuk ke akun koperasi Anda
						</p>
					</div>

					<form id="login-form" onSubmit={handleSubmit} className="space-y-5">
						<Input
							label="Email"
							id="email"
							type="email"
							autoComplete="email"
							required
							placeholder="nama@koperasi.id"
							value={form.email}
							onChange={handleChange}
						/>

						<Input
							label="Kata Sandi"
							id="password"
							type="password"
							autoComplete="current-password"
							required
							placeholder="Masukkan kata sandi"
							value={form.password}
							onChange={handleChange}
						/>

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

						<Button type="submit" variant="form">
							Masuk
						</Button>
					</form>
				</div>

				<p className="text-center text-[12px] text-[#9CA3AF] mt-6">
					&copy; 2026 SIKOPET &middot; Sistem Informasi Koperasi Terintegrasi
				</p>
			</div>
		</div>
	);
}
