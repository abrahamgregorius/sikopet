/** @format */

export default function ProcurementOverview({
	totalPengajuan,
	totalApproved,
	totalReceived,
	pendingCount,
	approvedCount,
}) {
	return (
		<div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
			<div className="rounded-lg bg-white border border-[#D8E4EA] shadow-soft p-5">
				<p className="text-[12px] text-[#94A3B8] font-medium mb-2">
					Menunggu Persetujuan
				</p>
				<p className="font-display font-extrabold text-[#F59E0B] text-[24px] sm:text-[28px] tracking-tight">
					Rp {(totalPengajuan / 1000000).toFixed(1)}jt
				</p>
				<p className="text-[11px] text-[#94A3B8] mt-1">
					{pendingCount} pengajuan
				</p>
			</div>

			<div className="rounded-lg bg-white border border-[#D8E4EA] shadow-soft p-5">
				<p className="text-[12px] text-[#94A3B8] font-medium mb-2">Disetujui</p>
				<p className="font-display font-extrabold text-[#398EB3] text-[24px] sm:text-[28px] tracking-tight">
					Rp {(totalApproved / 1000000).toFixed(1)}jt
				</p>
				<p className="text-[11px] text-[#94A3B8] mt-1">
					{approvedCount} pengajuan
				</p>
			</div>

			<div className="rounded-lg bg-white border border-[#D8E4EA] shadow-soft p-5">
				<p className="text-[12px] text-[#94A3B8] font-medium mb-2">Diterima</p>
				<p className="font-display font-extrabold text-[#22C55E] text-[24px] sm:text-[28px] tracking-tight">
					Rp {(totalReceived / 1000000).toFixed(1)}jt
				</p>
				<p className="text-[11px] text-[#94A3B8] mt-1">Barang masuk gudang</p>
			</div>

			<div className="rounded-[1.75rem] bg-[#0F172A] px-6 py-7 shadow-lift">
				<p className="text-[12px] text-white/60 font-medium mb-2">
					Total Nilai
				</p>
				<p className="font-display font-extrabold text-white text-[24px] sm:text-[28px] tracking-tight">
					Rp{" "}
					{((totalPengajuan + totalApproved + totalReceived) / 1000000).toFixed(
						1,
					)}
					jt
				</p>
				<p className="text-[11px] text-white/60 mt-1">Semua pengadaan</p>
			</div>
		</div>
	);
}
