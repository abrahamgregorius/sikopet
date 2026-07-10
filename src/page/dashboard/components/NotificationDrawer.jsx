/** @format */

export default function NotificationDrawer({ isOpen, onClose }) {
	const notifications = [
		{ icon: <><path d="M17 20v-1a4 4 0 00-4-4H7a4 4 0 00-4 4v1M10 11a4 4 0 100-8 4 4 0 000 8z" strokeLinecap="round" strokeLinejoin="round" /></>, bg: "bg-[#398eb3]", color: "white", text: <><span className="font-semibold">Anggota baru</span> mendaftar di Cooperativa Sejahtera Bersama</>, time: "5 menit lalu" },
		{ icon: <><path d="M12 9v4M12 17h.01" strokeLinecap="round" /></>, bg: "bg-[#EF4444]/10", color: "#EF4444", text: <><span className="font-semibold">Sinkronisasi gagal</span> di Cooperativa Tani Makmur</>, time: "10 menit lalu" },
		{ icon: <><path d="M12 9v4M12 17h.01" strokeLinecap="round" /></>, bg: "bg-[#F59E0B]/10", color: "#F59E0B", text: <><span className="font-semibold">Stok menipis</span> di unit usaha Cooperativa Nusa Bakti</>, time: "1 jam lalu" },
		{ icon: <><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" /></>, bg: "bg-[#22C55E]/10", color: "#22C55E", text: <><span className="font-semibold">Persetujuan pinjaman</span> selesai diproses</>, time: "3 jam lalu" },
		{ icon: <><rect x="4" y="4" width="16" height="16" rx="3" /></>, bg: "bg-[#EAF6FB]", color: "#398eb3", text: <><span className="font-semibold">Laporan RAT</span> siap diunduh</>, time: "Kemarin" },
	];

	return (
		<>
			<div onClick={onClose} className={`overlay fixed inset-0 bg-[#0F172A]/30 z-50 ${isOpen ? 'opacity-100 block' : 'opacity-0 hidden'}`}></div>
			<div className={`drawer-panel fixed top-0 right-0 h-full w-full max-w-[380px] bg-white z-[60] flex flex-col shadow-lift ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
				<div className="flex items-center justify-between px-6 h-[72px] border-b border-[#D8E4EA] shrink-0">
					<h3 className="font-display font-bold text-[#0F172A] text-[16px]">Notifikasi</h3>
					<button onClick={onClose} className="focus-ring p-1.5 rounded-lg hover:bg-[#F1F5F9]" aria-label="Tutup notifikasi">
						<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" /></svg>
					</button>
				</div>
				<div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
					{notifications.map((notif, i) => (
						<div key={i} className={`flex gap-3 p-3 rounded-2xl ${i === 0 ? 'bg-[#EAF6FB]/60' : 'hover:bg-[#F1F5F9] transition-colors'}`}>
							<span className={`w-9 h-9 shrink-0 rounded-full ${notif.bg} grid place-items-center`}>
								<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={notif.color} strokeWidth="2">{notif.icon}</svg>
							</span>
							<div>
								<p className="text-[13px] text-[#0F172A]">{notif.text}</p>
								<p className="text-[11.5px] text-[#94A3B8] mt-1">{notif.time}</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</>
	);
}
