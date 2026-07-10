/** @format */

import { Avatar, AvatarGroup, Badge } from "../../../components/ui";

const members = [
	{ name: "Rina Wulandari", role: "Ketua Koperasi", initials: "AS", color: "bg-gradient-to-br from-[#398eb3] to-[#2F7698]", online: true },
	{ name: "Bambang Sutrisno", role: "Bendahara", initials: "BS", color: "bg-gradient-to-br from-[#4CC9B0] to-[#398eb3]", online: false },
	{ name: "Made Ayu Kartika", role: "Auditor Internal", initials: "MA", color: "bg-gradient-to-br from-[#67B2D4] to-[#398eb3]", online: true },
	{ name: "Hendra Pratama", role: "Petugas Gudang", initials: "HP", color: "bg-gradient-to-br from-[#F59E0B] to-[#2F7698]", online: false, busy: true },
];

export default function TeamList() {
	return (
		<div id="tim-panel" className="rounded-3xl bg-white border border-[#D8E4EA] p-6">
			<div className="flex items-center justify-between mb-5">
				<h3 className="font-display font-bold text-[#0F172A] text-[16px]">Anggota Tim</h3>
				<AvatarGroup
					avatars={members.map(m => ({ color: m.color, initials: m.initials.slice(0, 1) }))}
					max={3}
				/>
			</div>
			<ul className="space-y-4">
				{members.map((m) => (
					<li key={m.name} className="flex items-center gap-3">
						<span className="relative shrink-0">
							<Avatar size="md" color={m.color} initials={m.initials} />
							<span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white ${m.online ? "bg-[#22C55E]" : m.busy ? "bg-[#F59E0B]" : "bg-[#94A3B8]"}`}></span>
						</span>
						<div className="flex-1 min-w-0">
							<p className="text-[13.5px] font-semibold text-[#0F172A] truncate">{m.name}</p>
							<p className="text-[12px] text-[#94A3B8]">{m.role}</p>
						</div>
						<Badge variant={m.online ? "success" : m.busy ? "warning" : "neutral"} className="!text-[10.5px] !px-2 !py-0.5">
							{m.online ? "Online" : m.busy ? "Sibuk" : "Offline"}
						</Badge>
					</li>
				))}
			</ul>
		</div>
	);
}
