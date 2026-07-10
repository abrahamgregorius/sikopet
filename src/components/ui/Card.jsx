/** @format */

const variants = {
	standard:
		"rounded-2xl bg-white border border-[#D8E4EA] p-6 shadow-soft",
	feature:
		"rounded-2xl bg-white border border-[#D8E4EA] p-6 hover:shadow-lift hover:-translate-y-1 transition-all duration-300",
	hero: "rounded-[2.25rem] bg-white shadow-lift border border-[#D8E4EA] p-6 sm:p-8",
	nested: "rounded-2xl bg-white border border-[#D8E4EA] shadow-soft p-5",
	section:
		"rounded-[1.75rem] bg-[#F1F5F9] border border-[#D8E4EA] p-6 lg:p-8",
	dark: "rounded-[1.75rem] bg-[#0F172A] px-6 sm:px-10 py-9 sm:py-11 shadow-lift",
	glass: "glass-card rounded-2xl shadow-lift px-4 py-3.5",
	auth: "rounded-[24px] bg-white border border-[#D8E4EA] shadow-lift p-8 sm:p-10",
};

export default function Card({
	variant = "standard",
	className = "",
	children,
	...props
}) {
	return (
		<div className={`${variants[variant] || variants.standard} ${className}`} {...props}>
			{children}
		</div>
	);
}
