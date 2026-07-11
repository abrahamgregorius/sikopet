/** @format */

import { useEffect, useRef, useState } from "react";
import { Card } from "../../../components/ui";
import { useDashboardData } from "../../../hooks/useDashboardData.jsx";

function formatShort(num) {
	if (num >= 1000000000)
		return (num / 1000000000).toFixed(1).replace(".0", "") + " M";
	if (num >= 1000000)
		return (num / 1000000).toFixed(1).replace(".0", "") + " Jt";
	if (num >= 1000) return (num / 1000).toFixed(0) + " Rb";
	return num?.toLocaleString("id-ID") || "0";
}

function StatCounter({
	end,
	decimals = 0,
	suffix = "",
	prefix = "",
	format = "full",
	isLoading,
}) {
	const [count, setCount] = useState(0);
	const ref = useRef(null);

	useEffect(() => {
		if (isLoading) return;
		const el = ref.current;
		if (!el) return;
		const duration = 1200;
		const start = performance.now();
		const tick = (now) => {
			const progress = Math.min((now - start) / duration, 1);
			const eased = 1 - Math.pow(1 - progress, 3);
			setCount(end * eased);
			if (progress < 1) requestAnimationFrame(tick);
		};
		requestAnimationFrame(tick);
	}, [end, isLoading]);

	const displayValue =
		format === "short"
			? formatShort(Math.round(count))
			: decimals
				? count.toFixed(decimals)
				: Math.round(count).toLocaleString("id-ID");

	return (
		<p
			ref={ref}
			className={`font-display font-extrabold text-[24px] mt-3 ${
				isLoading ? "skel text-transparent h-[28px]" : "text-[#0F172A]"
			}`}
		>
			{!isLoading && `${prefix}${displayValue}${suffix}`}
		</p>
	);
}

const icons = {
	members: (
		<>
			<path
				d="M17 20v-1a4 4 0 00-4-4H7a4 4 0 00-4 4v1M10 11a4 4 0 100-8 4 4 0 000 8z"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</>
	),
	loan: (
		<>
			<path
				d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</>
	),
	tx: (
		<>
			<rect x="3" y="7" width="18" height="13" rx="2" />
			<path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" strokeLinecap="round" />
		</>
	),
	revenue: (
		<>
			<path
				d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</>
	),
	sync: (
		<>
			<path
				d="M4 12a8 8 0 0114-5.3M20 12a8 8 0 01-14 5.3M4 4v5h5M20 20v-5h-5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</>
	),
};

const STAT_CONFIGS = [
	{
		key: "totalRevenue",
		prefix: "Rp ",
		format: "short",
		label: "Total Pendapatan",
		icon: "revenue",
	},
	{ key: "totalMembers", label: "Total Anggota", icon: "members" },
	{ key: "todayTransactions", label: "Transaksi Hari Ini", icon: "tx" },
	{ key: "pendingSync", suffix: " item", label: "Menunggu Sync", icon: "sync" },
];

export default function StatsGrid({ refreshTrigger, onRefresh }) {
	const { stats, loading, refresh } = useDashboardData();

	useEffect(() => {
		if (refreshTrigger > 0) refresh();
	}, [refreshTrigger]);

	const statsList = STAT_CONFIGS.map((cfg) => ({
		...cfg,
		end:
			cfg.key === "totalRevenue" || cfg.key === "totalMembers"
				? stats[cfg.key] || 0
				: stats[cfg.key] || 0,
	}));

	return (
		<section aria-label="Statistik ringkasan" className="reveal in">
			<div className="flex items-center justify-between mb-4">
				<h2 className="font-display font-bold text-[#0F172A] text-[17px]">
					Ringkasan Kinerja
				</h2>
				<button
					onClick={onRefresh}
					data-tip="Muat ulang"
					className="focus-ring p-2 rounded-lg hover:bg-[#F1F5F9] text-[#94A3B8] hover:text-[#0F172A] transition-colors"
					aria-label="Muat ulang statistik"
				>
					<svg
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
					>
						<path
							d="M4 12a8 8 0 0114-5.3M20 12a8 8 0 01-14 5.3M4 4v5h5M20 20v-5h-5"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
				</button>
			</div>
			<div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
				{statsList.map((stat) => (
					<Card
						key={stat.key}
						variant="standard"
						className="!p-5 transition-shadow duration-300"
					>
						<div className="flex items-start justify-between">
							<span className="w-10 h-10 rounded-lg bg-[#EAF6FB] grid place-items-center">
								<svg
									width="17"
									height="17"
									viewBox="0 0 24 24"
									fill="none"
									stroke="#398eb3"
									strokeWidth="1.8"
								>
									{icons[stat.icon]}
								</svg>
							</span>
						</div>
						<StatCounter
							end={stat.end}
							decimals={stat.decimals}
							prefix={stat.prefix || ""}
							suffix={stat.suffix || ""}
							format={stat.format || "full"}
							isLoading={loading}
						/>
						<p className="text-[13px] text-[#94A3B8] mt-1">{stat.label}</p>
					</Card>
				))}
			</div>
		</section>
	);
}
