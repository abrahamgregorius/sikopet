/** @format */

export default function Divider({ className = "", ...props }) {
	return (
		<hr
			className={`border-t border-[#E8EEF2] ${className}`}
			{...props}
		/>
	);
}
