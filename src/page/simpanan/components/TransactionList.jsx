/** @format */

const FILTERS = [
	{ id: "all", label: "Semua" },
	{ id: "deposit", label: "Setoran" },
	{ id: "withdrawal", label: "Penarikan" },
	{ id: "interest", label: "Bunga" },
];

const TYPE_STYLES = {
	deposit: {
		label: "Setoran",
		color: "text-[#22C55E] bg-[#22C55E]/10",
		prefix: "+",
	},
	withdrawal: {
		label: "Penarikan",
		color: "text-[#EF4444] bg-[#EF4444]/10",
		prefix: "-",
	},
	interest: {
		label: "Bunga",
		color: "text-[#398EB3] bg-[#EAF6FB]",
		prefix: "+",
	},
};

export default function TransactionList({
	transactions,
	search,
	typeFilter,
	onSearch,
	onFilter,
}) {
	return (
		<div className="rounded-lg bg-white border border-[#D8E4EA] shadow-soft overflow-hidden">
			<div className="p-5 border-b border-[#E8EEF2]">
				<div className="flex flex-col sm:flex-row gap-3">
					<div className="relative flex-1">
						<svg
							className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]"
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
						>
							<circle cx="11" cy="11" r="8" />
							<path d="M21 21l-4.35-4.35" strokeLinecap="round" />
						</svg>
						<input
							type="text"
							placeholder="Cari nama anggota..."
							value={search}
							onChange={(e) => onSearch(e.target.value)}
							className="focus-ring w-full h-[40px] pl-9 pr-4 rounded-lg border border-[#E5E7EB] bg-white text-[14px] text-[#0F172A] placeholder-[#9CA3AF] focus:border-[#398EB3] focus:outline-none transition-colors"
						/>
					</div>
					<div className="flex gap-2 flex-wrap">
						{FILTERS.map((f) => (
							<button
								key={f.id}
								onClick={() => onFilter(f.id)}
								className={`shrink-0 focus-ring px-3 py-2 rounded-lg text-[13px] font-semibold transition-all ${
									typeFilter === f.id
										? "bg-[#398EB3] text-white"
										: "bg-[#F1F5F9] text-[#475569] hover:bg-[#E5E7EB]"
								}`}
							>
								{f.label}
							</button>
						))}
					</div>
				</div>
			</div>

			<div className="overflow-x-auto">
				<table className="w-full min-w-[480px]">
					<thead>
						<tr className="border-b border-[#E8EEF2]">
							<th className="text-left px-5 py-3 text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider">
								Tanggal
							</th>
							<th className="text-left px-5 py-3 text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider">
								Anggota
							</th>
							<th className="text-left px-5 py-3 text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider">
								Keterangan
							</th>
							<th className="text-left px-5 py-3 text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider">
								Jenis
							</th>
							<th className="text-right px-5 py-3 text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider">
								Jumlah
							</th>
						</tr>
					</thead>
					<tbody>
						{transactions.map((tx) => {
							const style = TYPE_STYLES[tx.type];
							return (
								<tr
									key={tx.id}
									className="border-b border-[#E8EEF2] last:border-0 hover:bg-[#F7FAFC] transition-colors"
								>
									<td className="px-5 py-3.5 text-[13.5px] text-[#475569]">
										{tx.date}
									</td>
									<td className="px-5 py-3.5">
										<div className="flex items-center gap-2.5">
											<span className="w-7 h-7 rounded-lg bg-[#EAF6FB] grid place-items-center text-[#398EB3] font-bold text-[11px]">
												{tx.member.charAt(0)}
											</span>
											<span className="text-[13.5px] font-medium text-[#0F172A]">
												{tx.member}
											</span>
										</div>
									</td>
									<td className="px-5 py-3.5 text-[13.5px] text-[#475569]">
										{tx.description}
									</td>
									<td className="px-5 py-3.5">
										<span
											className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-lg ${style.color}`}
										>
											{style.label}
										</span>
									</td>
									<td className="px-5 py-3.5 text-right">
										<span
											className={`text-[14px] font-semibold ${tx.type === "withdrawal" ? "text-[#EF4444]" : "text-[#22C55E]"}`}
										>
											{style.prefix}Rp {tx.amount.toLocaleString("id-ID")}
										</span>
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>

			{transactions.length === 0 && (
				<div className="text-center py-12 text-[#94A3B8]">
					<p className="text-[14px]">Tidak ada transaksi</p>
				</div>
			)}
		</div>
	);
}
