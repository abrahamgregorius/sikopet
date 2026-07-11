/** @format */

export default function EmptyState({
	icon,
	title = "Belum ada data",
	description,
	action,
	className = "",
	...props
}) {
	return (
		<div
			className={`flex flex-col items-center justify-center text-center py-16 px-6 ${className}`}
			{...props}
		>
			{icon && (
				<div className="w-14 h-14 rounded-lg bg-[#F1F5F9] grid place-items-center text-[#94A3B8] mb-5">
					{icon}
				</div>
			)}
			<h3 className="font-display font-bold text-[16px] text-[#0F172A] mb-2">
				{title}
			</h3>
			{description && (
				<p className="text-[13.5px] text-[#94A3B8] max-w-[320px] leading-relaxed">
					{description}
				</p>
			)}
			{action && <div className="mt-6">{action}</div>}
		</div>
	);
}
