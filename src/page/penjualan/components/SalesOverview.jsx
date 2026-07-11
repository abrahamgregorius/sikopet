/** @format */

function formatCurrency(value) {
	if (value >= 1000000) {
		return `Rp ${(value / 1000000).toFixed(1)}jt`;
	} else if (value >= 1000) {
		return `Rp ${(value / 1000).toFixed(0)}K`;
	}
	return `Rp ${value?.toLocaleString("id-ID") || 0}`;
}

export default function SalesOverview({
	totalSales,
	totalPending,
	transactionCount,
	avgTransaction,
	loading,
}) {
	if (loading) {
		return (
			<div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
				{[1, 2, 3, 4].map((i) => (
					<div key={i} className="rounded-lg bg-white border border-[#E5E7EB] p-5 animate-pulse">
						<div className="h-3 bg-[#F1F5F9] rounded w-20 mb-3"></div>
						<div className="h-7 bg-[#F1F5F9] rounded w-28 mb-2"></div>
						<div className="h-3 bg-[#F1F5F9] rounded w-16"></div>
					</div>
				))}
			</div>
		);
	}

	return (
		<div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
			<div className="rounded-lg bg-white border border-[#E5E7EB] p-5">
				<p className="text-[12px] text-[#94A3B8] font-medium mb-2">
					Total Penjualan
				</p>
				<p className="font-display font-extrabold text-[#22C55E] text-[24px] sm:text-[28px] tracking-tight">
					{formatCurrency(totalSales)}
				</p>
				<p className="text-[11px] text-[#94A3B8] mt-1">Transaksi berhasil</p>
			</div>

			<div className="rounded-lg bg-white border border-[#E5E7EB] p-5">
				<p className="text-[12px] text-[#94A3B8] font-medium mb-2">
					Menunggu Pembayaran
				</p>
				<p className="font-display font-extrabold text-[#F59E0B] text-[24px] sm:text-[28px] tracking-tight">
					{formatCurrency(totalPending)}
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

			<div className="rounded-lg bg-white border border-[#E5E7EB] p-5">
				<p className="text-[12px] text-[#94A3B8] font-medium mb-2">
					Rata-rata Transaksi
				</p>
				<p className="font-display font-extrabold text-[#0F172A] text-[24px] sm:text-[28px] tracking-tight">
					{formatCurrency(avgTransaction)}
				</p>
				<p className="text-[11px] text-[#94A3B8] mt-1">Per transaksi</p>
			</div>
		</div>
	);
}
