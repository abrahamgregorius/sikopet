/** @format */

export default function SalesOverview({
	totalSales,
	totalPending,
	transactionCount,
	avgTransaction,
}) {
	return (
		<div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
			<div className="rounded-lg bg-white border border-[#E5E7EB] p-5">
				<p className="text-[12px] text-[#94A3B8] font-medium mb-2">
					Total Penjualan
				</p>
				<p className="font-display font-extrabold text-[#22C55E] text-[24px] sm:text-[28px] tracking-tight">
					Rp {(totalSales / 1000000).toFixed(1)}jt
				</p>
				<p className="text-[11px] text-[#94A3B8] mt-1">Transaksi berhasil</p>
			</div>

			<div className="rounded-lg bg-white border border-[#E5E7EB] p-5">
				<p className="text-[12px] text-[#94A3B8] font-medium mb-2">
					Menunggu Pembayaran
				</p>
				<p className="font-display font-extrabold text-[#F59E0B] text-[24px] sm:text-[28px] tracking-tight">
					Rp {(totalPending / 1000000).toFixed(1)}jt
				</p>
				<p className="text-[11px] text-[#94A3B8] mt-1">Pending</p>
			</div>

			<div className="rounded-lg bg-white border border-[#E5E7EB] p-5">
				<p className="text-[12px] text-[#94A3B8] font-medium mb-2">
					Jumlah Transaksi
				</p>
				<p className="font-display font-extrabold text-[#398EB3] text-[24px] sm:text-[28px] tracking-tight">
					{transactionCount}
				</p>
				<p className="text-[11px] text-[#94A3B8] mt-1">Transaksi</p>
			</div>

			<div className="rounded-lg bg-[#0F172A] px-6 py-7">
				<p className="text-[12px] text-white/60 font-medium mb-2">
					Rata-rata Transaksi
				</p>
				<p className="font-display font-extrabold text-white text-[24px] sm:text-[28px] tracking-tight">
					Rp {(avgTransaction / 1000).toFixed(0)}K
				</p>
				<p className="text-[11px] text-white/60 mt-1">Per transaksi</p>
			</div>
		</div>
	);
}
