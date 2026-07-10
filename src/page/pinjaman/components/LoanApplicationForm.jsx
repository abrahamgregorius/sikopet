/** @format */

import { useState } from "react";

export default function LoanApplicationForm({ onClose, onSubmit }) {
	const [form, setForm] = useState({
		member: "",
		principal: "",
		rate: "1.2",
		tenor: "12",
		purpose: "",
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!form.member || !form.principal) return;
		onSubmit({
			...form,
			principal: Number(form.principal),
			rate: Number(form.rate),
			tenor: Number(form.tenor),
		});
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
			<div
				className="w-full max-w-md rounded-[24px] bg-white shadow-lift overflow-hidden"
				role="dialog"
				aria-modal="true"
			>
				<div className="flex items-center justify-between px-6 py-5 border-b border-[#E8EEF2]">
					<h2 className="font-display font-bold text-[18px] text-[#0F172A]">
						Pengajuan Pinjaman Baru
					</h2>
					<button
						onClick={onClose}
						className="focus-ring p-1.5 rounded-lg text-[#94A3B8] hover:bg-[#F1F5F9] transition-colors"
						aria-label="Tutup"
					>
						<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
							<path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
						</svg>
					</button>
				</div>

				<form onSubmit={handleSubmit} className="p-6 space-y-4">
					<div>
						<label htmlFor="member" className="block text-[13.5px] font-medium text-[#374151] mb-1.5">
							Anggota <span className="text-[#EF4444]">*</span>
						</label>
						<input
							id="member"
							name="member"
							type="text"
							required
							placeholder="Nama anggota"
							value={form.member}
							onChange={handleChange}
							className="focus-ring w-full h-[48px] px-4 rounded-[12px] border border-[#E5E7EB] bg-white text-[15px] text-[#0F172A] placeholder-[#9CA3AF] focus:border-[#398EB3] focus:outline-none transition-colors"
						/>
					</div>

					<div>
						<label htmlFor="principal" className="block text-[13.5px] font-medium text-[#374151] mb-1.5">
							Jumlah Pinjaman (Rp) <span className="text-[#EF4444]">*</span>
						</label>
						<input
							id="principal"
							name="principal"
							type="number"
							required
							min="1"
							placeholder="0"
							value={form.principal}
							onChange={handleChange}
							className="focus-ring w-full h-[48px] px-4 rounded-[12px] border border-[#E5E7EB] bg-white text-[15px] text-[#0F172A] placeholder-[#9CA3AF] focus:border-[#398EB3] focus:outline-none transition-colors"
						/>
					</div>

					<div className="grid grid-cols-2 gap-3">
						<div>
							<label htmlFor="rate" className="block text-[13.5px] font-medium text-[#374151] mb-1.5">
								Bunga (%/bulan)
							</label>
							<input
								id="rate"
								name="rate"
								type="number"
								step="0.1"
								min="0.1"
								value={form.rate}
								onChange={handleChange}
								className="focus-ring w-full h-[48px] px-4 rounded-[12px] border border-[#E5E7EB] bg-white text-[15px] text-[#0F172A] focus:border-[#398EB3] focus:outline-none transition-colors"
							/>
						</div>
						<div>
							<label htmlFor="tenor" className="block text-[13.5px] font-medium text-[#374151] mb-1.5">
								Tenor (bulan)
							</label>
							<input
								id="tenor"
								name="tenor"
								type="number"
								min="1"
								value={form.tenor}
								onChange={handleChange}
								className="focus-ring w-full h-[48px] px-4 rounded-[12px] border border-[#E5E7EB] bg-white text-[15px] text-[#0F172A] focus:border-[#398EB3] focus:outline-none transition-colors"
							/>
						</div>
					</div>

					<div>
						<label htmlFor="purpose" className="block text-[13.5px] font-medium text-[#374151] mb-1.5">
							Tujuan Pinjaman
						</label>
						<input
							id="purpose"
							name="purpose"
							type="text"
							placeholder="Contoh: Modal Usaha"
							value={form.purpose}
							onChange={handleChange}
							className="focus-ring w-full h-[48px] px-4 rounded-[12px] border border-[#E5E7EB] bg-white text-[15px] text-[#0F172A] placeholder-[#9CA3AF] focus:border-[#398EB3] focus:outline-none transition-colors"
						/>
					</div>

					<div className="flex gap-3 pt-2">
						<button
							type="button"
							onClick={onClose}
							className="focus-ring flex-1 h-12 rounded-[12px] border border-[#E5E7EB] text-[#475569] font-semibold text-[15px] hover:bg-[#F1F5F9] transition-colors"
						>
							Batal
						</button>
						<button
							type="submit"
							className="focus-ring flex-1 h-12 rounded-[12px] bg-[#398EB3] text-white font-semibold text-[15px] shadow-glow hover:bg-[#2F7A9A] hover:-translate-y-0.5 active:scale-[0.98] transition-all"
						>
							Ajukan
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
