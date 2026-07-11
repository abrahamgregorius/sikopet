/** @format */

const days = ["M", "S", "S", "R", "K", "J", "S"];
const calendarData = [
	{ d: 28, dim: true },
	{ d: 29, dim: true },
	{ d: 30, dim: true },
	{ d: 1 },
	{ d: 2 },
	{ d: 3 },
	{ d: 4 },
	{ d: 5 },
	{ d: 6 },
	{ d: 7, dot: "#4CC9B0" },
	{ d: 8 },
	{ d: 9 },
	{ d: 10 },
	{ d: 11 },
	{ d: 12 },
	{ d: 13 },
	{ d: 14, today: true },
	{ d: 15, dot: "#398eb3" },
	{ d: 16 },
	{ d: 17 },
	{ d: 18 },
	{ d: 19 },
	{ d: 20 },
	{ d: 21 },
	{ d: 22 },
	{ d: 23 },
	{ d: 24 },
	{ d: 25 },
];

const events = [
	{
		title: "Rapat Anggota Tahunan",
		time: "Hari ini, 14:00 WIB",
		color: "bg-[#398eb3]",
	},
	{ title: "Audit Triwulan", time: "15 Jul, 09:00 WIB", color: "bg-[#4CC9B0]" },
];

export default function MiniCalendar() {
	return (
		<div className="lg:col-span-1 rounded-lg bg-white border border-[#E5E7EB] p-6">
			<div className="flex items-center justify-between mb-5">
				<h3 className="font-display font-bold text-[#0F172A] text-[16px]">
					Kalender
				</h3>
				<div className="flex items-center gap-1">
					<button
						className="focus-ring w-7 h-7 rounded-lg hover:bg-[#F1F5F9] text-[#94A3B8] grid place-items-center"
						aria-label="Bulan sebelumnya"
					>
						‹
					</button>
					<span className="text-[12.5px] font-semibold text-[#0F172A] px-1">
						Jul 2026
					</span>
					<button
						className="focus-ring w-7 h-7 rounded-lg hover:bg-[#F1F5F9] text-[#94A3B8] grid place-items-center"
						aria-label="Bulan berikutnya"
					>
						›
					</button>
				</div>
			</div>
			<div className="grid grid-cols-7 gap-1 text-center text-[11px] text-[#94A3B8] font-medium mb-1.5">
				{days.map((d) => (
					<span key={d + Math.random()}>{d}</span>
				))}
			</div>
			<div className="grid grid-cols-7 gap-1 text-center text-[12px]">
				{calendarData.map((cell, i) => (
					<span
						key={i}
						className={`py-2 rounded-lg relative ${cell.dim ? "text-[#94A3B8]/60" : ""} ${cell.today ? "font-bold bg-[#398eb3] text-white" : ""}`}
					>
						{cell.d}
						{cell.dot && (
							<span
								className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-lg"
								style={{ background: cell.dot }}
							></span>
						)}
					</span>
				))}
			</div>
			<div className="mt-4 pt-4 border-t border-[#E8EEF2] space-y-2.5">
				{events.map((ev) => (
					<div key={ev.title} className="flex items-center gap-2.5">
						<span className={`w-1.5 h-8 rounded-lg ${ev.color}`}></span>
						<div>
							<p className="text-[12.5px] font-semibold text-[#0F172A]">
								{ev.title}
							</p>
							<p className="text-[11px] text-[#94A3B8]">{ev.time}</p>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
