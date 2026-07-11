/** @format */

const STATUS_CONFIG = {
	active: { label: "Aktif", color: "text-[#22C55E] bg-[#22C55E]/10" },
	pending: { label: "Menunggu", color: "text-[#F59E0B] bg-[#F59E0B]/10" },
	completed: { label: "Lunas", color: "text-[#94A3B8] bg-[#F1F5F9]" },
	rejected: { label: "Ditolak", color: "text-[#EF4444] bg-[#EF4444]/10" },
	overdue: { label: "Terlambat", color: "text-[#EF4444] bg-[#EF4444]/10" },
};

const FILTERS = [
	{ id: "all", label: "Semua" },
	{ id: "active", label: "Aktif" },
	{ id: "pending", label: "Menunggu" },
	{ id: "completed", label: "Lunas" },
];

export default function LoanList({
	loans,
	statusFilter,
	onFilter,
	onSelect,
	selectedId,
}) {
	return (
		<div className="rounded-lg bg-white border border-[#E5E7EB] overflow-hidden">
			<div className="p-5 border-b border-[#E8EEF2]">
				<div className="flex gap-2 flex-wrap">
					{FILTERS.map((f) => (
						<button
							key={f.id}
							onClick={() => onFilter(f.id)}
							className={`shrink-0 focus-ring px-3 py-2 rounded-lg text-[13px] font-semibold transition-all ${
								statusFilter === f.id
									? "bg-[#398EB3] text-white"
									: "bg-[#F1F5F9] text-[#475569] hover:bg-[#E5E7EB]"
							}`}
						>
							{f.label}
						</button>
					))}
				</div>
			</div>

			<div className="overflow-x-auto">
				<table className="w-full min-w-[560px]">
					<thead>
						<tr className="border-b border-[#E8EEF2]">
							<th className="text-left px-5 py-3 text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider">
								Anggota
							</th>
							<th className="text-left px-5 py-3 text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider">
								Pinjaman
							</th>
							<th className="text-left px-5 py-3 text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider">
								Bunga
							</th>
							<th className="text-left px-5 py-3 text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider">
								Tenor
							</th>
							<th className="text-left px-5 py-3 text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider">
								Status
							</th>
						</tr>
					</thead>
					<tbody>
						{loans.map((loan) => {
							const status = STATUS_CONFIG[loan.status];
							const progress = (loan.paid / loan.principal) * 100;
							return (
								<tr
									key={loan.id}
									onClick={() => onSelect(loan)}
									className={`border-b border-[#E8EEF2] last:border-0 cursor-pointer transition-colors hover:bg-[#F7FAFC] ${
										selectedId === loan.id ? "bg-[#EAF6FB]" : ""
									}`}
								>
									<td className="px-5 py-3.5">
										<div className="flex items-center gap-2.5">
											<span className="w-8 h-8 rounded-lg bg-[#EAF6FB] grid place-items-center text-[#398EB3] font-bold text-[12px]">
												{loan.member.charAt(0)}
											</span>
											<span className="text-[14px] font-medium text-[#0F172A]">
												{loan.member}
											</span>
										</div>
									</td>
									<td className="px-5 py-3.5">
										<p className="text-[14px] font-semibold text-[#0F172A]">
											Rp {loan.principal.toLocaleString("id-ID")}
										</p>
										{loan.status === "active" && (
											<div className="mt-1.5 w-24 h-1.5 rounded-lg bg-[#F1F5F9] overflow-hidden">
												<div
													className="h-full rounded-lg bg-gradient-to-r from-[#398eb3] to-[#4CC9B0]"
													style={{ width: `${progress}%` }}
												></div>
											</div>
										)}
									</td>
									<td className="px-5 py-3.5 text-[13.5px] text-[#475569]">
										{loan.rate}%
									</td>
									<td className="px-5 py-3.5 text-[13.5px] text-[#475569]">
										{loan.tenor} bln
									</td>
									<td className="px-5 py-3.5">
										<span
											className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-lg ${status.color}`}
										>
											{status.label}
										</span>
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>

			{loans.length === 0 && (
				<div className="text-center py-12 text-[#94A3B8]">
					<p className="text-[14px]">Tidak ada pinjaman</p>
				</div>
			)}
		</div>
	);
}
