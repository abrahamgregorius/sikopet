/** @format */

export default function WarehouseOverview({
	totalItems,
	totalStock,
	lowStockCount,
}) {
	return (
		<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
			<div className="rounded-lg bg-white border border-[#D8E4EA] shadow-soft p-5">
				<div className="flex items-center gap-3 mb-3">
					<span className="w-10 h-10 rounded-lg bg-[#EAF6FB] grid place-items-center">
						<svg
							width="18"
							height="18"
							viewBox="0 0 24 24"
							fill="none"
							stroke="#398EB3"
							strokeWidth="1.8"
						>
							<path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
							<path d="M9 22V12h6v10" />
						</svg>
					</span>
					<p className="text-[13px] text-[#94A3B8] font-medium">Total Item</p>
				</div>
				<p className="font-display font-extrabold text-[#0F172A] text-[28px] tracking-tight">
					{totalItems}
				</p>
				<p className="text-[11px] text-[#94A3B8] mt-1">Jenis produk berbeda</p>
			</div>

			<div className="rounded-lg bg-white border border-[#D8E4EA] shadow-soft p-5">
				<div className="flex items-center gap-3 mb-3">
					<span className="w-10 h-10 rounded-lg bg-[#DCFCE7] grid place-items-center">
						<svg
							width="18"
							height="18"
							viewBox="0 0 24 24"
							fill="none"
							stroke="#22C55E"
							strokeWidth="1.8"
						>
							<path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
						</svg>
					</span>
					<p className="text-[13px] text-[#94A3B8] font-medium">Total Stok</p>
				</div>
				<p className="font-display font-extrabold text-[#0F172A] text-[28px] tracking-tight">
					{totalStock.toLocaleString("id-ID")}
				</p>
				<p className="text-[11px] text-[#94A3B8] mt-1">Unit keseluruhan</p>
			</div>

			<div className="rounded-[1.75rem] bg-[#0F172A] px-6 py-7 shadow-lift">
				<div className="flex items-center gap-3 mb-3">
					<span className="w-10 h-10 rounded-lg bg-white/10 grid place-items-center">
						<svg
							width="18"
							height="18"
							viewBox="0 0 24 24"
							fill="none"
							stroke="#EF4444"
							strokeWidth="1.8"
						>
							<path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
							<line x1="12" y1="9" x2="12" y2="13" />
							<line x1="12" y1="17" x2="12.01" y2="17" />
						</svg>
					</span>
					<p className="text-[13px] text-white/60 font-medium">Stok Rendah</p>
				</div>
				<p className="font-display font-extrabold text-white text-[28px] tracking-tight">
					{lowStockCount}
				</p>
				<p className="text-[11px] text-white/60 mt-1">Perlu restok segera</p>
			</div>
		</div>
	);
}
