/** @format */

export default function SupplierStats({ suppliers }) {
	const total = suppliers.length;
	const active = suppliers.filter((s) => s.status === "active").length;
	const pending = suppliers.filter((s) => s.status === "pending").length;
	const totalValue = suppliers.reduce((sum, s) => sum + s.totalTransaction, 0);

	return (
		<div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
			<div className="rounded-lg bg-white border border-[#D8E4EA] shadow-soft p-5">
				<p className="text-[12px] text-[#94A3B8] font-medium mb-2">
					Total Pemasok
				</p>
				<p className="font-display font-extrabold text-[#0F172A] text-[28px] tracking-tight">
					{total}
				</p>
				<p className="text-[11px] text-[#94A3B8] mt-1">Pemasok terdaftar</p>
			</div>

			<div className="rounded-lg bg-white border border-[#D8E4EA] shadow-soft p-5">
				<p className="text-[12px] text-[#94A3B8] font-medium mb-2">Aktif</p>
				<p className="font-display font-extrabold text-[#22C55E] text-[28px] tracking-tight">
					{active}
				</p>
				<p className="text-[11px] text-[#94A3B8] mt-1">Sedang beroperasi</p>
			</div>

			<div className="rounded-lg bg-white border border-[#D8E4EA] shadow-soft p-5">
				<p className="text-[12px] text-[#94A3B8] font-medium mb-2">Menunggu</p>
				<p className="font-display font-extrabold text-[#F59E0B] text-[28px] tracking-tight">
					{pending}
				</p>
				<p className="text-[11px] text-[#94A3B8] mt-1">Perlu persetujuan</p>
			</div>

			<div className="rounded-lg bg-[#0F172A] px-6 py-7 shadow-lift">
				<p className="text-[12px] text-white/60 font-medium mb-2">
					Total Nilai
				</p>
				<p className="font-display font-extrabold text-white text-[26px] tracking-tight">
					Rp {(totalValue / 1000000).toFixed(0)}jt
				</p>
				<p className="text-[11px] text-white/60 mt-1">Total transaksi</p>
			</div>
		</div>
	);
}
