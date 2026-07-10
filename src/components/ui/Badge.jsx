/** @format */

const variants = {
	success:
		"inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#22C55E] bg-[#22C55E]/10 px-2.5 py-1 rounded-full",
	warning:
		"inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#F59E0B] bg-[#F59E0B]/10 px-2.5 py-1 rounded-full",
	danger:
		"inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#EF4444] bg-[#EF4444]/10 px-2.5 py-1 rounded-full",
	info: "inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#3B82F6] bg-[#3B82F6]/10 px-2.5 py-1 rounded-full",
	neutral:
		"inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#94A3B8] bg-[#F1F5F9] px-2.5 py-1 rounded-full",
	tag: "text-[11px] font-semibold text-[#2F7698] bg-[#EAF6FB] px-2 py-0.5 rounded-full",
};

const dotColors = {
	success: "bg-[#22C55E]",
	warning: "bg-[#F59E0B]",
	danger: "bg-[#EF4444]",
	info: "bg-[#3B82F6]",
	neutral: "bg-[#94A3B8]",
};

export default function Badge({
	variant = "neutral",
	showDot = false,
	className = "",
	children,
	...props
}) {
	return (
		<span className={`${variants[variant] || variants.neutral} ${className}`} {...props}>
			{showDot && dotColors[variant] && (
				<span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />
			)}
			{children}
		</span>
	);
}
