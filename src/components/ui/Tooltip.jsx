/** @format */

import { useState } from "react";

export default function Tooltip({
	content,
	children,
	position = "top",
	className = "",
	...props
}) {
	const [visible, setVisible] = useState(false);

	const positions = {
		top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
		bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
		left: "right-full top-1/2 -translate-y-1/2 mr-2",
		right: "left-full top-1/2 -translate-y-1/2 ml-2",
	};

	return (
		<span
			className={`relative inline-flex ${className}`}
			onMouseEnter={() => setVisible(true)}
			onMouseLeave={() => setVisible(false)}
			onFocus={() => setVisible(true)}
			onBlur={() => setVisible(false)}
			{...props}
		>
			{children}
			{visible && content && (
				<span
					role="tooltip"
					className={`absolute z-50 px-3 py-2 rounded-lg bg-[#0F172A] text-white text-[12px] font-medium whitespace-nowrap pointer-events-none animate-in fade-in ${positions[position]}`}
				>
					{content}
				</span>
			)}
		</span>
	);
}
