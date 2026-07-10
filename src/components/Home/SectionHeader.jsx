/** @format */

export default function SectionHeader({
	eyebrow,
	title,
	description,
	centered = true,
	className = "",
}) {
	return (
		<div
			className={`${centered ? "max-w-[620px] mx-auto text-center" : ""} mb-14 lg:mb-20 ${className}`}
		>
			{eyebrow && (
				<span className="text-[13px] font-bold text-[#2F7698] uppercase tracking-wider">
					{eyebrow}
				</span>
			)}
			<h2 className="font-display font-extrabold text-[30px] sm:text-[38px] text-[#0F172A] tracking-tight mt-3 leading-tight">
				{title}
			</h2>
			{description && (
				<p className="text-[#475569] text-[16px] leading-relaxed mt-4">
					{description}
				</p>
			)}
		</div>
	);
}
