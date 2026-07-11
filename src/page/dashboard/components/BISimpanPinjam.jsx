/** @format */

import { useState } from "react";
import { Card, Badge } from "../../../components/ui";
import { useBIData, useBISimpanPinjam } from "../../../hooks/useBIData.jsx";
import { formatCurrency, formatDate } from "../../../utils/formatCurrency.js";
import DateRangeFilter from "./DateRangeFilter.jsx";
import { BIBarChart } from "./BICharts.jsx";

function TopSavingsTable({ members }) {
	if (!members?.length) {
		return (
			<div className="py-8 text-center text-[13px] text-[#94A3B8]">
				Tidak ada data simpanan
			</div>
		);
	}

	return (
		<div className="space-y-2">
			{members.map((m, i) => (
				<div key={m.id} className="flex items-center justify-between py-2 border-b border-[#E8EEF2] last:border-0">
					<div className="flex items-center gap-3 min-w-0">
						<span className="w-6 h-6 rounded-full bg-[#EAF6FB] text-[#2F7698] text-[11px] font-bold grid place-items-center flex-shrink-0">
							{i + 1}
						</span>
						<div className="min-w-0">
							<p className="text-[13px] font-semibold text-[#0F172A] truncate">
								{m.name}
							</p>
							<p className="text-[11px] text-[#94A3B8]">{m.memberNumber || `#${m.id}`}</p>
						</div>
					</div>
					<p className="text-[13px] font-bold text-[#0F172A]">
						{formatCurrency(m.balance, { short: true })}
					</p>
				</div>
			))}
		</div>
	);
}

function DueSoonLoanItem({ loan }) {
	const today = new Date();
	const due = new Date(loan.dueDate);
	const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));

	return (
		<div className={`flex items-center justify-between py-2.5 border-b border-[#E8EEF2] last:border-0 ${loan.isOverdue ? "bg-[#FEE2E2]/30 rounded-lg px-2 -mx-2" : ""}`}>
			<div className="min-w-0 pr-3">
				<p className="text-[13px] font-semibold text-[#0F172A] truncate">
					{loan.memberName}
				</p>
				<p className="text-[11px] text-[#94A3B8]">
					{formatDate(loan.dueDate)}
				</p>
			</div>
			<div className="flex flex-col items-end flex-shrink-0">
				<p className="text-[12px] font-bold text-[#0F172A]">
					{formatCurrency(loan.principal, { short: true })}
				</p>
				<Badge variant={loan.isOverdue ? "danger" : diffDays <= 3 ? "warning" : "info"}>
					{loan.isOverdue ? "Overdue" : `${diffDays} hari lagi`}
				</Badge>
			</div>
		</div>
	);
}

function NPLGauge({ npl }) {
	const pct = Math.min(npl.ratio, 100);
	const color = pct > 20 ? "#EF4444" : pct > 10 ? "#F59E0B" : "#22C55E";

	return (
		<div className="flex flex-col items-center gap-3">
			<div className="relative w-28 h-28">
				<svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
					<circle cx="60" cy="60" r="50" fill="none" stroke="#E8EEF2" strokeWidth="12" />
					<circle
						cx="60"
						cy="60"
						r="50"
						fill="none"
						stroke={color}
						strokeWidth="12"
						strokeDasharray={`${2 * Math.PI * 50}`}
						strokeDashoffset={`${2 * Math.PI * 50 * (1 - pct / 100)}`}
						strokeLinecap="round"
					/>
				</svg>
				<div className="absolute inset-0 flex flex-col items-center justify-center">
					<span className="font-display font-extrabold text-[22px]" style={{ color }}>
						{npl.ratio.toFixed(1)}%
					</span>
					<span className="text-[10px] text-[#94A3B8]">NPL</span>
				</div>
			</div>
			<div className="text-center">
				<p className="text-[12px] font-semibold text-[#0F172A]">{npl.overdueCount} Pinjaman Overdue</p>
				<p className="text-[11px] text-[#94A3B8]">dari {npl.activeCount} pinjaman aktif</p>
			</div>
		</div>
	);
}

