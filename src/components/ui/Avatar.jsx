/** @format */

const sizes = {
	sm: "w-8 h-8 text-[11px]",
	md: "w-9 h-9 text-[12px]",
	lg: "w-10 h-10 text-[13px]",
	xl: "w-14 h-14 text-[16px]",
};

export function Avatar({
	size = "md",
	color,
	initials,
	src,
	className = "",
	...props
}) {
	if (src) {
		return (
			<img
				src={src}
				alt=""
				className={`${sizes[size]} rounded-lg object-cover border-2 border-white ${className}`}
				{...props}
			/>
		);
	}

	return (
		<span
			className={`${sizes[size]} rounded-lg ${
				color || "bg-[#67B2D4]"
			} border-2 border-white grid place-items-center text-white font-bold ${className}`}
			{...props}
		>
			{initials}
		</span>
	);
}

export function AvatarGroup({ avatars = [], max = 4, className = "" }) {
	const visible = avatars.slice(0, max);
	const remaining = avatars.length - max;

	return (
		<div className={`flex -space-x-3 ${className}`}>
			{visible.map((avatar, i) => (
				<Avatar key={i} size="md" {...avatar} />
			))}
			{remaining > 0 && (
				<span className="w-9 h-9 rounded-lg bg-[#0F172A] border-2 border-white grid place-items-center text-[10px] text-white font-bold">
					{remaining}+
				</span>
			)}
		</div>
	);
}
