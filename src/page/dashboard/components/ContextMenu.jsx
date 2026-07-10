/** @format */

export default function ContextMenu({ x, y, onClose }) {
	const actions = [
		{ label: "Lihat Detail", icon: <><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" /><circle cx="12" cy="12" r="3" /></> },
		{ label: "Edit", icon: <><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.1 2.1 0 013 3L12 15l-4 1 1-4z" /></> },
		{ label: "Hapus", icon: <><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z" strokeLinecap="round" strokeLinejoin="round" /></>, danger: true },
	];

	return (
		<div style={{ top: y, left: x }} className="pop-enter fixed w-44 bg-white rounded-xl border border-[#D8E4EA] shadow-lift p-1.5 z-[70]">
			{actions.map((action) => (
				action.danger ? (
					<div key={action.label} className="h-px bg-[#E8EEF2] my-1"></div>
				) : null
			))}
			{actions.map((action) => (
				<button key={action.label} className={`focus-ring w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] transition-colors ${action.danger ? "text-[#EF4444] hover:bg-[#EF4444]/10" : "text-[#475569] hover:bg-[#F1F5F9]"}`}>
					<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">{action.icon}</svg>
					{action.label}
				</button>
			))}
		</div>
	);
}
