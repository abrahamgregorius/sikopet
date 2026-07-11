/** @format */

export default function SavingsOverview({
	totalSimpanan,
	totalPenarikan,
	netSimpanan,
}) {
	return (
		<div className="grid sm:grid-cols-3 gap-4">
			<div className="rounded-lg bg-[#0F172A] px-6 py-7 shadow-lift">
				<p className="text-[12px] text-white/60 font-medium mb-2">
					Total Simpanan
				</p>
				<p className="font-display font-extrabold text-white text-[26px] sm:text-[32px] tracking-tight">
					Rp {totalSimpanan.toLocaleString("id-ID")}
				</p>
				<div className="flex items-center gap-1.5 mt-2">
					<span className="w-2 h-2 rounded-lg bg-[#22C55E]"></span>
					<span className="text-[11px] text-white/60">Simpanan Masuk</span>
				</div>
			</div>

			<div className="rounded-lg bg-white border border-[#D8E4EA] shadow-soft p-5">
				<p className="text-[12px] text-[#94A3B8] font-medium mb-2">
					Total Penarikan
				</p>
				<p className="font-display font-extrabold text-[#0F172A] text-[26px] sm:text-[32px] tracking-tight">
					Rp {totalPenarikan.toLocaleString("id-ID")}
				</p>
				<div className="flex items-center gap-1.5 mt-2">
					<span className="w-2 h-2 rounded-lg bg-[#EF4444]"></span>
					<span className="text-[11px] text-[#94A3B8]">Penarikan</span>
				</div>
			</div>

			<div className="rounded-lg bg-white border border-[#D8E4EA] shadow-soft p-5">
				<p className="text-[12px] text-[#94A3B8] font-medium mb-2">
					Saldo Bersih
				</p>
				<p className="font-display font-extrabold text-[#398EB3] text-[26px] sm:text-[32px] tracking-tight">
					Rp {Math.max(0, netSimpanan).toLocaleString("id-ID")}
				</p>
				<div className="flex items-center gap-1.5 mt-2">
					<span className="w-2 h-2 rounded-lg bg-[#398EB3]"></span>
					<span className="text-[11px] text-[#94A3B8]">Saldo Available</span>
				</div>
			</div>
		</div>
	);
}
