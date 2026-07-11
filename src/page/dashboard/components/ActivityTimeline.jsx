/** @format */

import { useDashboardData } from "../../../hooks/useDashboardData.jsx";

export default function ActivityTimeline() {
	const { activityLogs, loading } = useDashboardData();

	if (loading) {
		return (
			<div className="rounded-lg bg-white border border-[#E5E7EB] p-6">
				<h3 className="font-display font-bold text-[#0F172A] text-[16px] mb-5">
					Aktivitas Terbaru
				</h3>
				<div className="space-y-6">
					{[1, 2, 3, 4].map((i) => (
						<div key={i} className="flex gap-3">
							<div className="w-3 h-3 rounded-lg skel mt-1.5 shrink-0"></div>
							<div className="flex-1 space-y-1.5">
								<div className="h-3 w-4/5 skel rounded"></div>
								<div className="h-2.5 w-20 skel rounded"></div>
							</div>
						</div>
					))}
				</div>
			</div>
		);
	}

	if (activityLogs.length === 0) {
		return (
			<div className="rounded-lg bg-white border border-[#E5E7EB] p-6">
				<h3 className="font-display font-bold text-[#0F172A] text-[16px] mb-5">
					Aktivitas Terbaru
				</h3>
				<p className="text-[13.5px] text-[#94A3B8]">
					Belum ada aktivitas tercatat.
				</p>
			</div>
		);
	}

	return (
		<div className="rounded-lg bg-white border border-[#E5E7EB] p-6">
			<h3 className="font-display font-bold text-[#0F172A] text-[16px] mb-5">
				Aktivitas Terbaru
			</h3>
			<ol className="relative border-l border-[#E5E7EB] ml-2 space-y-6">
				{activityLogs.map((act) => (
					<li key={act.id} className="pl-5 relative">
						<span
							className={`absolute -left-[7px] top-0.5 w-3 h-3 rounded-lg ${act.color} border-2 border-white ring-1 ${act.ring}`}
						></span>
						<p className="text-[13.5px] text-[#0F172A]">{act.text}</p>
						<p className="text-[12px] text-[#94A3B8] mt-0.5">{act.time}</p>
					</li>
				))}
			</ol>
		</div>
	);
}
