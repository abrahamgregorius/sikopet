/** @format */

const variants = {
	primary:
		"px-6 py-3.5 rounded-full bg-[#398EB3] text-white font-semibold text-[15px] shadow-glow hover:bg-[#2F7698] hover:-translate-y-0.5 transition-all duration-300",
	secondary:
		"px-6 py-3.5 rounded-full border border-[#D8E4EA] bg-white/70 text-[#0F172A] font-semibold text-[15px] hover:bg-white hover:shadow-soft transition-all duration-300",
	ghost:
		"px-4 py-2.5 text-[14.5px] font-semibold text-[#475569] hover:text-[#0F172A] transition-colors",
	dark: "px-5 py-2.5 rounded-full bg-[#0F172A] text-white text-[14.5px] font-semibold shadow-soft hover:shadow-lift hover:-translate-y-0.5 transition-all duration-300",
	form: "w-full h-[48px] rounded-[12px] bg-[#398EB3] text-white font-semibold text-[15px] shadow-glow hover:bg-[#2F7A9A] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200",
	danger:
		"px-6 py-3.5 rounded-full bg-[#EF4444] text-white font-semibold text-[15px] hover:bg-[#DC2626] hover:-translate-y-0.5 transition-all duration-300",
};

const sizes = {
	sm: "px-4 py-2 text-[13.5px]",
	md: "px-6 py-3.5 text-[15px]",
	lg: "px-7 py-3.5 text-[15px]",
};

export default function Button({
	variant = "primary",
	size = "md",
	className = "",
	children,
	...props
}) {
	return (
		<button
			className={`focus-ring inline-flex items-center justify-center gap-2 ${variants[variant] || variants.primary} ${className}`}
			{...props}
		>
			{children}
		</button>
	);
}
