/** @format */

import { useState } from "react";

export default function CustomerForm({ onClose, onSubmit }) {
	const [form, setForm] = useState({
		name: "",
		contact: "",
		phone: "",
		email: "",
		address: "",
		category: "",
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!form.name || !form.phone) return;
		onSubmit(form);
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
			<div className="w-full max-w-md rounded-[24px] bg-white overflow-hidden" role="dialog" aria-modal="true">
				<div className="flex items-center justify-between px-6 py-5 border-b border-[#E8EEF2]">
					<h2 className="font-display font-bold text-[18px] text-[#0F172A]">Tambah Pelanggan Baru</h2>
					<button onClick={onClose} className="focus-ring p-1.5 rounded-lg text-[#94A3B8] hover:bg-[#F1F5F9] transition-colors" aria-label="Tutup">
						<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
							<path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
						</svg>
					</button>
				</div>

				<form onSubmit={handleSubmit} className="p-6 space-y-4">
					<div>
						<label htmlFor="name" className="block text-[13.5px] font-medium text-[#374151] mb-1.5">
							Nama Pelanggan <span className="text-[#EF4444]">*</span>
						</label>
						<input
							id="name"
							name="name"
							type="text"
							required
							placeholder="Nama pelanggan atau toko"
							value={form.name}
							onChange={handleChange}
							className="focus-ring w-full h-[48px] px-4 rounded-[12px] border border-[#E5E7EB] bg-white text-[15px] text-[#0F172A] placeholder-[#9CA3AF] focus:border-[#398EB3] focus:outline-none transition-colors"
						/>
					</div>

					<div>
						<label htmlFor="contact" className="block text-[13.5px] font-medium text-[#374151] mb-1.5">Nama Kontak</label>
						<input
							id="contact"
							name="contact"
							type="text"
							placeholder="Nama pessoa kontak"
							value={form.contact}
							onChange={handleChange}
							className="focus-ring w-full h-[48px] px-4 rounded-[12px] border border-[#E5E7EB] bg-white text-[15px] text-[#0F172A] placeholder-[#9CA3AF] focus:border-[#398EB3] focus:outline-none transition-colors"
						/>
					</div>

					<div className="grid grid-cols-2 gap-3">
						<div>
							<label htmlFor="phone" className="block text-[13.5px] font-medium text-[#374151] mb-1.5">
								Telepon <span className="text-[#EF4444]">*</span>
							</label>
							<input
								id="phone"
								name="phone"
								type="tel"
								required
								placeholder="08xxxxxxxxxx"
								value={form.phone}
								onChange={handleChange}
								className="focus-ring w-full h-[48px] px-4 rounded-[12px] border border-[#E5E7EB] bg-white text-[15px] text-[#0F172A] placeholder-[#9CA3AF] focus:border-[#398EB3] focus:outline-none transition-colors"
							/>
						</div>
						<div>
							<label htmlFor="category" className="block text-[13.5px] font-medium text-[#374151] mb-1.5">Kategori</label>
							<input
								id="category"
								name="category"
								type="text"
								placeholder="Contoh: Pedagang Besar"
								value={form.category}
								onChange={handleChange}
								className="focus-ring w-full h-[48px] px-4 rounded-[12px] border border-[#E5E7EB] bg-white text-[15px] text-[#0F172A] placeholder-[#9CA3AF] focus:border-[#398EB3] focus:outline-none transition-colors"
							/>
						</div>
					</div>

					<div>
						<label htmlFor="email" className="block text-[13.5px] font-medium text-[#374151] mb-1.5">Email</label>
						<input
							id="email"
							name="email"
							type="email"
							placeholder="email@contoh.com"
							value={form.email}
							onChange={handleChange}
							className="focus-ring w-full h-[48px] px-4 rounded-[12px] border border-[#E5E7EB] bg-white text-[15px] text-[#0F172A] placeholder-[#9CA3AF] focus:border-[#398EB3] focus:outline-none transition-colors"
						/>
					</div>

					<div>
						<label htmlFor="address" className="block text-[13.5px] font-medium text-[#374151] mb-1.5">Alamat</label>
						<input
							id="address"
							name="address"
							type="text"
							placeholder="Alamat lengkap"
							value={form.address}
							onChange={handleChange}
							className="focus-ring w-full h-[48px] px-4 rounded-[12px] border border-[#E5E7EB] bg-white text-[15px] text-[#0F172A] placeholder-[#9CA3AF] focus:border-[#398EB3] focus:outline-none transition-colors"
						/>
					</div>

					<div className="flex gap-3 pt-2">
						<button type="button" onClick={onClose} className="focus-ring flex-1 h-12 rounded-[12px] border border-[#E5E7EB] text-[#475569] font-semibold text-[15px] hover:bg-[#F1F5F9] transition-colors">
							Batal
						</button>
						<button type="submit" className="focus-ring flex-1 h-12 rounded-[12px] bg-[#398EB3] text-white font-semibold text-[15px] hover:bg-[#2F7A9A] hover:-translate-y-0.5 active:scale-[0.98] transition-all">
							Simpan
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
