/** @format */

import { Button, IconContainer } from "../../../components/ui";

const actions = [
	{
		label: "Tambah Anggota",
		icon: (
			<>
				<path
					d="M17 20v-1a4 4 0 00-4-4H7a4 4 0 00-4 4v1M10 11a4 4 0 100-8 4 4 0 000 8zM19 8v6M22 11h-6"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</>
		),
	},
	{
		label: "Catat Transaksi",
		icon: (
			<>
				<rect x="3" y="7" width="18" height="13" rx="2" />
				<path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" strokeLinecap="round" />
			</>
		),
	},
	{
		label: "Proses Pinjaman",
		icon: (
			<>
				<path
					d="M17 1l4 4-4 4M3 11V9a4 4 0 014-4h14M7 23l-4-4 4-4M21 13v2a4 4 0 01-4 4H3"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</>
		),
	},
	{
		label: "Buat Laporan",
		icon: (
			<>
				<path
					d="M9 17V9M13 17v-4M17 17V6M4 4h16v16H4z"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</>
		),
	},
];

export default function QuickActions({ onOpenTaskModal }) {
	return (
		<section
			aria-label="Aksi cepat"
			className="reveal in grid grid-cols-2 sm:grid-cols-4 gap-4"
		>
			{actions.map((action, i) => (
				<button
					key={action.label}
					onClick={i === 2 ? onOpenTaskModal : undefined}
					className="focus-ring group text-left rounded-lg bg-white border border-[#E5E7EB] p-5 hover:-translate-y-0.5 transition-all duration-300"
				>
					<IconContainer
						size="md"
						className="mb-3 group-hover:scale-110 transition-transform"
					>
						<svg
							width="18"
							height="18"
							viewBox="0 0 24 24"
							fill="none"
							stroke="#398eb3"
							strokeWidth="1.8"
						>
							{action.icon}
						</svg>
					</IconContainer>
					<p className="font-semibold text-[#0F172A] text-[13.5px]">
						{action.label}
					</p>
				</button>
			))}
		</section>
	);
}
