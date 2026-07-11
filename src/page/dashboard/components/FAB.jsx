/** @format */

export default function FAB({
	isOpen,
	onToggle,
	onNewTransaction,
	onNewTask,
	onNewMember,
	onNewUser,
}) {
	return (
		<div className="fixed bottom-6 right-6 z-40">
			{isOpen && (
				<div
					id="fab-menu"
					className="pop-enter absolute bottom-[calc(100%+12px)] right-0 w-56 bg-white rounded-lg border border-[#E5E7EB] p-2"
				>
					<button
						onClick={onNewTransaction}
						className="focus-ring w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-[13.5px] font-medium text-[#475569] hover:bg-[#F1F5F9] transition-colors"
					>
						<svg
							width="15"
							height="15"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="1.8"
						>
							<rect x="3" y="7" width="18" height="13" rx="2" />
						</svg>
						Transaksi Baru
					</button>
					<button
						onClick={onNewTask}
						className="focus-ring w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-[13.5px] font-medium text-[#475569] hover:bg-[#F1F5F9] transition-colors"
					>
						<svg
							width="15"
							height="15"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="1.8"
						>
							<rect x="4" y="4" width="16" height="16" rx="3" />
							<path d="M8 12l2.5 2.5L16 9" strokeLinecap="round" />
						</svg>
						Tugas Baru
					</button>
					<button
						onClick={onNewMember}
						className="focus-ring w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-[13.5px] font-medium text-[#475569] hover:bg-[#F1F5F9] transition-colors"
					>
						<svg
							width="15"
							height="15"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="1.8"
						>
							<path
								d="M17 20v-1a4 4 0 00-4-4H7a4 4 0 00-4 4v1M10 11a4 4 0 100-8 4 4 0 000 8z"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
						Anggota Baru
					</button>
					<button
						onClick={onNewUser}
						className="focus-ring w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-[13.5px] font-medium text-[#475569] hover:bg-[#F1F5F9] transition-colors"
					>
						<svg
							width="15"
							height="15"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="1.8"
						>
							<circle cx="12" cy="12" r="9" />
							<path d="M12 8v8M8 12h8" strokeLinecap="round" />
						</svg>
						User Baru
					</button>
				</div>
			)}
			<button
				id="fab-btn"
				onClick={onToggle}
				className="focus-ring w-14 h-14 rounded-lg bg-gradient-to-br from-[#398eb3] to-[#2F7698] text-white grid place-items-center hover:scale-105 transition-transform duration-300"
				aria-label="Aksi cepat"
				aria-haspopup="true"
			>
				<svg
					id="fab-icon"
					style={{ transform: isOpen ? "rotate(45deg)" : "rotate(0)" }}
					width="22"
					height="22"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2.2"
					className="transition-transform duration-300"
				>
					<path d="M12 5v14M5 12h14" strokeLinecap="round" />
				</svg>
			</button>
		</div>
	);
}
