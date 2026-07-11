/** @format */

import { useState } from "react";

export default function MemberForm({ onClose, onSubmit, nextMemberNumber, member }) {
	const isEdit = !!member;

	const [form, setForm] = useState(
		isEdit
			? {
					nik: member.nik || "",
					name: member.name || "",
					bornDate: member.bornDate || "",
					address: member.address || "",
					phone: member.phone || "",
					memberNumber: member.memberNumber || "",
			  }
			: {
					nik: "",
					name: "",
					bornDate: "",
					address: "",
					phone: "",
					memberNumber: nextMemberNumber || "",
			  }
	);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!form.nik || !form.name || !form.phone) return;
		onSubmit(form);
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
			<div
				className="w-full max-w-lg rounded-[24px] bg-white shadow-lift overflow-hidden"
				role="dialog"
				aria-modal="true"
				aria-labelledby="form-title"
			>
				<div className="flex items-center justify-between px-6 py-5 border-b border-[#E8EEF2]">
					<h2 id="form-title" className="font-display font-bold text-[18px] text-[#0F172A]">
						{isEdit ? "Edit Anggota" : "Daftar Anggota Baru"}
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
						<label htmlFor="memberNumber" className="block text-[13.5px] font-medium text-[#374151] mb-1.5">
							Nomor Anggota
						</label>
						<input
							id="memberNumber"
							name="memberNumber"
							type="text"
							value={form.memberNumber}
							readOnly
							className="focus-ring w-full h-[48px] px-4 rounded-[12px] border border-[#E5E7EB] bg-[#F8FAFC] text-[15px] text-[#64748B] placeholder-[#9CA3AF] focus:border-[#398EB3] focus:outline-none transition-colors"
						/>
					</div>

					<div>
						<label htmlFor="nik" className="block text-[13.5px] font-medium text-[#374151] mb-1.5">
							NIK <span className="text-[#EF4444]">*</span>
						</label>
						<input
							id="nik"
							name="nik"
							type="text"
							maxLength={16}
							required
							placeholder="16 digit NIK"
							value={form.nik}
							onChange={handleChange}
							className="focus-ring w-full h-[48px] px-4 rounded-[12px] border border-[#E5E7EB] bg-white text-[15px] text-[#0F172A] placeholder-[#9CA3AF] focus:border-[#398EB3] focus:outline-none transition-colors"
						/>
					</div>

					<div>
						<label htmlFor="name" className="block text-[13.5px] font-medium text-[#374151] mb-1.5">
							Nama Lengkap <span className="text-[#EF4444]">*</span>
						</label>
						<input
							id="name"
							name="name"
							type="text"
							required
							placeholder="Nama sesuai KTP"
							value={form.name}
							onChange={handleChange}
							className="focus-ring w-full h-[48px] px-4 rounded-[12px] border border-[#E5E7EB] bg-white text-[15px] text-[#0F172A] placeholder-[#9CA3AF] focus:border-[#398EB3] focus:outline-none transition-colors"
						/>
					</div>

					<div>
						<label htmlFor="bornDate" className="block text-[13.5px] font-medium text-[#374151] mb-1.5">
							Tanggal Lahir
						</label>
						<input
							id="bornDate"
							name="bornDate"
							type="date"
							value={form.bornDate}
							onChange={handleChange}
							className="focus-ring w-full h-[48px] px-4 rounded-[12px] border border-[#E5E7EB] bg-white text-[15px] text-[#0F172A] focus:border-[#398EB3] focus:outline-none transition-colors"
						/>
					</div>

					<div>
						<label htmlFor="address" className="block text-[13.5px] font-medium text-[#374151] mb-1.5">
							Alamat
						</label>
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

					<div>
						<label htmlFor="phone" className="block text-[13.5px] font-medium text-[#374151] mb-1.5">
							Nomor Telepon <span className="text-[#EF4444]">*</span>
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
							{isEdit ? "Perbarui" : "Simpan"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
