/** @format */

const variants = {
	text: "h-4 rounded-lg",
	heading: "h-7 rounded-lg",
	avatar: "rounded-lg",
	rect: "rounded-lg",
	circle: "rounded-lg",
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
