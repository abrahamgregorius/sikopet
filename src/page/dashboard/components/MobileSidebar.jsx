/** @format */

export default function MobileSidebar({ isOpen, onClose }) {
	const menuItems = [
		{ href: "#main-content", label: "Dasbor", active: true },
		{ href: "#analitik", label: "Analitik" },
		{ href: "#anggota-panel", label: "Keanggotaan" },
		{ href: "#transaksi", label: "Keuangan" },
		{ href: "#dokumen-panel", label: "Inventaris" },
		{ href: "#tim-panel", label: "Anggota Tim" },
		{ href: "#tugas-panel", label: "Tugas" },
	];

	return (
		<>
			<div onClick={onClose} className={`overlay fixed inset-0 bg-[#0F172A]/40 z-40 lg:hidden ${isOpen ? 'opacity-100 block' : 'opacity-0 hidden'}`}></div>
			<aside className={`drawer-panel fixed top-0 left-0 h-full w-72 bg-white z-50 lg:hidden flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
				<div className="h-[72px] flex items-center justify-between px-5 border-b border-[#D8E4EA]">
					<span className="font-display font-extrabold text-[18px]">SIKOPET</span>
					<button onClick={onClose} className="focus-ring p-1.5" aria-label="Tutup menu">
						<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" /></svg>
					</button>
				</div>
				<nav className="flex-1 overflow-y-auto px-3.5 py-5 space-y-1 text-[14.5px] font-medium text-[#475569]">
					{menuItems.map((item) => (
						<a
							key={item.label}
							href={item.href}
							onClick={onClose}
							className={`block px-3 py-2.5 rounded-xl transition-colors ${item.active ? 'bg-[#EAF6FB] text-[#2F7698]' : 'hover:bg-[#F1F5F9]'}`}
						>
							{item.label}
						</a>
					))}
				</nav>
			</aside>
		</>
	);
}