function LoanPortfolioBar({ portfolio }) {
	return (
		<div className="space-y-3">
			{portfolio.byStatus.map((s) => (
				<div key={s.status}>
					<div className="flex justify-between text-[12px] mb-1">
						<span className="text-[#475569]">{s.status}</span>
						<span className="font-semibold text-[#0F172A]">{formatCurrency(s.principal, { short: true })}</span>
					</div>
					<div className="h-2 bg-[#E8EEF2] rounded-lg overflow-hidden">
						<div
							className="h-full rounded-lg bg-[#398eb3]"
							style={{
								width: portfolio.totalPrincipal > 0 ? `${(s.principal / portfolio.totalPrincipal) * 100}%` : "0%",
							}}
						/>
					</div>
				</div>
			))}
		</div>
	);
}

export default function BISimpanPinjam() {
	const [range, setRange] = useState("30d");
	const biData = useBIData(range);
	const sp = useBISimpanPinjam(biData);

	return (
		<div className="space-y-5">
			<div className="flex items-center justify-between">
				<div>
					<h2 className="font-display font-bold text-[#0F172A] text-[18px]">
						Modul Simpan Pinjam
					</h2>
					<p className="text-[12.5px] text-[#94A3B8] mt-0.5">
						Analisis simpanan dan pinjaman anggota
					</p>
				</div>
				<DateRangeFilter value={range} onChange={setRange} />
			</div>

			<div className="grid lg:grid-cols-3 gap-5">
				<Card variant="standard" className="!p-6 lg:col-span-2">
					<h3 className="font-display font-bold text-[#0F172A] text-[16px] mb-1">
						Total Simpanan per Bulan
					</h3>
					<p className="text-[12px] text-[#94A3B8] mb-4">
						Deposit vs Penarikan per bulan
					</p>
					{sp.loading ? (
						<div className="skel h-[200px] w-full rounded-lg" />
					) : sp.savingsByMonth.length === 0 ? (
						<div className="flex items-center justify-center h-[200px] text-[#94A3B8] text-[13px]">
							Tidak ada data simpanan
						</div>
					) : (
						<BIBarChart
							data={sp.savingsByMonth}
							bars={[
								{ dataKey: "deposit", name: "Setoran", color: "#22C55E" },
								{ dataKey: "withdrawal", name: "Penarikan", color: "#EF4444" },
							]}
							xKey="label"
							height={200}
						/>
					)}
				</Card>

				<Card variant="standard" className="!p-6">
					<h3 className="font-display font-bold text-[#0F172A] text-[16px] mb-1">
						NPL Ratio
					</h3>
					<p className="text-[12px] text-[#94A3B8] mb-4">
						Non-performing loan ratio
					</p>
					{sp.loading ? (
						<div className="skel h-[160px] w-full rounded-lg" />
					) : (
						<NPLGauge npl={sp.nplRatio} />
					)}
				</Card>
			</div>

			<div className="grid lg:grid-cols-2 gap-5">
				<Card variant="standard" className="!p-6">
					<h3 className="font-display font-bold text-[#0F172A] text-[16px] mb-3">
						Top 5 Anggota Saldo Tertinggi
					</h3>
					{sp.loading ? (
						<div className="space-y-3">
							{[1, 2, 3, 4, 5].map((i) => (
								<div key={i} className="skel h-10 w-full rounded" />
							))}
						</div>
					) : (
						<TopSavingsTable members={sp.topSavingsMembers} />
					)}
				</Card>

				<Card variant="standard" className="!p-6">
					<h3 className="font-display font-bold text-[#0F172A] text-[16px] mb-3">
						Portfolio Pinjaman
					</h3>
					{sp.loading ? (
						<div className="space-y-3">
							{[1, 2, 3, 4].map((i) => (
								<div key={i} className="skel h-8 w-full rounded" />
							))}
						</div>
					) : (
						<LoanPortfolioBar portfolio={sp.loanPortfolio} />
					)}
				</Card>
			</div>

			<Card variant="standard" className="!p-6">
				<h3 className="font-display font-bold text-[#0F172A] text-[16px] mb-3">
					Pinjaman Jatuh Tempo / Akan Jatuh Tempo
				</h3>
				{sp.loading ? (
					<div className="space-y-2">
						{[1, 2, 3].map((i) => (
							<div key={i} className="skel h-12 w-full rounded" />
						))}
					</div>
				) : sp.dueSoonLoans.length === 0 ? (
					<div className="py-8 text-center text-[13px] text-[#94A3B8]">
						Tidak ada pinjaman jatuh tempo
					</div>
				) : (
					sp.dueSoonLoans.map((loan) => (
						<DueSoonLoanItem key={loan.id} loan={loan} />
					))
				)}
			</Card>
		</div>
	);
}
