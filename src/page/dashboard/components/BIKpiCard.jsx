/** @format */

import { Card } from "../../../components/ui";

export default function BIKpiCard({ label, value, prefix = "", suffix = "", icon, variant = "light", loading }) {
	const isDark = variant === "dark";

	return (
		<Card variant={isDark ? "dark" : "standard"} className="!p-5">
			<div className="flex items-start justify-between">
				{icon && (
					<span className={`w-10 h-10 rounded-lg grid place-items-center ${isDark ? "bg-white/10" : "bg-[#EAF6FB]"}`}>
						{icon}
					</span>
				)}
				<div className="flex-1 min-w-0">
					<p className={`text-[12px] font-medium ${isDark ? "text-white/60" : "text-[#94A3B8]"}`}>
						{label}
					</p>
					{loading ? (
						<div className="skel h-[28px] w-24 mt-1 rounded" />
					) : (
						<p className={`font-display font-bold mt-1 ${isDark ? "text-white text-[22px]" : "text-[#0F172A] text-[22px]"}`}>
							{prefix}{typeof value === "number" ? value.toLocaleString("id-ID") : value}{suffix}
						</p>
					)}
				</div>
			</div>
		</Card>
	);
}
