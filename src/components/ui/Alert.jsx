/** @format */

const variants = {
	info: "bg-[#DBEAFE] border-[#BFDBFE] text-[#1E40AF]",
	success:
		"bg-[#DCFCE7] border-[#BBF7D0] text-[#166534]",
	warning:
		"bg-[#FEF3C7] border-[#FDE68A] text-[#92400E]",
	danger:
		"bg-[#FEE2E2] border-[#FECACA] text-[#991B1B]",
};

const icons = {
	info: (
		<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
			<circle cx="12" cy="12" r="10" />
			<path d="M12 16v-4M12 8h.01" />
		</svg>
	),
	success: (
		<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
			<path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
			<polyline points="22 4 12 14.01 9 11.01" />
		</svg>
	),
	warning: (
		<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
			<path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
			<line x1="12" y1="9" x2="12" y2="13" />
			<line x1="12" y1="17" x2="12.01" y2="17" />
		</svg>
	),
	danger: (
		<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
			<circle cx="12" cy="12" r="10" />
			<line x1="15" y1="9" x2="9" y2="15" />
			<line x1="9" y1="9" x2="15" y2="15" />
		</svg>
	),
};

export default function Alert({
	variant = "info",
	title,
	children,
	className = "",
	...props
}) {
	return (
		<div
			role="alert"
			className={`flex items-start gap-3 px-5 py-4 rounded-2xl border text-[14.5px] ${
				variants[variant] || variants.info
			} ${className}`}
			{...props}
		>
			<span className="shrink-0 mt-0.5">{icons[variant]}</span>
			<div>
				{title && (
					<p className="font-semibold mb-0.5">{title}</p>
				)}
				<div>{children}</div>
			</div>
		</div>
	);
}
