/** @format */

import { useState, useEffect } from "react";
import { db } from "../../../database/db";

export default function SavingsForm({ type, onClose, onSubmit }) {
	const [members, setMembers] = useState([]);
	const [form, setForm] = useState({
		memberId: "",
		type,
		amount: "",
		description: type === "deposit" ? "Simpanan Wajib" : "Penarikan",
	});

	useEffect(() => {
		const loadMembers = async () => {
			const data = await db.members.toArray();
			setMembers(data);
		};
		loadMembers();
	}, []);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!form.memberId || !form.amount) return;
		onSubmit({
			...form,
			amount: Number(form.amount),
		});
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
			<div
				className="w-full max-w-md rounded-[24px] bg-white overflow-hidden"
				role="dialog"
				aria-modal="true"
			>
				<div className="flex items-center justify-between px-6 py-5 border-b border-[#E8EEF2]">
					<h2 className="font-display font-bold text-[18px] text-[#0F172A]">
						{type === "deposit" ? "Setoran Baru" : "Penarikan"}
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
						<label htmlFor="memberId" className="block text-[13.5px] font-medium text-[#374151] mb-1.5">
							Anggota <span className="text-[#EF4444]">*</span>
						</label>
						<select
							id="memberId"
							name="memberId"
							required
							value={form.memberId}
							onChange={handleChange}
							className="focus-ring w-full h-[48px] px-4 rounded-[12px] border border-[#E5E7EB] bg-white text-[15px] text-[#0F172A] focus:border-[#398EB3] focus:outline-none transition-colors"
						>
							<option value="">Pilih Anggota</option>
							{members.map((m) => (
								<option key={m.id} value={m.id}>
									{m.name}
								</option>
							))}
						</select>
					</div>

					<div>
						<label htmlFor="amount" className="block text-[13.5px] font-medium text-[#374151] mb-1.5">
							Jumlah (Rp) <span className="text-[#EF4444]">*</span>
						</label>
						<input
							id="amount"
							name="amount"
							type="number"
							required
							min="1"
							placeholder="0"
							value={form.amount}
							onChange={handleChange}
							className="focus-ring w-full h-[48px] px-4 rounded-[12px] border border-[#E5E7EB] bg-white text-[15px] text-[#0F172A] placeholder-[#9CA3AF] focus:border-[#398EB3] focus:outline-none transition-colors"
						/>
					</div>

					<div>
						<label htmlFor="description" className="block text-[13.5px] font-medium text-[#374151] mb-1.5">
							Keterangan
						</label>
						<select
							id="description"
							name="description"
							value={form.description}
							onChange={handleChange}
							className="focus-ring w-full h-[48px] px-4 rounded-[12px] border border-[#E5E7EB] bg-white text-[15px] text-[#0F172A] focus:border-[#398EB3] focus:outline-none transition-colors"
						>
							{type === "deposit" ? (
								<>
									<option>Simpanan Wajib</option>
									<option>Simpanan Sukarela</option>
									<option>Simpanan Hari Raya</option>
								</>
							) : (
								<>
									<option>Penarikan</option>
									<option>Penarikan Dana</option>
								</>
							)}
						</select>
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
							className={`focus-ring flex-1 h-12 rounded-[12px] font-semibold text-[15px] hover:-translate-y-0.5 active:scale-[0.98] transition-all ${
								type === "deposit"
									? "bg-[#398EB3] text-white hover:bg-[#2F7A9A]"
									: "bg-[#EF4444] text-white hover:bg-[#DC2626]"
							}`}
						>
							{type === "deposit" ? "Simpan Setoran" : "Proses Penarikan"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
