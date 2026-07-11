/** @format */

export default function MemberStats({ members }) {
	const total = members.length;
	const active = members.filter((m) => m.status === "active").length;
	const pending = members.filter((m) => m.status === "pending").length;
	const inactive = members.filter((m) => m.status === "inactive").length;

	const cards = [
		{
			label: "Total Anggota",
			value: total,
			icon: (
				<svg
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					stroke="#398EB3"
					strokeWidth="1.8"
				>
					<path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8zM9 7a6 6 0 016 0M1 1h4" />
				</svg>
			),
			bg: "bg-[#EAF6FB]",
		},
		{
			label: "Anggota Aktif",
			value: active,
			change: "+12 bulan ini",
			icon: (
				<svg
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					stroke="#22C55E"
					strokeWidth="1.8"
				>
					<path d="M22 11.08V12a10 10 0 11-5.93-9.14M22 4L12 14.01l-3-3" />
				</svg>
			),
			bg: "bg-[#DCFCE7]",
			valueColor: "text-[#22C55E]",
		},
		{
			label: "Menunggu Persetujuan",
			value: pending,
			icon: (
				<svg
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					stroke="#F59E0B"
					strokeWidth="1.8"
				>
					<circle cx="12" cy="12" r="10" />
					<path d="M12 6v6l4 2" />
				</svg>
			),
			bg: "bg-[#FEF3C7]",
			valueColor: "text-[#F59E0B]",
		},
		{
			label: "Tidak Aktif",
			value: inactive,
			icon: (
				<svg
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					stroke="#94A3B8"
					strokeWidth="1.8"
				>
					<path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" />
				</svg>
			),
			bg: "bg-[#F1F5F9]",
		},
	];

	return (
		<div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
			{cards.map((card) => (
				<div
					key={card.label}
					className="rounded-lg bg-white border border-[#E5E7EB] p-5"
				>
					<div className="flex items-center justify-between mb-3">
						<span
							className={`w-10 h-10 ${card.bg} rounded-lg grid place-items-center`}
						>
							{card.icon}
						</span>
					</div>
					<p
						className={`font-display font-extrabold text-[28px] tracking-tight ${card.valueColor || "text-[#0F172A]"}`}
					>
						{card.value}
					</p>
					<p className="text-[13px] text-[#475569] mt-0.5">{card.label}</p>
					{card.change && (
						<p className="text-[11px] text-[#22C55E] font-semibold mt-1">
							{card.change}
						</p>
					)}
				</div>
			))}
		</div>
	);
}
