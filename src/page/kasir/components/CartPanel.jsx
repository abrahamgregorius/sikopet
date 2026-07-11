/** @format */

const PAYMENT_METHODS = [
	{
		id: "cash",
		label: "Tunai",
		icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z",
	},
	{
		id: "qris",
		label: "QRIS",
		icon: "M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z",
	},
	{
		id: "transfer",
		label: "Transfer",
		icon: "M12 2a10 10 0 100 20 10 10 0 000-20zM12 6v6l4 2",
	},
];

export default function CartPanel({
	cart,
	subtotal,
	discount,
	discountAmount,
	tax,
	grandTotal,
	paymentMethod,
	onSetDiscount,
	onSetPayment,
	onUpdateQty,
	onRemove,
	onBayar,
	onClear,
}) {
	return (
		<div className="rounded-lg bg-white border border-[#E5E7EB] p-5 flex flex-col">
			<div className="flex items-center justify-between mb-4">
				<h3 className="font-display font-bold text-[16px] text-[#0F172A]">
					Keranjang
				</h3>
				{cart.length > 0 && (
					<button
						onClick={onClear}
						className="focus-ring text-[12px] text-[#EF4444] hover:underline"
					>
						Batal
					</button>
				)}
			</div>

			{cart.length === 0 ? (
				<div className="flex-1 flex flex-col items-center justify-center py-10 text-[#94A3B8]">
					<svg
						width="40"
						height="40"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="1.5"
						className="mb-3"
					>
						<circle cx="9" cy="21" r="1" />
						<circle cx="20" cy="21" r="1" />
						<path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
					</svg>
					<p className="text-[13px]">Keranjang kosong</p>
				</div>
			) : (
				<>
					<div className="space-y-3 max-h-[240px] overflow-y-auto mb-4">
						{cart.map((item) => (
							<div
								key={item.id}
								className="flex items-center gap-3 p-2.5 rounded-lg bg-[#F1F5F9]"
							>
								<div className="flex-1 min-w-0">
									<p className="text-[13px] font-semibold text-[#0F172A] truncate">
										{item.name}
									</p>
									<p className="text-[12px] text-[#475569]">
										Rp {item.price.toLocaleString("id-ID")} × {item.qty}
									</p>
								</div>
								<div className="flex items-center gap-1.5">
									<button
										onClick={() => onUpdateQty(item.id, item.qty - 1)}
										className="focus-ring w-7 h-7 rounded-lg bg-white border border-[#E5E7EB] text-[#475569] hover:bg-[#F1F5F9] flex items-center justify-center text-[14px] font-bold transition-colors"
									>
										-
									</button>
									<span className="w-8 text-center text-[13px] font-semibold">
										{item.qty}
									</span>
									<button
										onClick={() => onUpdateQty(item.id, item.qty + 1)}
										className="focus-ring w-7 h-7 rounded-lg bg-white border border-[#E5E7EB] text-[#475569] hover:bg-[#F1F5F9] flex items-center justify-center text-[14px] font-bold transition-colors"
									>
										+
									</button>
									<button
										onClick={() => onRemove(item.id)}
										className="focus-ring ml-1 text-[#EF4444] hover:text-[#DC2626] transition-colors"
										aria-label="Hapus item"
									>
										<svg
											width="14"
											height="14"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="2"
										>
											<path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
										</svg>
									</button>
								</div>
							</div>
						))}
					</div>

					<div className="border-t border-[#E8EEF2] pt-4 space-y-2.5">
						<div className="flex justify-between text-[13.5px] text-[#475569]">
							<span>Subtotal</span>
							<span className="font-semibold">
								Rp {subtotal.toLocaleString("id-ID")}
							</span>
						</div>
						<div className="flex items-center justify-between gap-3">
							<span className="text-[13px] text-[#475569]">Diskon</span>
							<div className="flex items-center gap-1">
								<input
									type="number"
									min="0"
									max="100"
									value={discount}
									onChange={(e) => onSetDiscount(Number(e.target.value))}
									className="focus-ring w-16 h-7 px-2 rounded-lg border border-[#E5E7EB] text-[12px] text-right"
								/>
								<span className="text-[12px] text-[#475569]">%</span>
							</div>
						</div>
						{discountAmount > 0 && (
							<div className="flex justify-between text-[13px] text-[#22C55E]">
								<span>- Rp {discountAmount.toLocaleString("id-ID")}</span>
							</div>
						)}
						<div className="flex justify-between text-[13.5px] text-[#475569]">
							<span>Pajak 11%</span>
							<span className="font-semibold">
								Rp {tax.toLocaleString("id-ID")}
							</span>
						</div>
						<div className="flex justify-between text-[15px] font-bold text-[#0F172A] pt-2 border-t border-[#E8EEF2]">
							<span>Total</span>
							<span className="text-[#398EB3]">
								Rp {grandTotal.toLocaleString("id-ID")}
							</span>
						</div>
					</div>

					<div className="mt-4 space-y-3">
						<div>
							<p className="text-[12px] font-medium text-[#374151] mb-1.5">
								Metode Bayar
							</p>
							<div className="grid grid-cols-3 gap-2">
								{PAYMENT_METHODS.map((m) => (
									<button
										key={m.id}
										onClick={() => onSetPayment(m.id)}
										className={`focus-ring py-2 rounded-lg text-[12px] font-semibold border transition-all ${
											paymentMethod === m.id
												? "bg-[#398EB3] text-white border-[#398EB3]"
												: "bg-white text-[#475569] border-[#E5E7EB] hover:border-[#398EB3]"
										}`}
									>
										{m.label}
									</button>
								))}
							</div>
						</div>

						<button
							onClick={onBayar}
							className="focus-ring w-full h-12 rounded-lg bg-[#398EB3] text-white font-semibold text-[15px] hover:bg-[#2F7A9A] hover:-translate-y-0.5 active:scale-[0.98] transition-all"
						>
							Bayar Rp {grandTotal.toLocaleString("id-ID")}
						</button>
					</div>
				</>
			)}
		</div>
	);
}
