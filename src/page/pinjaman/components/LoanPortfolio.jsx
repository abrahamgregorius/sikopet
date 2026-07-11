/** @format */

export default function LoanPortfolio({
	totalOutstanding,
	totalPending,
	activeCount,
	completedCount,
}) {
	return (
		<div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
			<div className="rounded-lg bg-white border border-[#D8E4EA] shadow-soft p-5">
				<p className="text-[12px] text-[#94A3B8] font-medium mb-2">
					Total Outstanding
				</p>
				<p className="font-display font-extrabold text-[#0F172A] text-[24px] sm:text-[28px] tracking-tight">
					Rp {(totalOutstanding / 1000000).toFixed(1)}jt
				</p>
				<div className="flex items-center gap-1.5 mt-2">
					<span className="w-2 h-2 rounded-lg bg-[#398EB3]"></span>
					<span className="text-[11px] text-[#94A3B8]">Pinjaman Aktif</span>
				</div>
			</div>

			<div className="rounded-lg bg-white border border-[#D8E4EA] shadow-soft p-5">
				<p className="text-[12px] text-[#94A3B8] font-medium mb-2">
					Menunggu Persetujuan
				</p>
				<p className="font-display font-extrabold text-[#F59E0B] text-[24px] sm:text-[28px] tracking-tight">
					Rp {(totalPending / 1000000).toFixed(1)}jt
				</p>
				<div className="flex items-center gap-1.5 mt-2">
					<span className="w-2 h-2 rounded-lg bg-[#F59E0B]"></span>
					<span className="text-[11px] text-[#94A3B8]">Pending</span>
				</div>
			</div>

			<div className="rounded-lg bg-white border border-[#D8E4EA] shadow-soft p-5">
				<p className="text-[12px] text-[#94A3B8] font-medium mb-2">
					Pinjaman Aktif
				</p>
				<p className="font-display font-extrabold text-[#0F172A] text-[24px] sm:text-[28px] tracking-tight">
					{activeCount}
				</p>
				<div className="flex items-center gap-1.5 mt-2">
					<span className="w-2 h-2 rounded-lg bg-[#22C55E]"></span>
					<span className="text-[11px] text-[#94A3B8]">Sedang Berjalan</span>
				</div>
			</div>

			<div className="rounded-lg bg-white border border-[#D8E4EA] shadow-soft p-5">
				<p className="text-[12px] text-[#94A3B8] font-medium mb-2">Lunas</p>
				<p className="font-display font-extrabold text-[#0F172A] text-[24px] sm:text-[28px] tracking-tight">
					{completedCount}
				</p>
				<div className="flex items-center gap-1.5 mt-2">
					<span className="w-2 h-2 rounded-lg bg-[#94A3B8]"></span>
					<span className="text-[11px] text-[#94A3B8]">Selesai</span>
				</div>
			</div>
		</div>
	);
}
