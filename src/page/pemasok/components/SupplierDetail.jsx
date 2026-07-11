/** @format */

export default function SupplierDetail({ supplier, onClose, onActivate }) {
	if (!supplier) return null;

	return (
		<div className="rounded-lg bg-white border border-[#E5E7EB] overflow-hidden">
			<div className="p-5 border-b border-[#E8EEF2] flex items-center justify-between">
				<h3 className="font-display font-bold text-[16px] text-[#0F172A]">
					Detail Pemasok
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
						{supplier.name.charAt(0)}
					</span>
					<div>
						<p className="font-display font-bold text-[18px] text-[#0F172A]">
							{supplier.name}
						</p>
						<span
							className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-lg mt-1 ${supplier.status === "active" ? "text-[#22C55E] bg-[#DCFCE7]" : supplier.status === "pending" ? "text-[#F59E0B] bg-[#FEF3C7]" : "text-[#94A3B8] bg-[#F1F5F9]"}`}
						>
							{supplier.status === "active"
								? "Aktif"
								: supplier.status === "pending"
									? "Menunggu"
									: "Tidak Aktif"}
						</span>
					</div>
				</div>

				<div className="rounded-lg bg-[#F1F5F9] p-4 space-y-3">
					<div className="flex justify-between text-[13px]">
						<span className="text-[#94A3B8]">Kategori</span>
						<span className="font-medium text-[#0F172A]">
							{supplier.category}
						</span>
					</div>
					<div className="flex justify-between text-[13px]">
						<span className="text-[#94A3B8]">Kontak</span>
						<span className="font-medium text-[#0F172A]">
							{supplier.contact}
						</span>
					</div>
					<div className="flex justify-between text-[13px]">
						<span className="text-[#94A3B8]">Telepon</span>
						<span className="font-medium text-[#0F172A]">{supplier.phone}</span>
					</div>
					<div className="flex justify-between text-[13px]">
						<span className="text-[#94A3B8]">Email</span>
						<span className="font-medium text-[#0F172A]">{supplier.email}</span>
					</div>
				</div>

				<div className="grid grid-cols-2 gap-3">
					<div className="rounded-lg bg-[#F1F5F9] p-3.5">
						<p className="text-[11px] text-[#94A3B8]">Total Transaksi</p>
						<p className="text-[15px] font-bold text-[#0F172A] mt-0.5">
							Rp {(supplier.totalTransaction / 1000000).toFixed(1)}jt
						</p>
					</div>
					<div className="rounded-lg bg-[#F1F5F9] p-3.5">
						<p className="text-[11px] text-[#94A3B8]">Rating</p>
						<p className="text-[15px] font-bold text-[#0F172A] mt-0.5">
							{supplier.rating > 0 ? supplier.rating.toFixed(1) : "-"}
						</p>
					</div>
				</div>

				<div className="rounded-lg bg-[#F1F5F9] p-3.5">
					<p className="text-[11px] text-[#94A3B8]">Alamat</p>
					<p className="text-[13px] font-medium text-[#0F172A] mt-0.5">
						{supplier.address}
					</p>
				</div>
			</div>

			<div className="p-4 border-t border-[#E8EEF2] flex gap-3">
				{supplier.status === "pending" && (
					<button
						onClick={() => onActivate(supplier.id)}
						className="focus-ring flex-1 h-10 rounded-lg bg-[#22C55E] text-white font-semibold text-[14px] hover:bg-[#16A34A] transition-colors"
					>
						Aktivasi
					</button>
				)}
				<button className="focus-ring flex-1 h-10 rounded-lg border border-[#E5E7EB] text-[#475569] font-semibold text-[14px] hover:bg-[#F1F5F9] transition-colors">
					Riwayat
				</button>
			</div>
		</div>
	);
}
