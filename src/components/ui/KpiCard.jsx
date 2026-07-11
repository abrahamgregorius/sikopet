/** @format */

export default function KpiCard({
	label,
	value,
	change,
	changeType = "positive",
	icon,
	className = "",
	...props
}) {
	const changeColors = {
		positive: "text-[#22C55E]",
		negative: "text-[#EF4444]",
		neutral: "text-[#F59E0B]",
	};

	return (
		<div
			className={`rounded-lg bg-white border border-[#D8E4EA] p-5 shadow-soft ${className}`}
			{...props}
		>
			{icon && <div className="mb-3">{icon}</div>}
			<p className="text-[12px] text-[#94A3B8] font-medium">{label}</p>
			<p className="font-display font-bold text-[#0F172A] text-[22px] mt-1">
				{value}
			</p>
			{change && (
				<p
					className={`text-[12px] font-semibold mt-1 ${
						changeColors[changeType] || changeColors.positive
					}`}
				>
					{change}
				</p>
			)}
		</div>
	);
}
