/** @format */

import { useState } from "react";

export default function RightPanel() {
	const [openAccordion, setOpenAccordion] = useState(null);

	const toggleAccordion = (item) => {
		setOpenAccordion(openAccordion === item ? null : item);
	};

	return (
		<aside className="hidden xl:flex flex-col w-[300px] shrink-0 border-l border-[#E5E7EB] px-5 py-7 space-y-6 sticky top-[72px] h-[calc(100vh-72px)] overflow-y-auto">
			<SyncMap />
			<StoragePanel />
			<HelpAccordion
				openAccordion={openAccordion}
				toggleAccordion={toggleAccordion}
			/>
		</aside>
	);
}

function SyncMap() {
	return (
		<div className="rounded-lg bg-white border border-[#E5E7EB] p-5">
			<div className="flex items-center justify-between mb-3">
				<h3 className="font-display font-bold text-[#0F172A] text-[14.5px]">
					Peta Sinkronisasi
				</h3>
				<span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#22C55E] bg-[#22C55E]/10 px-2 py-0.5 rounded-lg">
					<span className="w-1.5 h-1.5 rounded-lg bg-[#22C55E]"></span>Aktif
				</span>
			</div>
			<svg
				viewBox="0 0 240 150"
				className="w-full h-auto"
				role="img"
				aria-label="Peta status sinkronisasi provinsi"
			>
				<g opacity="0.15" fill="#398eb3">
					<ellipse cx="35" cy="80" rx="24" ry="9" />
					<ellipse cx="85" cy="92" rx="34" ry="11" />
					<ellipse cx="140" cy="75" rx="19" ry="8" />
					<ellipse cx="170" cy="98" rx="38" ry="13" />
					<ellipse cx="215" cy="85" rx="22" ry="9" />
				</g>
				<g stroke="#67B2D4" strokeWidth="1.2" fill="none" opacity="0.7">
					<path d="M40 74 C 60 55, 80 55, 95 70" strokeDasharray="4 4" />
					<path d="M95 70 C 115 60, 130 60, 150 73" strokeDasharray="4 4" />
					<path d="M150 73 C 175 60, 195 60, 213 78" strokeDasharray="4 4" />
				</g>
				<circle cx="40" cy="74" r="4" fill="#398eb3" />
				<circle cx="95" cy="70" r="5" fill="#2F7698" />
				<circle cx="150" cy="73" r="4" fill="#398eb3" />
				<circle cx="213" cy="78" r="6" fill="#4CC9B0" />
			</svg>
			<div className="grid grid-cols-2 gap-2.5 mt-3">
				<div className="rounded-lg bg-[#F1F5F9] px-3 py-2">
					<p className="text-[10.5px] text-[#94A3B8]">Provinsi Aktif</p>
					<p className="text-[14px] font-bold text-[#0F172A]">34</p>
				</div>
				<div className="rounded-lg bg-[#F1F5F9] px-3 py-2">
					<p className="text-[10.5px] text-[#94A3B8]">Sedang Sync</p>
					<p className="text-[14px] font-bold text-[#0F172A]">6</p>
				</div>
			</div>
		</div>
	);
}

function StoragePanel() {
	return (
		<div className="rounded-lg bg-white border border-[#E5E7EB] p-5">
			<h3 className="font-display font-bold text-[#0F172A] text-[14.5px] mb-4">
				Penyimpanan
			</h3>
			<div className="flex items-center gap-4">
				<div
					className="ring w-16 h-16 shrink-0 grid place-items-center"
					style={{ "--p": 64, "--ring-color": "#4CC9B0" }}
				>
					<div className="ring-inner w-11 h-11 grid place-items-center">
						<span className="text-[12px] font-bold text-[#0F172A]">64%</span>
					</div>
				</div>
				<div>
					<p className="text-[13px] font-semibold text-[#0F172A]">
						32 GB / 50 GB
					</p>
					<p className="text-[11.5px] text-[#94A3B8] mt-0.5">
						Dokumen & lampiran
					</p>
				</div>
			</div>
		</div>
	);
}

function HelpAccordion({ openAccordion, toggleAccordion }) {
	const items = [
		{
			id: "sync",
			title: "Cara sinkron manual?",
			content:
				"Tekan ikon sinkron di pojok kanan bawah aplikasi kasir untuk memaksa sinkronisasi segera.",
		},
		{
			id: "reset",
			title: "Reset kata sandi anggota tim",
			content:
				'Buka Pengaturan Akun → Anggota Tim, lalu pilih "Kirim tautan reset" pada pengguna terkait.',
		},
	];

	return (
		<div className="rounded-lg bg-white border border-[#E5E7EB] p-5">
			<h3 className="font-display font-bold text-[#0F172A] text-[14.5px] mb-4">
				Bantuan Cepat
			</h3>
			<div className="space-y-2" id="help-accordion">
				{items.map((item) => (
					<div
						key={item.id}
						className={`acc-item border border-[#E5E7EB] rounded-lg overflow-hidden ${openAccordion === item.id ? "nested-open" : ""}`}
					>
						<button
							onClick={() => toggleAccordion(item.id)}
							className="acc-trigger w-full flex items-center justify-between px-3.5 py-2.5 text-left focus-ring"
							aria-expanded={openAccordion === item.id}
						>
							<span className="text-[12.5px] font-semibold text-[#0F172A]">
								{item.title}
							</span>
							<svg
								className="chev-nested w-3.5 h-3.5 text-[#94A3B8] shrink-0"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2.2"
							>
								<path
									d="M6 9l6 6 6-6"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
						</button>
						<div className="nested-panel px-3.5">
							<p className="text-[12px] text-[#475569] pb-3">{item.content}</p>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
