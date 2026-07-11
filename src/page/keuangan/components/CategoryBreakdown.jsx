/** @format */

export default function CategoryBreakdown({
	income,
	expense,
	totalIncome,
	totalExpense,
}) {
	const incomeEntries = Object.entries(income)
		.map(([name, amount]) => ({
			name,
			amount,
			pct: (amount / totalIncome) * 100,
		}))
		.sort((a, b) => b.amount - a.amount)
		.slice(0, 4);

	const expenseEntries = Object.entries(expense)
		.map(([name, amount]) => ({
			name,
			amount,
			pct: (amount / totalExpense) * 100,
		}))
		.sort((a, b) => b.amount - a.amount)
		.slice(0, 4);

	return (
		<div className="rounded-lg bg-white border border-[#D8E4EA] shadow-soft p-5">
			<h3 className="font-display font-bold text-[16px] text-[#0F172A] mb-5">
				Per Kategori
			</h3>

			<div className="space-y-5">
				<div>
					<div className="flex items-center gap-2 mb-3">
						<span className="w-2.5 h-2.5 rounded-lg bg-[#22C55E]"></span>
						<span className="text-[12px] font-bold text-[#94A3B8] uppercase tracking-wider">
							Pemasukan
						</span>
					</div>
					<div className="space-y-2.5">
						{incomeEntries.map((item) => (
							<div key={item.name}>
								<div className="flex justify-between text-[13px] mb-1">
									<span className="text-[#0F172A]">{item.name}</span>
									<span className="font-semibold text-[#22C55E]">
										Rp {item.amount.toLocaleString("id-ID")}
									</span>
								</div>
								<div className="h-1.5 rounded-lg bg-[#F1F5F9] overflow-hidden">
									<div
										className="h-full rounded-lg bg-[#22C55E]"
										style={{ width: `${item.pct}%` }}
									></div>
								</div>
							</div>
						))}
					</div>
				</div>

				<div className="pt-4 border-t border-[#E8EEF2]">
					<div className="flex items-center gap-2 mb-3">
						<span className="w-2.5 h-2.5 rounded-lg bg-[#EF4444]"></span>
						<span className="text-[12px] font-bold text-[#94A3B8] uppercase tracking-wider">
							Pengeluaran
						</span>
					</div>
					<div className="space-y-2.5">
						{expenseEntries.map((item) => (
							<div key={item.name}>
								<div className="flex justify-between text-[13px] mb-1">
									<span className="text-[#0F172A]">{item.name}</span>
									<span className="font-semibold text-[#EF4444]">
										Rp {item.amount.toLocaleString("id-ID")}
									</span>
								</div>
								<div className="h-1.5 rounded-lg bg-[#F1F5F9] overflow-hidden">
									<div
										className="h-full rounded-lg bg-[#EF4444]"
										style={{ width: `${item.pct}%` }}
									></div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
