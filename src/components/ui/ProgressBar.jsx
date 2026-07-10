/** @format */

export default function ProgressBar({
	value = 0,
	label,
	className = "",
}) {
	const clamped = Math.min(100, Math.max(0, value));

	return (
		<div className={`w-full ${className}`}>
			{label && (
				<p className="font-display font-bold text-[#0F172A] text-[14.5px] mb-3">
					{label}
				</p>
			)}
			<div className="w-full h-2.5 rounded-full bg-[#D8E4EA] overflow-hidden">
				<div
					className="h-full rounded-full bg-gradient-to-r from-[#398EB3] to-[#4CC9B0] transition-all duration-500"
					style={{ width: `${clamped}%` }}
				/>
			</div>
			{(label || value > 0) && (
				<div className="flex justify-between text-[12px] text-[#94A3B8] font-medium mt-2">
					{label && <span>{label}</span>}
					<span>{clamped.toFixed(0)}%</span>
				</div>
			)}
		</div>
	);
}
