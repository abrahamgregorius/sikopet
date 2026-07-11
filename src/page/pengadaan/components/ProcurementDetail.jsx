/** @format */

export default function ProcurementDetail({
	procurement,
	onClose,
	onApprove,
	onReceive,
}) {
	if (!procurement) return null;

	return (
		<div className="rounded-lg bg-white border border-[#D8E4EA] shadow-soft overflow-hidden">
			<div className="p-5 border-b border-[#E8EEF2] flex items-center justify-between">
				<h3 className="font-display font-bold text-[16px] text-[#0F172A]">
					Detail Pengadaan
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
				<div className="flex items-center gap-4">
					<span className="w-14 h-14 rounded-lg bg-[#FEF3C7] grid place-items-center text-[#F59E0B] font-bold text-[20px]">
						{procurement.supplier.charAt(0)}
					</span>
					<div>
						<p className="font-display font-bold text-[18px] text-[#0F172A]">
							{procurement.supplier}
						</p>
						<span
							className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-lg mt-1 ${
								procurement.status === "pending"
									? "text-[#F59E0B] bg-[#FEF3C7]"
									: procurement.status === "approved"
										? "text-[#398EB3] bg-[#EAF6FB]"
										: procurement.status === "received"
											? "text-[#22C55E] bg-[#DCFCE7]"
											: "text-[#EF4444] bg-[#FEE2E2]"
							}`}
						>
							{procurement.status === "pending"
								? "Menunggu"
								: procurement.status === "approved"
									? "Disetujui"
									: procurement.status === "received"
										? "Diterima"
										: "Ditolak"}
						</span>
					</div>
				</div>

				<div className="rounded-lg bg-[#F1F5F9] p-4 space-y-3">
					<div className="flex justify-between text-[13px]">
						<span className="text-[#94A3B8]">Tanggal</span>
						<span className="font-medium text-[#0F172A]">
							{procurement.date}
						</span>
					</div>
					<div className="flex justify-between text-[13px]">
						<span className="text-[#94A3B8]">Produk</span>
						<span className="font-medium text-[#0F172A]">
							{procurement.product}
						</span>
					</div>
					<div className="flex justify-between text-[13px]">
						<span className="text-[#94A3B8]">Jumlah</span>
						<span className="font-medium text-[#0F172A]">
							{procurement.quantity} unit
						</span>
					</div>
					<div className="flex justify-between text-[13px]">
						<span className="text-[#94A3B8]">Harga Satuan</span>
						<span className="font-medium text-[#0F172A]">
							Rp {procurement.unitPrice.toLocaleString("id-ID")}
						</span>
					</div>
					<div className="border-t border-[#D8E4EA] pt-3 flex justify-between text-[14px] font-semibold">
						<span className="text-[#0F172A]">Total</span>
						<span className="text-[#398EB3]">
							Rp {procurement.total.toLocaleString("id-ID")}
						</span>
					</div>
				</div>

				<div className="grid grid-cols-2 gap-3">
					<div className="rounded-lg bg-[#F1F5F9] p-3.5">
						<p className="text-[11px] text-[#94A3B8]">Metode Bayar</p>
						<p className="text-[14px] font-bold text-[#0F172A] mt-0.5 capitalize">
							{procurement.method}
						</p>
					</div>
					<div className="rounded-lg bg-[#F1F5F9] p-3.5">
						<p className="text-[11px] text-[#94A3B8]">Status</p>
						<p className="text-[14px] font-bold text-[#0F172A] mt-0.5 capitalize">
							{procurement.status}
						</p>
					</div>
				</div>
			</div>

			<div className="p-4 border-t border-[#E8EEF2] flex gap-3">
				{procurement.status === "pending" && (
					<button
						onClick={() => onApprove(procurement.id)}
						className="focus-ring flex-1 h-10 rounded-lg bg-[#398EB3] text-white font-semibold text-[14px] hover:bg-[#2F7A9A] transition-colors"
					>
						Approve
					</button>
				)}
				{procurement.status === "approved" && (
					<button
						onClick={() => onReceive(procurement.id)}
						className="focus-ring flex-1 h-10 rounded-lg bg-[#22C55E] text-white font-semibold text-[14px] hover:bg-[#16A34A] transition-colors"
					>
						Terima Barang
					</button>
				)}
				<button className="focus-ring flex-1 h-10 rounded-lg border border-[#E5E7EB] text-[#475569] font-semibold text-[14px] hover:bg-[#F1F5F9] transition-colors">
					Detail
				</button>
			</div>
		</div>
	);
}
