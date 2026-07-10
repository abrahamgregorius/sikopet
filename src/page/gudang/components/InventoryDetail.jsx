/** @format */

import { useState } from "react";

export default function InventoryDetail({ item, onClose, onRestock }) {
	const [restockQty, setRestockQty] = useState("");

	if (!item) return null;

	const isLow = item.stock < item.minStock;

	const handleRestock = () => {
		if (!restockQty || Number(restockQty) <= 0) return;
		onRestock(item.id, Number(restockQty));
	};

	return (
		<div className="rounded-2xl bg-white border border-[#D8E4EA] shadow-soft overflow-hidden">
			<div className="p-5 border-b border-[#E8EEF2] flex items-center justify-between">
				<h3 className="font-display font-bold text-[16px] text-[#0F172A]">Detail Inventaris</h3>
				<button onClick={onClose} className="focus-ring p-1.5 rounded-lg text-[#94A3B8] hover:bg-[#F1F5F9] transition-colors" aria-label="Tutup">
					<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
						<path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
					</svg>
				</button>
			</div>

			<div className="p-5 space-y-5">
				<div className="flex items-center gap-4">
					<div className="w-14 h-14 rounded-xl bg-[#EAF6FB] grid place-items-center">
						<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#398EB3" strokeWidth="1.8">
							<path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
							<path d="M3 6h18M16 10a4 4 0 01-8 0" />
						</svg>
					</div>
					<div>
						<p className="font-display font-bold text-[18px] text-[#0F172A]">{item.name}</p>
						<span className="text-[13px] text-[#94A3B8] font-mono">{item.code}</span>
					</div>
				</div>

				<div className="rounded-xl bg-[#F1F5F9] p-4">
					<div className="flex justify-between items-center mb-3">
						<span className="text-[12px] text-[#94A3B8]">Stok Saat Ini</span>
						{isLow && (
							<span className="text-[11px] font-semibold text-[#EF4444] bg-[#FEE2E2] px-2 py-0.5 rounded-full">Stok Rendah</span>
						)}
					</div>
					<p className={`font-display font-extrabold text-[28px] tracking-tight ${isLow ? "text-[#EF4444]" : "text-[#0F172A]"}`}>
						{item.stock} <span className="text-[16px] text-[#94A3B8]">{item.unit}</span>
					</p>
					<div className="mt-3 h-2 rounded-full bg-[#D8E4EA] overflow-hidden">
						<div
							className={`h-full rounded-full transition-all ${isLow ? "bg-[#EF4444]" : "bg-gradient-to-r from-[#398eb3] to-[#4CC9B0]"}`}
							style={{ width: `${Math.min((item.stock / (item.minStock * 2)) * 100, 100)}%` }}
						/>
					</div>
					<p className="text-[11px] text-[#94A3B8] mt-1">Min: {item.minStock} {item.unit}</p>
				</div>

				<div className="grid grid-cols-2 gap-3">
					<div className="rounded-xl bg-[#F1F5F9] p-3.5">
						<p className="text-[11px] text-[#94A3B8]">Kategori</p>
						<p className="text-[13px] font-bold text-[#0F172A] mt-0.5">{item.category}</p>
					</div>
					<div className="rounded-xl bg-[#F1F5F9] p-3.5">
						<p className="text-[11px] text-[#94A3B8]">Lokasi</p>
						<p className="text-[13px] font-bold text-[#0F172A] mt-0.5">{item.location}</p>
					</div>
					<div className="rounded-xl bg-[#F1F5F9] p-3.5 col-span-2">
						<p className="text-[11px] text-[#94A3B8]">Terakhir Restok</p>
						<p className="text-[13px] font-bold text-[#0F172A] mt-0.5">{item.lastRestock}</p>
					</div>
				</div>

				<div className="flex gap-3">
					<input
						type="number"
						min="1"
						placeholder="Jumlah restok"
						value={restockQty}
						onChange={(e) => setRestockQty(e.target.value)}
						className="focus-ring flex-1 h-10 px-3 rounded-xl border border-[#E5E7EB] bg-white text-[14px] text-[#0F172A] placeholder-[#9CA3AF] focus:border-[#398EB3] focus:outline-none transition-colors"
					/>
					<button
						onClick={handleRestock}
						className="focus-ring h-10 px-4 rounded-xl bg-[#398EB3] text-white font-semibold text-[14px] hover:bg-[#2F7A9A] transition-colors"
					>
						Restok
					</button>
				</div>
			</div>

			<div className="p-4 border-t border-[#E8EEF2] flex gap-3">
				<button className="focus-ring flex-1 h-10 rounded-xl border border-[#E5E7EB] text-[#475569] font-semibold text-[14px] hover:bg-[#F1F5F9] transition-colors">
					Edit
				</button>
				<button className="focus-ring flex-1 h-10 rounded-xl bg-[#398EB3] text-white font-semibold text-[14px] hover:bg-[#2F7A9A] transition-colors">
					Riwayat
				</button>
			</div>
		</div>
	);
}
