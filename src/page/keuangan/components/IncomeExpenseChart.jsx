/** @format */

export default function IncomeExpenseChart({ totalIncome, totalExpense }) {
	const max = Math.max(totalIncome, totalExpense);
	const incomeWidth = (totalIncome / max) * 100;
	const expenseWidth = (totalExpense / max) * 100;

	return (
		<div className="rounded-2xl bg-white border border-[#D8E4EA] shadow-soft p-5">
			<h3 className="font-display font-bold text-[16px] text-[#0F172A] mb-5">
				Pemasukan vs Pengeluaran
			</h3>

			<div className="space-y-6">
				<div>
					<div className="flex justify-between items-end mb-2">
						<div className="flex items-center gap-2">
							<span className="w-3 h-3 rounded-full bg-[#22C55E]"></span>
							<span className="text-[13px] font-medium text-[#0F172A]">Pemasukan</span>
						</div>
						<span className="text-[14px] font-bold text-[#22C55E]">
							Rp {totalIncome.toLocaleString("id-ID")}
						</span>
					</div>
					<div className="h-5 rounded-full bg-[#F1F5F9] overflow-hidden">
						<div
							className="h-full rounded-full bg-[#22C55E] transition-all duration-700"
							style={{ width: `${incomeWidth}%` }}
						></div>
					</div>
				</div>

				<div>
					<div className="flex justify-between items-end mb-2">
						<div className="flex items-center gap-2">
							<span className="w-3 h-3 rounded-full bg-[#EF4444]"></span>
							<span className="text-[13px] font-medium text-[#0F172A]">Pengeluaran</span>
						</div>
						<span className="text-[14px] font-bold text-[#EF4444]">
							Rp {totalExpense.toLocaleString("id-ID")}
						</span>
					</div>
					<div className="h-5 rounded-full bg-[#F1F5F9] overflow-hidden">
						<div
							className="h-full rounded-full bg-[#EF4444] transition-all duration-700"
							style={{ width: `${expenseWidth}%` }}
						></div>
					</div>
				</div>

				<div className="pt-4 border-t border-[#E8EEF2]">
					<div className="flex items-center justify-between">
						<span className="text-[13px] text-[#94A3B8]">Rasio</span>
						<span className={`text-[14px] font-bold ${totalIncome >= totalExpense ? "text-[#22C55E]" : "text-[#EF4444]"}`}>
							{(totalIncome / totalExpense).toFixed(2)}x
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}
