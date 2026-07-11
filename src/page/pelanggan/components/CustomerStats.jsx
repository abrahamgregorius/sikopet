/** @format */

export default function CustomerStats({ customers }) {
	const total = customers.length;
	const active = customers.filter((c) => c.status === "active").length;
	const totalValue = customers.reduce((sum, c) => sum + c.totalTransaction, 0);
	const totalVisits = customers.reduce((sum, c) => sum + c.visitCount, 0);

	return (
		<div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
			<div className="rounded-lg bg-white border border-[#D8E4EA] shadow-soft p-5">
				<p className="text-[12px] text-[#94A3B8] font-medium mb-2">
					Total Pelanggan
				</p>
				<p className="font-display font-extrabold text-[#0F172A] text-[28px] tracking-tight">
					{total}
				</p>
				<p className="text-[11px] text-[#94A3B8] mt-1">Pelanggan terdaftar</p>
			</div>

			<div className="rounded-lg bg-white border border-[#D8E4EA] shadow-soft p-5">
				<p className="text-[12px] text-[#94A3B8] font-medium mb-2">Aktif</p>
				<p className="font-display font-extrabold text-[#22C55E] text-[28px] tracking-tight">
					{active}
				</p>
				<p className="text-[11px] text-[#94A3B8] mt-1">Pernah bertransaksi</p>
			</div>

			<div className="rounded-lg bg-white border border-[#D8E4EA] shadow-soft p-5">
				<p className="text-[12px] text-[#94A3B8] font-medium mb-2">
					Total Transaksi
				</p>
				<p className="font-display font-extrabold text-[#398EB3] text-[28px] tracking-tight">
					{totalVisits}x
				</p>
				<p className="text-[11px] text-[#94A3B8] mt-1">Kunjungan</p>
			</div>

			<div className="rounded-[1.75rem] bg-[#0F172A] px-6 py-7 shadow-lift">
				<p className="text-[12px] text-white/60 font-medium mb-2">
					Total Nilai
				</p>
				<p className="font-display font-extrabold text-white text-[26px] tracking-tight">
					Rp {(totalValue / 1000000).toFixed(0)}jt
				</p>
				<p className="text-[11px] text-white/60 mt-1">Total penjualan</p>
			</div>
		</div>
	);
}
