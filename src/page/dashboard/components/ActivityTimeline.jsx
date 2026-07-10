/** @format */

const activities = [
	{ text: <><span className="font-semibold">Koperasi Sejahtera Bersama</span> menyelesaikan tutup buku bulanan.</>, time: "12 menit lalu", color: "bg-[#22C55E]", ring: "ring-[#22C55E]" },
	{ text: <><span className="font-semibold">Rina Wulandari</span> menyetujui 3 pengajuan pinjaman baru.</>, time: "48 menit lalu", color: "bg-[#398eb3]", ring: "ring-[#398eb3]" },
	{ text: <><span className="font-semibold">Koperasi Tani Makmur</span> mengalami keterlambatan sinkronisasi.</>, time: "2 jam lalu", color: "bg-[#F59E0B]", ring: "ring-[#F59E0B]" },
	{ text: <><span className="font-semibold">42 anggota baru</span> terdaftar minggu ini di seluruh unit.</>, time: "5 jam lalu", color: "bg-[#4CC9B0]", ring: "ring-[#4CC9B0]" },
];

export default function ActivityTimeline() {
	return (
		<div className="rounded-3xl bg-white border border-[#D8E4EA] p-6">
			<h3 className="font-display font-bold text-[#0F172A] text-[16px] mb-5">Aktivitas Terbaru</h3>
			<ol className="relative border-l border-[#D8E4EA] ml-2 space-y-6">
				{activities.map((act, i) => (
					<li key={i} className="pl-5 relative">
						<span className={`absolute -left-[7px] top-0.5 w-3 h-3 rounded-full ${act.color} border-2 border-white ring-1 ${act.ring}`}></span>
						<p className="text-[13.5px] text-[#0F172A]">{act.text}</p>
						<p className="text-[12px] text-[#94A3B8] mt-0.5">{act.time}</p>
					</li>
				))}
			</ol>
		</div>
	);
}
