/** @format */

import { useState } from "react";

function PerformanceRing({ value }) {
	return (
		<div
			className="ring w-36 h-36 grid place-items-center"
			style={{ "--p": value, "--ring-color": "#398eb3" }}
		>
			<div className="ring-inner w-[104px] h-[104px] grid place-items-center flex-col">
				<span className="font-display font-extrabold text-[#0F172A] text-[26px]">
					{value}%
				</span>
				<span className="text-[11px] text-[#94A3B8] -mt-0.5">dari target</span>
			</div>
		</div>
	);
}

const perfTabs = [
	{ id: "minggu", label: "Minggu Ini", value: 82 },
	{ id: "bulan", label: "Bulan Ini", value: 67 },
];

export function AnalyticsSection() {
	const [activePerfTab, setActivePerfTab] = useState("minggu");
	const perfValue = perfTabs.find((t) => t.id === activePerfTab)?.value || 82;

	return (
		<section
			id="analitik"
			aria-label="Analitik"
			className="reveal in grid lg:grid-cols-3 gap-5"
		>
			<div className="lg:col-span-2 rounded-3xl bg-white border border-[#D8E4EA] p-6">
				<div className="flex flex-wrap items-center justify-between gap-3 mb-1">
					<div>
						<h3 className="font-display font-bold text-[#0F172A] text-[16px]">
							Tren Transaksi
						</h3>
						<p className="text-[12.5px] text-[#94A3B8] mt-0.5">
							Volume transaksi harian, 7 hari terakhir
						</p>
					</div>
				</div>
				<svg
					viewBox="0 0 560 200"
					className="w-full h-[200px] mt-4"
					role="img"
					aria-label="Grafik tren transaksi tujuh hari terakhir"
				>
					<defs>
						<linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
							<stop offset="0%" stopColor="#398eb3" stopOpacity="0.22" />
							<stop offset="100%" stopColor="#398eb3" stopOpacity="0" />
						</linearGradient>
					</defs>
					<g stroke="#E8EEF2" strokeWidth="1">
						<line x1="0" y1="20" x2="560" y2="20" />
						<line x1="0" y1="65" x2="560" y2="65" />
						<line x1="0" y1="110" x2="560" y2="110" />
						<line x1="0" y1="155" x2="560" y2="155" />
					</g>
					<path
						d="M0,150 L80,120 L160,135 L240,80 L320,95 L400,50 L480,65 L560,30 L560,180 L0,180 Z"
						fill="url(#areaFill)"
					/>
					<path
						d="M0,150 L80,120 L160,135 L240,80 L320,95 L400,50 L480,65 L560,30"
						fill="none"
						stroke="#398eb3"
						strokeWidth="2.5"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
					<g fill="#398eb3">
						<circle cx="0" cy="150" r="3.5" />
						<circle cx="80" cy="120" r="3.5" />
						<circle cx="160" cy="135" r="3.5" />
						<circle cx="240" cy="80" r="3.5" />
						<circle cx="320" cy="95" r="3.5" />
						<circle cx="400" cy="50" r="3.5" />
						<circle cx="480" cy="65" r="3.5" />
						<circle cx="560" cy="30" r="4.5" fill="#2F7698" />
					</g>
				</svg>
				<div className="flex justify-between mt-1 text-[11px] text-[#94A3B8] font-medium px-0.5">
					<span>Sen</span>
					<span>Sel</span>
					<span>Rab</span>
					<span>Kam</span>
					<span>Jum</span>
					<span>Sab</span>
					<span>Ming</span>
				</div>
			</div>

			<div className="rounded-3xl bg-white border border-[#D8E4EA] p-6 flex flex-col">
				<h3 className="font-display font-bold text-[#0F172A] text-[16px] mb-4">
					Performa Target
				</h3>
				<div
					role="tablist"
					className="inline-flex bg-[#F1F5F9] rounded-full p-1 mb-5 self-start"
				>
					{perfTabs.map((tab) => (
						<button
							key={tab.id}
							role="tab"
							aria-selected={activePerfTab === tab.id}
							onClick={() => setActivePerfTab(tab.id)}
							className={`focus-ring px-3.5 py-1.5 rounded-full text-[12.5px] font-semibold transition-colors ${activePerfTab === tab.id ? "bg-white shadow-soft text-[#0F172A]" : "text-[#475569]"}`}
						>
							{tab.label}
						</button>
					))}
				</div>
				<div className="flex-1 flex flex-col items-center justify-center">
					<PerformanceRing value={perfValue} />
					<p className="text-[12.5px] text-[#475569] text-center mt-4 max-w-[190px]">
						Target penyerapan simpanan anggota kuartal ini
					</p>
				</div>
			</div>
		</section>
	);
}

export function ModuleUsage() {
	const modules = [
		{ label: "Kasir", pct: 92, color: "bg-[#398eb3]" },
		{ label: "Anggota", pct: 78, color: "bg-[#67B2D4]" },
		{ label: "Simpan Pinjam", pct: 64, color: "bg-[#4CC9B0]" },
		{
			label: "Inventaris",
			pct: 51,
			color: "bg-[#EAF6FB] border border-[#67B2D4]",
		},
		{
			label: "Laporan",
			pct: 37,
			color: "bg-[#F1F5F9] border border-[#D8E4EA]",
		},
	];

	return (
		<div className="rounded-3xl bg-white border border-[#D8E4EA] p-6">
			<h3 className="font-display font-bold text-[#0F172A] text-[16px] mb-5">
				Penggunaan Modul
			</h3>
			<div className="flex items-end justify-between gap-3 h-[150px]">
				{modules.map((m) => (
					<div
						key={m.label}
						className="flex-1 flex flex-col items-center gap-2"
					>
						<span className="text-[11px] font-semibold text-[#94A3B8]">
							{m.pct}%
						</span>
						<div
							className={`w-full rounded-t-lg ${m.color}`}
							style={{ height: `${m.pct}%` }}
						></div>
						<span className="text-[11px] text-[#94A3B8] font-medium">
							{m.label}
						</span>
					</div>
				))}
			</div>
		</div>
	);
}

export function ProgressOverview() {
	const items = [
		{ label: "Migrasi Data Koperasi Baru", pct: 76, color: "bg-[#398eb3]" },
		{ label: "Pelatihan Pengurus Baru", pct: 54, color: "bg-[#4CC9B0]" },
		{ label: "Verifikasi Dokumen RAT", pct: 91, color: "bg-[#22C55E]" },
		{ label: "Audit Keuangan Triwulan", pct: 32, color: "bg-[#F59E0B]" },
	];

	return (
		<div className="rounded-3xl bg-white border border-[#D8E4EA] p-6">
			<h3 className="font-display font-bold text-[#0F172A] text-[16px] mb-5">
				Ikhtisar Progres
			</h3>
			<div className="space-y-4">
				{items.map((item) => (
					<div key={item.label}>
						<div className="flex justify-between text-[13px] mb-1.5">
							<span className="font-medium text-[#475569]">{item.label}</span>
							<span className="font-semibold text-[#0F172A]">{item.pct}%</span>
						</div>
						<div className="h-2 rounded-full bg-[#F1F5F9] overflow-hidden">
							<div
								className={`h-full rounded-full ${item.color}`}
								style={{ width: `${item.pct}%` }}
							></div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
