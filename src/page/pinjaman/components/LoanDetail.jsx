/** @format */

export default function LoanDetail({ loan, onClose, onApprove }) {
	if (!loan) return null;

	const remaining = loan.principal - loan.paid;
	const progress = (loan.paid / loan.principal) * 100;
	const monthlyPayment = (loan.principal * (1 + (loan.rate / 100))) / loan.tenor;

	return (
		<div className="rounded-2xl bg-white border border-[#D8E4EA] shadow-soft overflow-hidden">
			<div className="p-5 border-b border-[#E8EEF2] flex items-center justify-between">
				<h3 className="font-display font-bold text-[16px] text-[#0F172A]">
					Detail Pinjaman
				</h3>
				<button
					onClick={onClose}
					className="focus-ring p-1.5 rounded-lg text-[#94A3B8] hover:bg-[#F1F5F9] transition-colors"
					aria-label="Tutup"
				>
					<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
						<path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
					</svg>
				</button>
			</div>

			<div className="p-5 space-y-5">
				<div className="flex items-center gap-4">
					<span className="w-14 h-14 rounded-full bg-[#EAF6FB] grid place-items-center text-[#398EB3] font-bold text-[20px]">
						{loan.member.charAt(0)}
					</span>
					<div>
						<p className="font-display font-bold text-[18px] text-[#0F172A]">
							{loan.member}
						</p>
						<span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full mt-1 ${
							loan.status === "active" ? "text-[#22C55E] bg-[#22C55E]/10" :
							loan.status === "pending" ? "text-[#F59E0B] bg-[#F59E0B]/10" :
							"text-[#94A3B8] bg-[#F1F5F9]"
						}`}>
							{loan.status === "active" ? "Aktif" : loan.status === "pending" ? "Menunggu" : "Lunas"}
						</span>
					</div>
				</div>

				<div className="rounded-xl bg-[#F1F5F9] p-4">
					<div className="flex justify-between mb-2">
						<span className="text-[12px] text-[#94A3B8]">Pinjaman</span>
						<span className="text-[13px] font-bold text-[#0F172A]">
							Rp {loan.principal.toLocaleString("id-ID")}
						</span>
					</div>
					<div className="h-2.5 rounded-full bg-[#D8E4EA] overflow-hidden">
						<div
							className="h-full rounded-full bg-gradient-to-r from-[#398eb3] to-[#4CC9B0] transition-all"
							style={{ width: `${progress}%` }}
						></div>
					</div>
					<div className="flex justify-between mt-1.5">
						<span className="text-[11px] text-[#94A3B8]">Terbayar {progress.toFixed(0)}%</span>
						<span className="text-[11px] text-[#94A3B8]">Sisa {remaining.toLocaleString("id-ID")}</span>
					</div>
				</div>

				<div className="grid grid-cols-2 gap-3">
					{[
						{ label: "Bunga", value: `${loan.rate}%` },
						{ label: "Tenor", value: `${loan.tenor} bulan` },
						{ label: "Cicilan/bulan", value: `Rp ${Math.round(monthlyPayment).toLocaleString("id-ID")}` },
						{ label: "Sisa", value: `Rp ${remaining.toLocaleString("id-ID")}` },
					].map((item) => (
						<div key={item.label} className="rounded-xl bg-[#F1F5F9] p-3.5">
							<p className="text-[11px] text-[#94A3B8]">{item.label}</p>
							<p className="text-[14px] font-bold text-[#0F172A] mt-0.5">{item.value}</p>
						</div>
					))}
				</div>

				<div className="space-y-2.5">
					<h4 className="text-[12px] font-bold text-[#94A3B8] uppercase tracking-wider">
						Riwayat Pembayaran
					</h4>
					{loan.status === "active" && loan.paid > 0 ? (
						<div className="rounded-xl bg-[#DCFCE7] p-3.5 text-center">
							<p className="text-[13px] font-semibold text-[#22C55E]">
								Rp {loan.paid.toLocaleString("id-ID")} terbayar
							</p>
							<p className="text-[12px] text-[#22C55E]/70 mt-0.5">
								Berikutnya: Rp {Math.round(monthlyPayment).toLocaleString("id-ID")} per bulan
							</p>
						</div>
					) : loan.status === "pending" ? (
						<div className="rounded-xl bg-[#FEF3C7] p-3.5 text-center">
							<p className="text-[13px] font-semibold text-[#F59E0B]">
								Menunggu persetujuan
							</p>
						</div>
					) : (
						<div className="rounded-xl bg-[#DCFCE7] p-3.5 text-center">
							<p className="text-[13px] font-semibold text-[#22C55E]">
								Pinjaman telah lunas
							</p>
						</div>
					)}
				</div>
			</div>

			<div className="p-4 border-t border-[#E8EEF2] flex gap-3">
				{loan.status === "pending" && (
					<button
						onClick={() => onApprove(loan.id)}
						className="focus-ring flex-1 h-10 rounded-xl bg-[#22C55E] text-white font-semibold text-[14px] hover:bg-[#16A34A] transition-colors"
					>
						Approve
					</button>
				)}
				<button className="focus-ring flex-1 h-10 rounded-xl border border-[#E5E7EB] text-[#475569] font-semibold text-[14px] hover:bg-[#F1F5F9] transition-colors">
					Riwayat
				</button>
			</div>
		</div>
	);
}
