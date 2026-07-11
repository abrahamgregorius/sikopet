/** @format */

export default function RecentTransactions({ transactions = [] }) {
	return (
		<div className="rounded-lg bg-white border border-[#E5E7EB] p-5">
			<div className="flex items-center justify-between mb-4">
				<h3 className="font-display font-bold text-[16px] text-[#0F172A]">
					Transaksi Terakhir
				</h3>
				<button className="focus-ring text-[12px] font-medium text-[#398EB3] hover:text-[#2F7A9A] transition-colors">
					Lihat Semua
				</button>
			</div>

			<div className="space-y-2">
				{transactions.length === 0 ? (
					<p className="text-[13px] text-[#94A3B8] text-center py-4">
						Tidak ada transaksi
					</p>
				) : (
					transactions.map((tx) => (
						<div
							key={tx.id}
							className="flex items-center justify-between py-2.5 border-b border-[#E8EEF2] last:border-0"
						>
							<div className="flex items-center gap-3">
								<div className="w-9 h-9 rounded-lg bg-[#EAF6FB] grid place-items-center">
									<svg
										width="16"
										height="16"
										viewBox="0 0 24 24"
										fill="none"
										stroke="#398EB3"
										strokeWidth="2"
									>
										<rect x="2" y="5" width="20" height="14" rx="2" />
										<path d="M2 10h20" />
									</svg>
								</div>
								<div>
									<p className="text-[13px] font-semibold text-[#0F172A]">
										{tx.invoice || `TX-${tx.id}`}
									</p>
									<p className="text-[11px] text-[#94A3B8]">
										{tx.time || "-"} · {tx.items?.length || 0} item
									</p>
								</div>
							</div>
							<div className="text-right">
								<p className="text-[13px] font-semibold text-[#0F172A]">
									Rip {(tx.total || 0).toLocaleString("id-ID")}
								</p>
								<span className="text-[10px] font-semibold text-[#22C55E] bg-[#22C55E]/10 px-1.5 py-0.5 rounded-lg">
									{tx.status || "Lunas"}
								</span>
							</div>
						</div>
					))
				)}
			</div>
		</div>
	);
}
