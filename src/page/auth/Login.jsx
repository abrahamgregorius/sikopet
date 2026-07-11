/** @format */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SharedStyles, Logo, SkipLink } from "../../components/Home";
import { Input, Button } from "../../components/ui";
import { useAuth } from "../../contexts/AuthContext";
import { isOnline } from "../../lib/offline";

export default function Login() {
	const { login } = useAuth();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const email = formData.get("email");
		const password = formData.get("password");

		if (!email || !password) {
			setError("Email dan kata sandi wajib diisi.");
			return;
		}

		if (!isOnline()) {
			setError("Tidak bisa login offline. Pastikan koneksi internet aktif.");
			return;
		}

		setLoading(true);
		setError("");

		const { user, error: authError } = await login({ email, password });

		setLoading(false);

		if (authError) {
			setError(
				authError.message || "Login gagal. Periksa email dan kata sandi Anda.",
			);
			return;
		}

		if (user) {
			navigate("/dashboard", { replace: true });
		}
	};

	return (
		<div className="font-['Inter',sans-serif] text-[#0F172A] antialiased bg-[#F7FAFC] min-h-screen flex items-center justify-center px-4 py-10">
			<SharedStyles />

			<SkipLink href="#login-form" label="Lompat ke formulir login" />

			<div className="relative w-full max-w-[440px]">
				<div className="blob absolute -top-20 -left-20 w-[340px] h-[340px] rounded-lg bg-[#67B2D4]/25 -z-10"></div>
				<div className="blob absolute -bottom-16 -right-16 w-[300px] h-[300px] rounded-lg bg-[#4CC9B0]/20 -z-10"></div>

				<div className="rounded-[24px] bg-white border border-[#D8E4EA] shadow-lift p-8 sm:p-10">
					<div className="text-center mb-8">
						<div className="inline-flex">
							<Logo size="md" name="SIKOPET" href="/" />
						</div>
						<h1 className="font-display font-bold text-[24px] text-[#0F172A] mt-5">
							Selamat Datang Kembali
						</h1>
						<p className="text-[14.5px] text-[#6B7280] mt-2">
							Masuk ke akun cooperativa Anda
						</p>
					</div>

					<form id="login-form" onSubmit={handleSubmit} className="space-y-5">
						<Input
							label="Email"
							id="email"
							name="email"
							type="email"
							autoComplete="email"
							required
							placeholder="nama@email.com"
							defaultValue=""
						/>

						<Input
							label="Kata Sandi"
							id="password"
							name="password"
							type="password"
							autoComplete="current-password"
							required
							placeholder="Masukkan kata sandi"
							defaultValue=""
						/>

						<div className="flex items-center justify-between">
							<label className="flex items-center gap-2 cursor-pointer">
								<input
									type="checkbox"
									name="remember"
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

						{error && (
							<div className="rounded-lg bg-[#FEE2E2] border border-[#FECACA] px-4 py-3">
								<p className="text-[13px] text-[#EF4444] font-medium">
									{error}
								</p>
							</div>
						)}

						<Button
							type="submit"
							variant="form"
							disabled={loading}
							className="w-full"
						>
							{loading ? "Masuk..." : "Masuk"}
						</Button>
					</form>
				</div>

				<p className="text-center text-[12px] text-[#9CA3AF] mt-6">
					&copy; 2026 SIKOPET &middot; Sistem Informasi Cooperativa Terintegrasi
				</p>
			</div>
		</div>
	);
}
