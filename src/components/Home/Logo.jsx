/** @format */

const sizes = {
	sm: { box: "w-9 h-9", svg: 16, text: "text-[19px]" },
	md: { box: "w-10 h-10", svg: 18, text: "text-[20px]" },
};

export default function Logo({
	size = "sm",
	name = "KOPET",
	href = "#hero-heading",
	className = "",
	...props
}) {
	const s = sizes[size] || sizes.sm;

	return (
		<a
			href={href}
			className={`flex items-center gap-2.5 focus-ring ${className}`}
			aria-label={`${name} — Beranda`}
			{...props}
		>
			<span
				className={`relative ${s.box} rounded-lg bg-gradient-to-br from-[#398eb3] to-[#4CC9B0] grid place-items-center shadow-soft`}
			>
				<svg
					width={s.svg}
					height={s.svg}
					viewBox="0 0 24 24"
					fill="none"
					aria-hidden="true"
				>
					<circle cx="5" cy="12" r="2.2" fill="white" />
					<circle cx="12" cy="6" r="2.2" fill="white" fillOpacity="0.85" />
					<circle cx="19" cy="12" r="2.2" fill="white" />
					<circle cx="12" cy="18" r="2.2" fill="white" fillOpacity="0.85" />
					<path
						d="M5 12L12 6M12 6L19 12M19 12L12 18M12 18L5 12"
						stroke="white"
						strokeWidth="1.3"
						strokeOpacity="0.6"
					/>
				</svg>
			</span>
			<span
				className={`font-display font-extrabold ${s.text} tracking-tight text-[#0F172A]`}
			>
				{name}
			</span>
		</a>
	);
}
