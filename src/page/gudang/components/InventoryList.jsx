/** @format */

const ALERT_FILTERS = [
	{ id: "all", label: "Semua" },
	{ id: "low", label: "Stok Rendah" },
	{ id: "ok", label: "Normal" },
];

export default function InventoryList({
	inventory,
	search,
	categoryFilter,
	stockAlert,
	categories,
	onSearch,
	onCategoryFilter,
	onStockAlert,
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
							placeholder="Cari kode atau nama produk..."
							value={search}
							onChange={(e) => onSearch(e.target.value)}
							className="focus-ring w-full h-[40px] pl-9 pr-4 rounded-lg border border-[#E5E7EB] bg-white text-[14px] text-[#0F172A] placeholder-[#9CA3AF] focus:border-[#398EB3] focus:outline-none transition-colors"
						/>
					</div>
				</div>
				<div className="flex flex-wrap gap-2 mt-3">
					<select
						value={categoryFilter}
						onChange={(e) => onCategoryFilter(e.target.value)}
						className="focus-ring h-[36px] px-3 rounded-lg border border-[#E5E7EB] bg-white text-[13px] text-[#475569] focus:border-[#398EB3] focus:outline-none transition-colors"
					>
						<option value="all">Semua Kategori</option>
						{categories.map((c) => (
							<option key={c} value={c}>
								{c}
							</option>
						))}
					</select>
					<div className="flex gap-2">
						{ALERT_FILTERS.map((f) => (
							<button
								key={f.id}
								onClick={() => onStockAlert(f.id)}
								className={`shrink-0 focus-ring px-3 py-1.5 rounded-lg text-[12.5px] font-semibold transition-all ${
									stockAlert === f.id
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
				<table className="w-full min-w-[640px]">
					<thead>
						<tr className="border-b border-[#E8EEF2]">
							<th className="text-left px-5 py-3 text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider">
								Kode
							</th>
							<th className="text-left px-5 py-3 text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider">
								Produk
							</th>
							<th className="text-left px-5 py-3 text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider">
								Kategori
							</th>
							<th className="text-right px-5 py-3 text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider">
								Stok
							</th>
							<th className="text-left px-5 py-3 text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider">
								Status
							</th>
						</tr>
					</thead>
					<tbody>
						{inventory.map((item) => {
							const isLow = item.stock < item.minStock;
							return (
								<tr
									key={item.id}
									onClick={() => onSelect(item)}
									className={`border-b border-[#E8EEF2] last:border-0 cursor-pointer transition-colors hover:bg-[#F7FAFC] ${selectedId === item.id ? "bg-[#EAF6FB]" : ""}`}
								>
									<td className="px-5 py-3.5 text-[12px] font-mono text-[#398EB3] font-medium">
										{item.code}
									</td>
									<td className="px-5 py-3.5 text-[14px] font-medium text-[#0F172A]">
										{item.name}
									</td>
									<td className="px-5 py-3.5 text-[13px] text-[#475569]">
										{item.category}
									</td>
									<td className="px-5 py-3.5 text-right">
										<span
											className={`text-[14px] font-semibold ${isLow ? "text-[#EF4444]" : "text-[#0F172A]"}`}
										>
											{item.stock}{" "}
											<span className="text-[#94A3B8] font-normal">
												{item.unit}
											</span>
										</span>
									</td>
									<td className="px-5 py-3.5">
										{isLow ? (
											<span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-lg text-[#EF4444] bg-[#FEE2E2]">
												<span className="w-1.5 h-1.5 rounded-lg bg-[#EF4444]"></span>
												Rendah
											</span>
										) : (
											<span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-lg text-[#22C55E] bg-[#DCFCE7]">
												<span className="w-1.5 h-1.5 rounded-lg bg-[#22C55E]"></span>
												Normal
											</span>
										)}
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>

			{inventory.length === 0 && (
				<div className="text-center py-12 text-[#94A3B8]">
					<p className="text-[14px]">Tidak ada data inventaris</p>
				</div>
			)}
		</div>
	);
}
