/** @format */

const sizes = {
	sm: "w-8 h-8 rounded-full",
	md: "w-10 h-10 rounded-xl",
	lg: "w-12 h-12 rounded-2xl",
};

const backgrounds = {
	primary: "bg-[#EAF6FB]",
	teal: "bg-[#4CC9B0]/15",
	blue: "bg-[#EAF6FB]",
};

export default function IconContainer({
	size = "md",
	bg = "primary",
	className = "",
	children,
	...props
}) {
	return (
		<span
			className={`${sizes[size]} ${backgrounds[bg] || backgrounds.primary} grid place-items-center ${className}`}
			{...props}
		>
			{children}
		</span>
	);
}
