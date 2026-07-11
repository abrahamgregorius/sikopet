/** @format */

export default function SalesDetail({ sale, onClose }) {
	if (!sale) return null;

	return (
		<div className="rounded-lg bg-white border border-[#E5E7EB] overflow-hidden">
			<div className="p-5 border-b border-[#E8EEF2] flex items-center justify-between">
				<h3 className="font-display font-bold text-[16px] text-[#0F172A]">
					Detail Transaksi
				</h3>
				<button
					onClick={onClose}
					className="focus-ring p-1.5 rounded-lg text-[#94A3B8] hover:bg-[#F1F5F9] transition-colors"
					aria-label="Tutup"
				>
					<svg
						width="18"
						height="18"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
					>
						<path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
					</svg>
				</button>
			</div>

			<div className="p-5 space-y-5">
				<div className="flex items-center justify-between">
					<div>
						<p className="text-[13px] text-[#94A3B8]">Invoice</p>
						<p className="text-[15px] font-bold text-[#398EB3] font-mono">
							{sale.invoice}
						</p>
					</div>
					<span
						className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-lg ${sale.status === "completed" ? "text-[#22C55E] bg-[#22C55E]/10" : "text-[#F59E0B] bg-[#F59E0B]/10"}`}
					>
						{sale.status === "completed" ? "Lunas" : "Menunggu"}
					</span>
				</div>

				<div className="flex items-center gap-3">
					<div className="w-12 h-12 rounded-lg bg-[#EAF6FB] grid place-items-center">
						<svg
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							stroke="#398EB3"
							strokeWidth="1.8"
						>
							<rect x="2" y="5" width="20" height="14" rx="2" />
							<path d="M2 10h20" />
						</svg>
					</div>
					<div>
						<p className="text-[14px] font-semibold text-[#0F172A]">
							{sale.customer}
						</p>
						<p className="text-[12px] text-[#94A3B8]">
							{sale.date} · {sale.payment}
						</p>
					</div>
				</div>

				<div className="rounded-lg bg-[#F1F5F9] p-4 space-y-2.5">
					<div className="flex justify-between text-[13px]">
						<span className="text-[#94A3B8]">Subtotal ({sale.items} item)</span>
						<span className="font-medium text-[#0F172A]">
							Rp {sale.subtotal.toLocaleString("id-ID")}
						</span>
					</div>
					<div className="flex justify-between text-[13px]">
						<span className="text-[#94A3B8]">Pajak 11%</span>
						<span className="font-medium text-[#0F172A]">
							Rp {sale.tax.toLocaleString("id-ID")}
						</span>
					</div>
					<div className="border-t border-[#E5E7EB] pt-2.5 flex justify-between text-[14px] font-bold">
						<span className="text-[#0F172A]">Total</span>
						<span className="text-[#398EB3]">
							Rp {sale.total.toLocaleString("id-ID")}
						</span>
					</div>
				</div>

				<div className="rounded-lg bg-[#F1F5F9] p-3.5">
					<p className="text-[11px] text-[#94A3B8]">Metode Pembayaran</p>
					<p className="text-[14px] font-bold text-[#0F172A] mt-0.5 capitalize">
						{sale.payment}
					</p>
				</div>
			</div>

			<div className="p-4 border-t border-[#E8EEF2] flex gap-3">
				<button className="focus-ring flex-1 h-10 rounded-lg border border-[#E5E7EB] text-[#475569] font-semibold text-[14px] hover:bg-[#F1F5F9] transition-colors">
					Cetak
				</button>
				<button className="focus-ring flex-1 h-10 rounded-lg bg-[#398EB3] text-white font-semibold text-[14px] hover:bg-[#2F7A9A] transition-colors">
					Invoice
				</button>
			</div>
		</div>
	);
}
