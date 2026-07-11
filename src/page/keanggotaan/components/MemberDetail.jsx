/** @format */

export default function MemberDetail({ member, onClose, onEdit }) {
	if (!member) return null;

	const formatCurrency = (n) => `Rp ${(n ?? 0).toLocaleString("id-ID")}`;

	return (
		<div className="rounded-lg bg-white border border-[#D8E4EA] shadow-soft overflow-hidden">
			<div className="p-5 border-b border-[#E8EEF2] flex items-center justify-between">
				<h3 className="font-display font-bold text-[16px] text-[#0F172A]">
					Detail Anggota
				</h3>
				<button
					onClick={onClose}
					className="focus-ring p-1.5 rounded-lg text-[#94A3B8] hover:bg-[#F1F5F9] transition-colors"
					aria-label="Tutup"
				>
					<svg
						width="18"
						height="18"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
					>
						<path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
					</svg>
				</button>
			</div>

			<div className="p-5 space-y-5">
				<div className="flex items-center gap-4">
					<span className="w-14 h-14 rounded-lg bg-[#EAF6FB] grid place-items-center text-[#398EB3] font-bold text-[20px]">
						{member.name.charAt(0)}
					</span>
					<div>
						<p className="font-display font-bold text-[18px] text-[#0F172A]">
							{member.name}
						</p>
						<span
							className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-lg mt-1 ${
								member.status === "active"
									? "text-[#22C55E] bg-[#22C55E]/10"
									: member.status === "pending"
										? "text-[#F59E0B] bg-[#F59E0B]/10"
										: "text-[#94A3B8] bg-[#F1F5F9]"
							}`}
						>
							<span
								className={`w-1.5 h-1.5 rounded-lg ${member.status === "active" ? "bg-[#22C55E]" : member.status === "pending" ? "bg-[#F59E0B]" : "bg-[#94A3B8]"}`}
							></span>
							{member.status === "active"
								? "Aktif"
								: member.status === "pending"
									? "Menunggu"
									: "Tidak Aktif"}
						</span>
					</div>
				</div>

				<div className="grid grid-cols-2 gap-4">
					<div className="rounded-lg bg-[#F1F5F9] p-4">
						<p className="text-[11px] text-[#94A3B8] font-medium">Simpanan</p>
						<p className="font-display font-bold text-[16px] text-[#0F172A] mt-0.5">
							{formatCurrency(member.savings)}
						</p>
					</div>
					<div className="rounded-lg bg-[#F1F5F9] p-4">
						<p className="text-[11px] text-[#94A3B8] font-medium">Pinjaman</p>
						<p className="font-display font-bold text-[16px] text-[#0F172A] mt-0.5">
							{formatCurrency(member.loans)}
						</p>
					</div>
				</div>

				<div className="space-y-3">
					<h4 className="text-[12px] font-bold text-[#94A3B8] uppercase tracking-wider">
						Informasi Pribadi
					</h4>
					<div className="space-y-2.5">
						{[
							{ label: "NIK", value: member.nik },
							{
								label: "Tempat & Tgl Lahir",
								value: `${member.address.split(",")[0]}, ${member.bornDate}`,
							},
							{ label: "Alamat", value: member.address },
							{ label: "Telepon", value: member.phone },
							{ label: "Tanggal Bergabung", value: member.joinDate },
						].map((item) => (
							<div
								key={item.label}
								className="flex justify-between text-[13.5px] py-1.5 border-b border-[#E8EEF2] last:border-0"
							>
								<span className="text-[#94A3B8]">{item.label}</span>
								<span className="font-medium text-[#0F172A] text-right">
									{item.value}
								</span>
							</div>
						))}
					</div>
				</div>
			</div>

			<div className="p-4 border-t border-[#E8EEF2] flex gap-3">
				<button
					onClick={onEdit}
					className="focus-ring flex-1 h-10 rounded-lg bg-[#398EB3] text-white font-semibold text-[14px] hover:bg-[#2F7A9A] transition-colors"
				>
					Edit
				</button>
				<button className="focus-ring flex-1 h-10 rounded-lg border border-[#E5E7EB] text-[#475569] font-semibold text-[14px] hover:bg-[#F1F5F9] transition-colors">
					Riwayat
				</button>
			</div>
		</div>
	);
}
