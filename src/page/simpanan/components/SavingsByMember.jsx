/** @format */

export default function SavingsByMember({ transactions }) {
	const memberBalances = {};

	transactions.forEach((tx) => {
		if (!memberBalances[tx.member]) {
			memberBalances[tx.member] = 0;
		}
		if (tx.type === "deposit" || tx.type === "interest") {
			memberBalances[tx.member] += tx.amount;
		} else if (tx.type === "withdrawal") {
			memberBalances[tx.member] -= tx.amount;
		}
	});

	const sorted = Object.entries(memberBalances)
		.map(([name, balance]) => ({ name, balance }))
		.sort((a, b) => b.balance - a.balance)
		.slice(0, 8);

	return (
		<div className="rounded-lg bg-white border border-[#D8E4EA] shadow-soft p-5">
			<h3 className="font-display font-bold text-[16px] text-[#0F172A] mb-4">
				Simpanan per Anggota
			</h3>
			<div className="space-y-3">
				{sorted.map((item, i) => (
					<div key={item.name} className="flex items-center gap-3">
						<span className="w-5 text-center text-[12px] font-bold text-[#94A3B8]">
							{i + 1}
						</span>
						<div className="flex-1 min-w-0">
							<div className="flex justify-between items-center mb-1">
								<span className="text-[13px] font-medium text-[#0F172A] truncate">
									{item.name}
								</span>
								<span className="text-[13px] font-semibold text-[#0F172A] ml-2">
									Rp {(item.balance / 1000).toFixed(0)}K
								</span>
							</div>
							<div className="h-1.5 rounded-lg bg-[#F1F5F9] overflow-hidden">
								<div
									className="h-full rounded-lg bg-gradient-to-r from-[#398eb3] to-[#4CC9B0]"
									style={{
										width: `${Math.min((item.balance / sorted[0].balance) * 100, 100)}%`,
									}}
								></div>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
