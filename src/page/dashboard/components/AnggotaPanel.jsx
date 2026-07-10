/** @format */

import { Card } from "../../../components/ui";

const membersData = [
	{ region: "Jawa Tengah", count: "612 anggota", pct: 88, color: "bg-[#398eb3]" },
	{ region: "Sulawesi Selatan", count: "438 anggota", pct: 63, color: "bg-[#4CC9B0]" },
	{ region: "Bali", count: "305 anggota", pct: 44, color: "bg-[#67B2D4]" },
];

export default function AnggotaPanel() {
	return (
		<section id="anggota-panel" className="reveal in rounded-3xl bg-gradient-to-br from-[#EAF6FB] to-white border border-[#D8E4EA] p-6 sm:p-7">
			<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
				<div>
					<h3 className="font-display font-bold text-[#0F172A] text-[17px]">Distribusi Anggota per Provinsi</h3>
					<p className="text-[13px] text-[#475569] mt-1">Ringkasan jangkauan cooperativa yang terhubung dengan SIKOPET</p>
				</div>
				<div className="flex items-center gap-1.5 text-[12px] font-semibold text-[#2F7698] bg-white px-3 py-1.5 rounded-full border border-[#67B2D4]/40">
					<span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]"></span> Data langsung
				</div>
			</div>
			<div className="grid sm:grid-cols-3 gap-4 mt-6">
				{membersData.map((item) => (
					<div key={item.region} className="rounded-2xl bg-white/70 border border-white p-4">
						<p className="text-[12px] text-[#94A3B8] font-medium">{item.region}</p>
						<p className="font-display font-bold text-[#0F172A] text-[19px] mt-1">{item.count}</p>
						<div className="h-1.5 rounded-full bg-[#F1F5F9] mt-2 overflow-hidden">
							<div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.pct}%` }}></div>
						</div>
					</div>
				))}
			</div>
		</section>
	);
}
