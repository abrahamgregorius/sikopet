/** @format */

import { useState } from "react";

export default function StockForm({ onClose, onSubmit }) {
	const [form, setForm] = useState({
		name: "",
		category: "",
		stock: "",
		minStock: "",
		unit: "pcs",
		location: "",
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!form.name || !form.category || !form.stock || !form.minStock) return;
		onSubmit({
			...form,
			stock: Number(form.stock),
			minStock: Number(form.minStock),
			lastRestock: new Date().toISOString().split("T")[0],
		});
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
			<div className="w-full max-w-md rounded-[24px] bg-white overflow-hidden" role="dialog" aria-modal="true">
				<div className="flex items-center justify-between px-6 py-5 border-b border-[#E8EEF2]">
					<h2 className="font-display font-bold text-[18px] text-[#0F172A]">Stok Masuk Baru</h2>
					<button onClick={onClose} className="focus-ring p-1.5 rounded-lg text-[#94A3B8] hover:bg-[#F1F5F9] transition-colors" aria-label="Tutup">
						<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
							<path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
						</svg>
					</button>
				</div>

				<form onSubmit={handleSubmit} className="p-6 space-y-4">
					<div>
						<label htmlFor="name" className="block text-[13.5px] font-medium text-[#374151] mb-1.5">
							Nama Produk <span className="text-[#EF4444]">*</span>
						</label>
						<input
							id="name"
							name="name"
							type="text"
							required
							placeholder="Nama produk"
							value={form.name}
							onChange={handleChange}
							className="focus-ring w-full h-[48px] px-4 rounded-[12px] border border-[#E5E7EB] bg-white text-[15px] text-[#0F172A] placeholder-[#9CA3AF] focus:border-[#398EB3] focus:outline-none transition-colors"
						/>
					</div>

					<div className="grid grid-cols-2 gap-3">
						<div>
							<label htmlFor="category" className="block text-[13.5px] font-medium text-[#374151] mb-1.5">
								Kategori <span className="text-[#EF4444]">*</span>
							</label>
							<input
								id="category"
								name="category"
								type="text"
								required
								placeholder="Contoh: Sembako"
								value={form.category}
								onChange={handleChange}
								className="focus-ring w-full h-[48px] px-4 rounded-[12px] border border-[#E5E7EB] bg-white text-[15px] text-[#0F172A] placeholder-[#9CA3AF] focus:border-[#398EB3] focus:outline-none transition-colors"
							/>
						</div>
						<div>
							<label htmlFor="unit" className="block text-[13.5px] font-medium text-[#374151] mb-1.5">Unit</label>
							<select
								id="unit"
								name="unit"
								value={form.unit}
								onChange={handleChange}
								className="focus-ring w-full h-[48px] px-4 rounded-[12px] border border-[#E5E7EB] bg-white text-[15px] text-[#0F172A] focus:border-[#398EB3] focus:outline-none transition-colors"
							>
								<option value="pcs">Pcs</option>
								<option value="kg">Kg</option>
								<option value="pack">Pack</option>
								<option value="box">Box</option>
								<option value="botol">Botol</option>
							</select>
						</div>
					</div>

					<div className="grid grid-cols-2 gap-3">
						<div>
							<label htmlFor="stock" className="block text-[13.5px] font-medium text-[#374151] mb-1.5">
								Stok <span className="text-[#EF4444]">*</span>
							</label>
							<input
								id="stock"
								name="stock"
								type="number"
								required
								min="1"
								placeholder="0"
								value={form.stock}
								onChange={handleChange}
								className="focus-ring w-full h-[48px] px-4 rounded-[12px] border border-[#E5E7EB] bg-white text-[15px] text-[#0F172A] placeholder-[#9CA3AF] focus:border-[#398EB3] focus:outline-none transition-colors"
							/>
						</div>
						<div>
							<label htmlFor="minStock" className="block text-[13.5px] font-medium text-[#374151] mb-1.5">
								Min. Stok <span className="text-[#EF4444]">*</span>
							</label>
							<input
								id="minStock"
								name="minStock"
								type="number"
								required
								min="1"
								placeholder="0"
								value={form.minStock}
								onChange={handleChange}
								className="focus-ring w-full h-[48px] px-4 rounded-[12px] border border-[#E5E7EB] bg-white text-[15px] text-[#0F172A] placeholder-[#9CA3AF] focus:border-[#398EB3] focus:outline-none transition-colors"
							/>
						</div>
					</div>

					<div>
						<label htmlFor="location" className="block text-[13.5px] font-medium text-[#374151] mb-1.5">Lokasi Gudang</label>
						<input
							id="location"
							name="location"
							type="text"
							placeholder="Contoh: Gudang A-1"
							value={form.location}
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
