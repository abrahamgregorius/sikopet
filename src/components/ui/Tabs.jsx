/** @format */

import { useState } from "react";

export default function Tabs({ tabs = [], defaultTab, className = "" }) {
	const [active, setActive] = useState(defaultTab || tabs[0]?.id || "");

	const current = tabs.find((t) => t.id === active);

	return (
		<div className={className}>
			<div className="flex gap-1 p-1 rounded-lg bg-[#F1F5F9] border border-[#E8EEF2] mb-6 overflow-x-auto">
				{tabs.map((tab) => (
					<button
						key={tab.id}
						type="button"
						onClick={() => setActive(tab.id)}
						className={`focus-ring flex items-center gap-2 px-4 py-2.5 rounded-lg text-[14.5px] font-medium whitespace-nowrap transition-all duration-300 ${
							active === tab.id
								? "bg-white text-[#0F172A] shadow-soft"
								: "text-[#64748B] hover:text-[#334155] hover:bg-white/50"
						}`}
					>
						{tab.icon && <span className="w-4 h-4">{tab.icon}</span>}
						{tab.label}
					</button>
				))}
			</div>
			{current?.content}
		</div>
	);
}
