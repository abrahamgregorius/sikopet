/** @format */

import { IconContainer } from "../../../components/ui";

const docs = [
	{
		name: "Laporan RAT 2025.pdf",
		meta: "2.4 MB · 2 hari lalu",
		bg: "bg-[#EAF6FB]",
		stroke: "#398eb3",
	},
	{
		name: "Neraca Q2 2026.xlsx",
		meta: "860 KB · 4 hari lalu",
		bg: "bg-[#4CC9B0]/15",
		stroke: "#2F7698",
	},
	{
		name: "Kebijakan Simpan Pinjam.docx",
		meta: "410 KB · 1 minggu lalu",
		bg: "bg-[#F59E0B]/15",
		stroke: "#F59E0B",
	},
];

export default function DocumentList() {
	return (
		<div
			id="dokumen-panel"
			className="lg:col-span-1 rounded-lg bg-white border border-[#D8E4EA] p-6"
		>
			<h3 className="font-display font-bold text-[#0F172A] text-[16px] mb-5">
				Dokumen Terbaru
			</h3>
			<ul className="space-y-3">
				{docs.map((doc) => (
					<li key={doc.name} className="flex items-center gap-3">
						<IconContainer size="md" className={doc.bg}>
							<svg
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								stroke={doc.stroke}
								strokeWidth="1.8"
							>
								<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
								<path d="M14 2v6h6" strokeLinejoin="round" />
							</svg>
						</IconContainer>
						<div className="flex-1 min-w-0">
							<p className="text-[13.5px] font-semibold text-[#0F172A] truncate">
								{doc.name}
							</p>
							<p className="text-[11.5px] text-[#94A3B8]">{doc.meta}</p>
						</div>
						<button
							data-tip="Unduh"
							className="focus-ring p-1.5 rounded-lg hover:bg-[#F1F5F9] text-[#94A3B8] shrink-0"
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
									d="M12 3v12M7 10l5 5 5-5M5 21h14"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
						</button>
					</li>
				))}
			</ul>
		</div>
	);
}
