/** @format */

const notifications = [
	{ icon: <><path d="M12 9v4M12 17h.01M10.3 3.9L2 20h20L13.7 3.9a2 2 0 00-3.4 0z" strokeLinecap="round" strokeLinejoin="round" /></>, color: "bg-[#EF4444]/10", stroke: "#EF4444", text: <><span className="font-semibold">Sinkronisasi gagal</span> di Koperasi Tani Makmur</>, time: "10 menit lalu" },
	{ icon: <><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" strokeLinecap="round" strokeLinejoin="round" /></>, color: "bg-[#F59E0B]/10", stroke: "#F59E0B", text: <><span className="font-semibold">Stok menipis</span> — 3 produk perlu direstock</>, time: "1 jam lalu" },
	{ icon: <><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" /></>, color: "bg-[#22C55E]/10", stroke: "#22C55E", text: <><span className="font-semibold">Pembaruan sistem</span> versi 4.2 berhasil diterapkan</>, time: "3 jam lalu" },
	{ icon: <><path d="M17 20v-1a4 4 0 00-4-4H7a4 4 0 00-4 4v1M10 11a4 4 0 100-8 4 4 0 000 8z" strokeLinecap="round" strokeLinejoin="round" /></>, color: "bg-[#EAF6FB]", stroke: "#398eb3", text: <><span className="font-semibold">2 koperasi baru</span> menyelesaikan pendaftaran</>, time: "Kemarin" },
];

export default function NotificationCenter() {
	return (
		<div className="lg:col-span-1 rounded-3xl bg-white border border-[#D8E4EA] p-6">
			<h3 className="font-display font-bold text-[#0F172A] text-[16px] mb-5">Pusat Notifikasi Sistem</h3>
			<ul className="space-y-3.5">
				{notifications.map((n, i) => (
					<li key={i} className="flex gap-3">
						<span className={`w-8 h-8 shrink-0 rounded-full ${n.color} grid place-items-center`}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={n.stroke} strokeWidth="2">{n.icon}</svg></span>
						<div>
							<p className="text-[13px] text-[#0F172A]">{n.text}</p>
							<p className="text-[11.5px] text-[#94A3B8] mt-0.5">{n.time}</p>
						</div>
					</li>
				))}
			</ul>
		</div>
	);
}
