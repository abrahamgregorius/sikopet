/** @format */

import { useState, useEffect } from "react";
import { db } from "../../../database/db";
import Modal from "../../../components/ui/Modal";
import CreditScoreCard from "../../dashboard/components/CreditScoreCard";

export default function LoanApplicationForm({ open, onClose, onSubmit }) {
	const [members, setMembers] = useState([]);
	const [form, setForm] = useState({
		memberId: "",
		principal: "",
		interestRate: "10",
		tenorMonths: "12",
		purpose: "",
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
		if (!form.memberId || !form.principal) return;
		onSubmit({
			memberId: Number(form.memberId),
			principal: Number(form.principal),
			interestRate: Number(form.interestRate),
			tenorMonths: Number(form.tenorMonths),
		});
	};

	const showCreditScore = form.memberId && Number(form.principal) > 0;

	return (
		<Modal
			open={open}
			onClose={onClose}
			title="Pengajuan Pinjaman Baru"
			className="max-w-5xl!"
		>
			<div className="grid lg:grid-cols-[1fr_340px] gap-6">
				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label
							htmlFor="memberId"
							className="block text-[13.5px] font-medium text-[#374151] mb-1.5"
						>
							Anggota <span className="text-[#EF4444]">*</span>
						</label>
						<select
							id="memberId"
							name="memberId"
							required
							value={form.memberId}
							onChange={handleChange}
							className="focus-ring w-full h-[48px] px-4 rounded-[12px] border border-[#E5E7EB] bg-white text-[15px] text-[#0F172A] focus:border-[#398EB3] focus:outline-none transition-colors appearance-none cursor-pointer"
							style={{
								backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
								backgroundRepeat: "no-repeat",
								backgroundPosition: "right 16px center",
								paddingRight: "40px",
							}}
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
						<label
							htmlFor="principal"
							className="block text-[13.5px] font-medium text-[#374151] mb-1.5"
						>
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
							<label
								htmlFor="interestRate"
								className="block text-[13.5px] font-medium text-[#374151] mb-1.5"
							>
								Bunga (%/bulan)
							</label>
							<input
								id="interestRate"
								name="interestRate"
								type="number"
								step="0.1"
								min="0.1"
								value={form.interestRate}
								onChange={handleChange}
								className="focus-ring w-full h-[48px] px-4 rounded-[12px] border border-[#E5E7EB] bg-white text-[15px] text-[#0F172A] focus:border-[#398EB3] focus:outline-none transition-colors"
							/>
						</div>
						<div>
							<label
								htmlFor="tenorMonths"
								className="block text-[13.5px] font-medium text-[#374151] mb-1.5"
							>
								Tenor (bulan)
							</label>
							<input
								id="tenorMonths"
								name="tenorMonths"
								type="number"
								min="1"
								value={form.tenorMonths}
								onChange={handleChange}
								className="focus-ring w-full h-[48px] px-4 rounded-[12px] border border-[#E5E7EB] bg-white text-[15px] text-[#0F172A] focus:border-[#398EB3] focus:outline-none transition-colors"
							/>
						</div>
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
							className="focus-ring flex-1 h-12 rounded-[12px] bg-[#398EB3] text-white font-semibold text-[15px] hover:bg-[#2F7A9A] hover:-translate-y-0.5 active:scale-[0.98] transition-all"
						>
							Ajukan
						</button>
					</div>
				</form>

				<div className="hidden lg:block">
					{showCreditScore ? (
						<CreditScoreCard
							memberId={Number(form.memberId)}
							requestedLoanAmount={Number(form.principal)}
						/>
					) : (
						<div className="rounded-lg bg-[#F1F5F9] border border-[#E5E7EB] p-6 flex items-center justify-center h-full min-h-[300px]">
							<p className="text-[13px] text-[#94A3B8] text-center">
								Pilih anggota dan isi jumlah pinjaman untuk melihat skor kredit
							</p>
						</div>
					)}
				</div>
			</div>
		</Modal>
	);
}
