/** @format */

export default function TransactionSummary({ totalTransactions, totalSales, avgTransaction }) {
	return (
		<div className="rounded-2xl bg-[#0F172A] px-5 py-5 shadow-lift">
			<h3 className="font-display font-bold text-white text-[14px] mb-4">
				Ringkasan Hari Ini
			</h3>
			<div className="grid grid-cols-3 gap-4">
				<div className="text-center">
					<p className="font-display font-extrabold text-white text-[22px]">
						{totalTransactions}
					</p>
					<p className="text-[11px] text-white/60 mt-0.5">Transaksi</p>
				</div>
				<div className="text-center border-x border-white/10">
					<p className="font-display font-extrabold text-white text-[22px]">
						Rp{(totalSales / 1000).toFixed(0)}K
					</p>
					<p className="text-[11px] text-white/60 mt-0.5">Penjualan</p>
				</div>
				<div className="text-center">
					<p className="font-display font-extrabold text-white text-[22px]">
						Rp{(avgTransaction / 1000).toFixed(0)}K
					</p>
					<p className="text-[11px] text-white/60 mt-0.5">Rata-rata</p>
				</div>
			</div>
		</div>
	);
}
