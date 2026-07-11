/** @format */

import { useState, useEffect } from "react";
import { Card } from "../../../components/ui";
import { db } from "../../../database/db";

export default function AnggotaPanel() {
	const [stats, setStats] = useState({ total: 0, active: 0, newThisMonth: 0 });
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function load() {
			try {
				const members = await db.members.toArray();
				const now = new Date();
				const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
				const newThisMonth = members.filter(
					(m) => m.createdAt && new Date(m.createdAt) >= monthStart,
				).length;
				const active = members.filter((m) => m.status !== "inactive").length;
				setStats({
					total: members.length,
					active,
					newThisMonth,
				});
			} catch (e) {
				console.warn("[AnggotaPanel]", e.message);
			} finally {
				setLoading(false);
			}
		}
		load();
	}, []);

	return (
		<section
			id="anggota-panel"
			className="reveal in rounded-lg bg-gradient-to-br from-[#EAF6FB] to-white border border-[#D8E4EA] p-6 sm:p-7"
		>
			<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
				<div>
					<h3 className="font-display font-bold text-[#0F172A] text-[17px]">
						Data Anggota
					</h3>
					<p className="text-[13px] text-[#475569] mt-1">
						Statistik anggota cooperative
					</p>
				</div>
				<div className="flex items-center gap-1.5 text-[12px] font-semibold text-[#2F7698] bg-white px-3 py-1.5 rounded-lg border border-[#67B2D4]/40">
					<span className="w-1.5 h-1.5 rounded-lg bg-[#22C55E]"></span>
					{loading ? "Memuat..." : "Data langsung"}
				</div>
			</div>

			<div className="grid sm:grid-cols-3 gap-4 mt-6">
				<div className="rounded-lg bg-white/70 border border-white p-4">
					<p className="text-[12px] text-[#94A3B8] font-medium">
						Total Anggota
					</p>
					<p className="font-display font-bold text-[#0F172A] text-[19px] mt-1">
						{loading ? "—" : stats.total.toLocaleString("id-ID")}
					</p>
					<p className="text-[11px] text-[#22C55E] mt-1">Terdaftar</p>
				</div>
				<div className="rounded-lg bg-white/70 border border-white p-4">
					<p className="text-[12px] text-[#94A3B8] font-medium">
						Anggota Aktif
					</p>
					<p className="font-display font-bold text-[#0F172A] text-[19px] mt-1">
						{loading ? "—" : stats.active.toLocaleString("id-ID")}
					</p>
					<p className="text-[11px] text-[#398eb3] mt-1">Aktif</p>
				</div>
				<div className="rounded-lg bg-white/70 border border-white p-4">
					<p className="text-[12px] text-[#94A3B8] font-medium">
						Baru Bulan Ini
					</p>
					<p className="font-display font-bold text-[#0F172A] text-[19px] mt-1">
						{loading ? "—" : stats.newThisMonth}
					</p>
					<p className="text-[11px] text-[#4CC9B0] mt-1">Bergabung</p>
				</div>
			</div>
		</section>
	);
}
