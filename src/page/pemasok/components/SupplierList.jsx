/** @format */

const STATUS_CONFIG = {
	active: { label: "Aktif", color: "text-[#22C55E] bg-[#22C55E]/10" },
	pending: { label: "Menunggu", color: "text-[#F59E0B] bg-[#F59E0B]/10" },
	inactive: { label: "Tidak Aktif", color: "text-[#94A3B8] bg-[#F1F5F9]" },
};

export default function SupplierList({
	suppliers,
	search,
	categoryFilter,
	categories,
	onSearch,
	onCategoryFilter,
	onSelect,
	selectedId,
}) {
	return (
		<div className="rounded-lg bg-white border border-[#E5E7EB] overflow-hidden">
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
							placeholder="Cari nama atau kontak..."
							value={search}
							onChange={(e) => onSearch(e.target.value)}
							className="focus-ring w-full h-[40px] pl-9 pr-4 rounded-lg border border-[#E5E7EB] bg-white text-[14px] text-[#0F172A] placeholder-[#9CA3AF] focus:border-[#398EB3] focus:outline-none transition-colors"
						/>
					</div>
					<select
						value={categoryFilter}
						onChange={(e) => onCategoryFilter(e.target.value)}
						className="focus-ring h-[40px] px-3 rounded-lg border border-[#E5E7EB] bg-white text-[13px] text-[#475569] focus:border-[#398EB3] focus:outline-none transition-colors"
					>
						<option value="all">Semua Kategori</option>
						{categories.map((c) => (
							<option key={c} value={c}>
								{c}
							</option>
						))}
					</select>
				</div>
			</div>

			<div className="overflow-x-auto">
				<table className="w-full min-w-[560px]">
					<thead>
						<tr className="border-b border-[#E8EEF2]">
							<th className="text-left px-5 py-3 text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider">
								Pemasok
							</th>
							<th className="text-left px-5 py-3 text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider">
								Kategori
							</th>
							<th className="text-right px-5 py-3 text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider">
								Total Transaksi
							</th>
							<th className="text-left px-5 py-3 text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider">
								Status
							</th>
						</tr>
					</thead>
					<tbody>
						{suppliers.map((s) => {
							const status = STATUS_CONFIG[s.status];
							return (
								<tr
									key={s.id}
									onClick={() => onSelect(s)}
									className={`border-b border-[#E8EEF2] last:border-0 cursor-pointer transition-colors hover:bg-[#F7FAFC] ${selectedId === s.id ? "bg-[#EAF6FB]" : ""}`}
								>
									<td className="px-5 py-3.5">
										<div className="flex items-center gap-3">
											<span className="w-9 h-9 rounded-lg bg-[#FEF3C7] grid place-items-center text-[#F59E0B] font-bold text-[13px]">
												{s.name.charAt(0)}
											</span>
											<div>
												<p className="text-[14px] font-semibold text-[#0F172A]">
													{s.name}
												</p>
												<p className="text-[11px] text-[#94A3B8]">
													{s.contact}
												</p>
											</div>
										</div>
									</td>
									<td className="px-5 py-3.5 text-[13px] text-[#475569]">
										{s.category}
									</td>
									<td className="px-5 py-3.5 text-right text-[13px] font-semibold text-[#0F172A]">
										Rp {(s.totalTransaction / 1000000).toFixed(1)}jt
									</td>
									<td className="px-5 py-3.5">
										<span
											className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-lg ${status.color}`}
										>
											<span
												className={`w-1.5 h-1.5 rounded-lg ${s.status === "active" ? "bg-[#22C55E]" : s.status === "pending" ? "bg-[#F59E0B]" : "bg-[#94A3B8]"}`}
											></span>
											{status.label}
										</span>
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>

			{suppliers.length === 0 && (
				<div className="text-center py-12 text-[#94A3B8]">
					<p className="text-[14px]">Tidak ada data pemasok</p>
				</div>
			)}
		</div>
	);
}
