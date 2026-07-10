/** @format */

import { useEffect, useRef, useState } from "react";
import { Badge, Card } from "../../../components/ui";

const formatShort = (num) => {
	if (num >= 1000000000) return (num / 1000000000).toFixed(1).replace(".0", "") + " M";
	if (num >= 1000000) return (num / 1000000).toFixed(1).replace(".0", "") + " Jt";
	if (num >= 1000) return (num / 1000).toFixed(0) + " Rb";
	return num.toLocaleString("id-ID");
};

function StatCounter({ end, decimals = 0, suffix = "", prefix = "", format = "full", refreshTrigger }) {
	const [count, setCount] = useState(0);
	const [isSkel, setIsSkel] = useState(false);
	const ref = useRef(null);

	useEffect(() => {
		const el = ref.current;
		if (!el) return;

		const animate = () => {
			setIsSkel(false);
			const duration = 1200;
			const start = performance.now();
			const tick = (now) => {
				const progress = Math.min((now - start) / duration, 1);
				const eased = 1 - Math.pow(1 - progress, 3);
				setCount(end * eased);
				if (progress < 1) requestAnimationFrame(tick);
			};
			requestAnimationFrame(tick);
		};

		if (refreshTrigger) {
			setIsSkel(true);
			setTimeout(animate, 750);
			return;
		}

		const io = new IntersectionObserver(
			(entries) => { if (entries[0].isIntersecting) { animate(); io.unobserve(el); } },
			{ threshold: 0.3 }
		);
		io.observe(el);
		return () => io.disconnect();
	}, [end, refreshTrigger]);

	const displayValue = format === "short"
		? formatShort(Math.round(count))
		: decimals ? count.toFixed(decimals) : Math.round(count).toLocaleString("id-ID");

	return (
		<p ref={ref} className={`font-display font-extrabold text-[24px] mt-3 ${isSkel ? "skel text-transparent h-[28px]" : "text-[#0F172A]"}`}>
			{!isSkel && `${prefix}${displayValue}${suffix}`}
		</p>
	);
}

const stats = [
	{ end: 428500000, prefix: "Rp ", format: "short", label: "Pendapatan Bulan Ini", change: "+12.4%", changeType: "positive", icon: "dollar" },
	{ end: 2318, label: "Anggota Aktif", change: "+3.1%", changeType: "positive", icon: "users" },
	{ end: 1042, label: "Transaksi Hari Ini", change: "-1.8%", changeType: "negative", icon: "briefcase" },
	{ end: 99.8, decimals: 1, suffix: "%", label: "Sinkronisasi Berhasil", icon: "sync" },
];

const icons = {
	dollar: <><path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" strokeLinecap="round" strokeLinejoin="round" /></>,
	users: <><path d="M17 20v-1a4 4 0 00-4-4H7a4 4 0 00-4 4v1M10 11a4 4 0 100-8 4 4 0 000 8z" strokeLinecap="round" strokeLinejoin="round" /></>,
	briefcase: <><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" strokeLinecap="round" /></>,
	sync: <><path d="M4 12a8 8 0 0114-5.3M20 12a8 8 0 01-14 5.3M4 4v5h5M20 20v-5h-5" strokeLinecap="round" strokeLinejoin="round" /></>,
};

export default function StatsGrid({ refreshTrigger, onRefresh }) {
	return (
		<section aria-label="Statistik ringkasan" className="reveal in">
			<div className="flex items-center justify-between mb-4">
				<h2 className="font-display font-bold text-[#0F172A] text-[17px]">Ringkasan Kinerja</h2>
				<button onClick={onRefresh} data-tip="Muat ulang" className="focus-ring p-2 rounded-full hover:bg-[#F1F5F9] text-[#94A3B8] hover:text-[#0F172A] transition-colors" aria-label="Muat ulang statistik">
					<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 12a8 8 0 0114-5.3M20 12a8 8 0 01-14 5.3M4 4v5h5M20 20v-5h-5" strokeLinecap="round" strokeLinejoin="round" /></svg>
				</button>
			</div>
			<div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
				{stats.map((stat) => (
					<Card key={stat.label} variant="standard" className="!p-5 hover:shadow-soft transition-shadow duration-300">
						<div className="flex items-start justify-between">
							<span className="w-10 h-10 rounded-xl bg-[#EAF6FB] grid place-items-center"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#398eb3" strokeWidth="1.8">{icons[stat.icon]}</svg></span>
							{stat.change && (
								<Badge variant={stat.changeType === "positive" ? "success" : "danger"} className="!text-[11.5px] !px-2 !py-1">
									<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
										{stat.changeType === "positive"
											? <path d="M5 12l5-5 4 4 5-5" strokeLinecap="round" strokeLinejoin="round" />
											: <path d="M5 12l5 5 4-4 5 5" strokeLinecap="round" strokeLinejoin="round" />}
									</svg>
									{stat.change}
								</Badge>
							)}
						</div>
						<StatCounter end={stat.end} decimals={stat.decimals} prefix={stat.prefix} suffix={stat.suffix} format={stat.format} refreshTrigger={refreshTrigger} />
						<p className="text-[13px] text-[#94A3B8] mt-1">{stat.label}</p>
					</Card>
				))}
			</div>
		</section>
	);
}
