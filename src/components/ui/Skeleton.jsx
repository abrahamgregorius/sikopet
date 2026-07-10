/** @format */

const variants = {
	text: "h-4 rounded-full",
	heading: "h-7 rounded-full",
	avatar: "rounded-full",
	rect: "rounded-2xl",
	circle: "rounded-full",
};

export default function Skeleton({
	variant = "text",
	width,
	height,
	className = "",
	...props
}) {
	const style = {};
	if (width) style.width = width;
	if (height) style.height = height;

	return (
		<div
			aria-hidden="true"
			className={`animate-pulse bg-[#E8EEF2] ${
				variants[variant] || variants.text
			} ${className}`}
			style={style}
			{...props}
		/>
	);
}
