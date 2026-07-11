/** @format */

const variants = {
	standard: "rounded-lg bg-white border-[#E5E7EB] border p-6",
	feature:
		"rounded-lg bg-white border-[#E5E7EB] border p-6 hover:-translate-y-1 transition-all duration-300",
	hero: "rounded-[2.25rem] bg-white border-[#E5E7EB] border p-6 sm:p-8",
	nested: "rounded-lg bg-white border-[#E5E7EB] border p-5",
	section: "rounded-lg bg-[#F1F5F9] border-[#E5E7EB] border p-6 lg:p-8",
	dark: "rounded-lg bg-[#0F172A] px-6 sm:px-10 py-9 sm:py-11",
	glass: "glass-card rounded-lg px-4 py-3.5",
	auth: "rounded-[24px] bg-white border-[#E5E7EB] border p-8 sm:p-10",
};

export default function Card({
	variant = "standard",
	className = "",
	children,
	...props
}) {
	return (
		<div
			className={`${variants[variant] || variants.standard} ${className}`}
			{...props}
		>
			{children}
		</div>
	);
}
