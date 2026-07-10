/** @format */

const STATUS_CONFIG = {
	pending: { label: "Menunggu", color: "text-[#F59E0B] bg-[#F59E0B]/10" },
	approved: { label: "Disetujui", color: "text-[#398EB3] bg-[#EAF6FB]" },
	received: { label: "Diterima", color: "text-[#22C55E] bg-[#22C55E]/10" },
	rejected: { label: "Ditolak", color: "text-[#EF4444] bg-[#EF4444]/10" },
};

const FILTERS = [
	{ id: "all", label: "Semua" },
	{ id: "pending", label: "Menunggu" },
	{ id: "approved", label: "Disetujui" },
	{ id: "received", label: "Diterima" },
];

export default function ProcurementList({ procurements, search, statusFilter, onSearch, onFilter, onSelect, selectedId }) {
	return (
		<div className="rounded-2xl bg-white border border-[#D8E4EA] shadow-soft overflow-hidden">
			<div className="p-5 border-b border-[#E8EEF2]">
				<div className="flex flex-col sm:flex-row gap-3">
					<div className="relative flex-1">
						<svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
							<circle cx="11" cy="11" r="8" />
							<path d="M21 21l-4.35-4.35" strokeLinecap="round" />
						</svg>
						<input
							type="text"
							placeholder="Cari pemasok atau produk..."
							value={search}
							onChange={(e) => onSearch(e.target.value)}
							className="focus-ring w-full h-[40px] pl-9 pr-4 rounded-xl border border-[#E5E7EB] bg-white text-[14px] text-[#0F172A] placeholder-[#9CA3AF] focus:border-[#398EB3] focus:outline-none transition-colors"
						/>
					</div>
					<div className="flex gap-2 flex-wrap">
						{FILTERS.map((f) => (
							<button
								key={f.id}
								onClick={() => onFilter(f.id)}
								className={`shrink-0 focus-ring px-3 py-2 rounded-xl text-[13px] font-semibold transition-all ${
									statusFilter === f.id ? "bg-[#398EB3] text-white" : "bg-[#F1F5F9] text-[#475569] hover:bg-[#E5E7EB]"
								}`}
							>
								{f.label}
							</button>
						))}
					</div>
				</div>
			</div>

			<div className="overflow-x-auto">
				<table className="w-full min-w-[640px]">
					<thead>
						<tr className="border-b border-[#E8EEF2]">
							<th className="text-left px-5 py-3 text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider">Tanggal</th>
							<th className="text-left px-5 py-3 text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider">Pemasok</th>
							<th className="text-left px-5 py-3 text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider">Produk</th>
							<th className="text-right px-5 py-3 text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider">Total</th>
							<th className="text-left px-5 py-3 text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider">Status</th>
						</tr>
					</thead>
					<tbody>
						{procurements.map((p) => {
							const status = STATUS_CONFIG[p.status];
							return (
								<tr
									key={p.id}
									onClick={() => onSelect(p)}
									className={`border-b border-[#E8EEF2] last:border-0 cursor-pointer transition-colors hover:bg-[#F7FAFC] ${selectedId === p.id ? "bg-[#EAF6FB]" : ""}`}
								>
									<td className="px-5 py-3.5 text-[13.5px] text-[#475569]">{p.date}</td>
									<td className="px-5 py-3.5">
										<div className="flex items-center gap-2.5">
											<span className="w-8 h-8 rounded-full bg-[#FEF3C7] grid place-items-center text-[#F59E0B] font-bold text-[12px]">{p.supplier.charAt(0)}</span>
											<span className="text-[14px] font-medium text-[#0F172A]">{p.supplier}</span>
										</div>
									</td>
									<td className="px-5 py-3.5 text-[13.5px] text-[#475569]">{p.product}</td>
									<td className="px-5 py-3.5 text-right text-[14px] font-semibold text-[#0F172A]">Rp {p.total.toLocaleString("id-ID")}</td>
									<td className="px-5 py-3.5">
										<span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full ${status.color}`}>
											{status.label}
										</span>
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>

			{procurements.length === 0 && (
				<div className="text-center py-12 text-[#94A3B8]">
					<p className="text-[14px]">Tidak ada data pengadaan</p>
				</div>
			)}
		</div>
	);
}
