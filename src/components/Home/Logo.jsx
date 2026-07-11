/** @format */

import logoSrc from "@/assets/logo/sikopet-logo.png";
import logoSrc2 from "@/assets/logo/sikopet-sm-logo.png";

const sizes = {
	sm: { img: "w-auto h-12", text: "text-[19px]" },
	md: { img: "w-auto h-14", text: "text-[20px]" },
};

export default function Logo({
	size = "sm",
	name = "KOPET",
	href = "#hero-heading",
	className = "",
	collapsed = false,
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
			<img
				src={collapsed ? logoSrc2 : logoSrc}
				alt=""
				className={`relative ${s.img}`}
			/>
		</a>
	);
}
