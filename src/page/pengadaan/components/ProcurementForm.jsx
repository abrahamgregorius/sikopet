/** @format */

import { useState } from "react";

export default function ProcurementForm({ onClose, onSubmit }) {
	const [form, setForm] = useState({
		supplier: "",
		product: "",
		quantity: "",
		unitPrice: "",
		method: "transfer",
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!form.supplier || !form.product || !form.quantity || !form.unitPrice) return;
		onSubmit({
			...form,
			quantity: Number(form.quantity),
			unitPrice: Number(form.unitPrice),
			total: Number(form.quantity) * Number(form.unitPrice),
			date: new Date().toISOString().split("T")[0],
		});
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
			<div className="w-full max-w-md rounded-[24px] bg-white shadow-lift overflow-hidden" role="dialog" aria-modal="true">
				<div className="flex items-center justify-between px-6 py-5 border-b border-[#E8EEF2]">
					<h2 className="font-display font-bold text-[18px] text-[#0F172A]">Pengajuan Pengadaan Baru</h2>
					<button onClick={onClose} className="focus-ring p-1.5 rounded-lg text-[#94A3B8] hover:bg-[#F1F5F9] transition-colors" aria-label="Tutup">
						<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
							<path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
						</svg>
					</button>
				</div>

				<form onSubmit={handleSubmit} className="p-6 space-y-4">
					<div>
						<label htmlFor="supplier" className="block text-[13.5px] font-medium text-[#374151] mb-1.5">
							Pemasok <span className="text-[#EF4444]">*</span>
						</label>
						<input
							id="supplier"
							name="supplier"
							type="text"
							required
							placeholder="Nama pemasok"
							value={form.supplier}
							onChange={handleChange}
							className="focus-ring w-full h-[48px] px-4 rounded-[12px] border border-[#E5E7EB] bg-white text-[15px] text-[#0F172A] placeholder-[#9CA3AF] focus:border-[#398EB3] focus:outline-none transition-colors"
						/>
					</div>

					<div>
						<label htmlFor="product" className="block text-[13.5px] font-medium text-[#374151] mb-1.5">
							Produk <span className="text-[#EF4444]">*</span>
						</label>
						<input
							id="product"
							name="product"
							type="text"
							required
							placeholder="Nama produk"
							value={form.product}
							onChange={handleChange}
							className="focus-ring w-full h-[48px] px-4 rounded-[12px] border border-[#E5E7EB] bg-white text-[15px] text-[#0F172A] placeholder-[#9CA3AF] focus:border-[#398EB3] focus:outline-none transition-colors"
						/>
					</div>

					<div className="grid grid-cols-2 gap-3">
						<div>
							<label htmlFor="quantity" className="block text-[13.5px] font-medium text-[#374151] mb-1.5">
								Jumlah <span className="text-[#EF4444]">*</span>
							</label>
							<input
								id="quantity"
								name="quantity"
								type="number"
								required
								min="1"
								placeholder="0"
								value={form.quantity}
								onChange={handleChange}
								className="focus-ring w-full h-[48px] px-4 rounded-[12px] border border-[#E5E7EB] bg-white text-[15px] text-[#0F172A] placeholder-[#9CA3AF] focus:border-[#398EB3] focus:outline-none transition-colors"
							/>
						</div>
						<div>
							<label htmlFor="unitPrice" className="block text-[13.5px] font-medium text-[#374151] mb-1.5">
								Harga Satuan <span className="text-[#EF4444]">*</span>
							</label>
							<input
								id="unitPrice"
								name="unitPrice"
								type="number"
								required
								min="1"
								placeholder="0"
								value={form.unitPrice}
								onChange={handleChange}
								className="focus-ring w-full h-[48px] px-4 rounded-[12px] border border-[#E5E7EB] bg-white text-[15px] text-[#0F172A] placeholder-[#9CA3AF] focus:border-[#398EB3] focus:outline-none transition-colors"
							/>
						</div>
					</div>

					<div>
						<label htmlFor="method" className="block text-[13.5px] font-medium text-[#374151] mb-1.5">Metode Pembayaran</label>
						<select
							id="method"
							name="method"
							value={form.method}
							onChange={handleChange}
							className="focus-ring w-full h-[48px] px-4 rounded-[12px] border border-[#E5E7EB] bg-white text-[15px] text-[#0F172A] focus:border-[#398EB3] focus:outline-none transition-colors"
						>
							<option value="transfer">Transfer</option>
							<option value="cash">Tunai</option>
							<option value="qris">QRIS</option>
						</select>
					</div>

					<div className="flex gap-3 pt-2">
						<button type="button" onClick={onClose} className="focus-ring flex-1 h-12 rounded-[12px] border border-[#E5E7EB] text-[#475569] font-semibold text-[15px] hover:bg-[#F1F5F9] transition-colors">
							Batal
						</button>
						<button type="submit" className="focus-ring flex-1 h-12 rounded-[12px] bg-[#398EB3] text-white font-semibold text-[15px] shadow-glow hover:bg-[#2F7A9A] hover:-translate-y-0.5 active:scale-[0.98] transition-all">
							Ajukan
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
