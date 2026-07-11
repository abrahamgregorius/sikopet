/** @format */

export default function FinanceOverview({
	totalIncome,
	totalExpense,
	netBalance,
}) {
	return (
		<div className="grid sm:grid-cols-3 gap-4">
			<div className="rounded-lg bg-white border border-[#D8E4EA] shadow-soft p-5">
				<div className="flex items-center gap-3 mb-3">
					<span className="w-10 h-10 rounded-lg bg-[#DCFCE7] grid place-items-center">
						<svg
							width="18"
							height="18"
							viewBox="0 0 24 24"
							fill="none"
							stroke="#22C55E"
							strokeWidth="2"
						>
							<path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
						</svg>
					</span>
					<p className="text-[13px] text-[#94A3B8] font-medium">
						Total Pendapatan
					</p>
				</div>
				<p className="font-display font-extrabold text-[#22C55E] text-[24px] sm:text-[28px] tracking-tight">
					Rp {totalIncome.toLocaleString("id-ID")}
				</p>
				<p className="text-[11px] text-[#94A3B8] mt-1">Bulan Juli 2026</p>
			</div>

			<div className="rounded-lg bg-white border border-[#D8E4EA] shadow-soft p-5">
				<div className="flex items-center gap-3 mb-3">
					<span className="w-10 h-10 rounded-lg bg-[#FEE2E2] grid place-items-center">
						<svg
							width="18"
							height="18"
							viewBox="0 0 24 24"
							fill="none"
							stroke="#EF4444"
							strokeWidth="2"
						>
							<path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
						</svg>
					</span>
					<p className="text-[13px] text-[#94A3B8] font-medium">
						Total Pengeluaran
					</p>
				</div>
				<p className="font-display font-extrabold text-[#EF4444] text-[24px] sm:text-[28px] tracking-tight">
					Rp {totalExpense.toLocaleString("id-ID")}
				</p>
				<p className="text-[11px] text-[#94A3B8] mt-1">Bulan Juli 2026</p>
			</div>

			<div className="rounded-lg bg-[#0F172A] px-6 py-7 shadow-lift">
				<div className="flex items-center gap-3 mb-3">
					<span className="w-10 h-10 rounded-lg bg-white/10 grid place-items-center">
						<svg
							width="18"
							height="18"
							viewBox="0 0 24 24"
							fill="none"
							stroke="white"
							strokeWidth="2"
						>
							<path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
						</svg>
					</span>
					<p className="text-[13px] text-white/60 font-medium">Saldo Bersih</p>
				</div>
				<p
					className={`font-display font-extrabold text-[24px] sm:text-[28px] tracking-tight ${netBalance >= 0 ? "text-[#22C55E]" : "text-[#EF4444]"}`}
				>
					Rp {netBalance.toLocaleString("id-ID")}
				</p>
				<p className="text-[11px] text-white/60 mt-1">
					{netBalance >= 0 ? "Positif" : "Negatif"}
				</p>
			</div>
		</div>
	);
}
