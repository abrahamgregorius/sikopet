/** @format */

import { useState } from "react";
import { Card } from "../../../components/ui";
import { useBIData, useBIExecutiveSummary } from "../../../hooks/useBIData.jsx";
import { formatCurrency } from "../../../utils/formatCurrency.js";
import DateRangeFilter from "./DateRangeFilter.jsx";
import { BILineChart, BIDonutChart } from "./BICharts.jsx";
import BIKpiCard from "./BIKpiCard.jsx";

function AlertItem({ alert }) {
	return (
		<div className={`flex items-start gap-3 p-3 rounded-lg ${
			alert.type === "danger" ? "bg-[#FEE2E2]" : alert.type === "warning" ? "bg-[#FEF3C7]" : "bg-[#DBEAFE]"
		}`}>
			<span className={`mt-0.5 w-5 h-5 rounded-full grid place-items-center flex-shrink-0 ${
				alert.type === "danger" ? "bg-[#EF4444]" : alert.type === "warning" ? "bg-[#F59E0B]" : "bg-[#3B82F6]"
			}`}>
				<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
					{alert.type === "danger" ? (
						<path strokeLinecap="round" d="M18 6L6 18M6 6l12 12" />
					) : (
						<path strokeLinecap="round" d="M12 9v4m0 4h.01" />
					)}
				</svg>
			</span>
			<div className="min-w-0">
				<p className={`text-[13px] font-semibold ${alert.type === "danger" ? "text-[#991B1B]" : alert.type === "warning" ? "text-[#92400E]" : "text-[#1E40AF]"}`}>
					{alert.title}
				</p>
				<p className={`text-[12px] mt-0.5 ${alert.type === "danger" ? "text-[#DC2626]" : alert.type === "warning" ? "text-[#D97706]" : "text-[#2563EB]"}`}>
					{alert.message}
				</p>
			</div>
		</div>
	);
}

function MemberStatusDonut({ data }) {
	const chartData = [
		{ name: "Aktif", value: data.active },
		{ name: "Inaktif", value: data.inactive },
		{ name: "Pending", value: data.pending },
	].filter((d) => d.value > 0);

	if (chartData.length === 0) {
		return (
			<div className="flex items-center justify-center h-[200px] text-[#94A3B8] text-[13px]">
				Tidak ada data anggota
			</div>
		);
	}

	return <BIDonutChart data={chartData} dataKey="value" nameKey="name" />;
}

const icons = {
	members: (
		<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#398eb3" strokeWidth="1.8">
			<path d="M17 20v-1a4 4 0 00-4-4H7a4 4 0 00-4 4v1M10 11a4 4 0 100-8 4 4 0 000 8z" strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	),
	savings: (
		<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#398eb3" strokeWidth="1.8">
			<path d="M19 5l-7 7-4-4-5 5M19 5h-5M19 5v5" strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	),
	loan: (
		<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#398eb3" strokeWidth="1.8">
			<path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	),
	cashflow: (
		<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#398eb3" strokeWidth="1.8">
			<path d="M3 10h2m12 0h2M3 14h2m12 0h2M5 10V6a2 2 0 012-2h10a2 2 0 012 2v12a2 2 0 01-2 2H7a2 2 0 01-2-2v-4" strokeLinecap="round" />
		</svg>
	),
	sales: (
		<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#398eb3" strokeWidth="1.8">
			<rect x="2" y="5" width="20" height="14" rx="2" />
			<path d="M2 10h20" strokeLinecap="round" />
		</svg>
	),
};

export default function BIExecutiveSummary() {
	const [range, setRange] = useState("30d");
	const biData = useBIData(range);
	const summary = useBIExecutiveSummary(biData);

	const { kpis, memberStatusCounts, cashFlowData, criticalAlerts, loading } = summary;

	return (
		<div className="space-y-5">
			<div className="flex items-center justify-between">
				<div>
					<h2 className="font-display font-bold text-[#0F172A] text-[18px]">
						Executive Summary
					</h2>
					<p className="text-[12.5px] text-[#94A3B8] mt-0.5">
						Ringkasan kinerja bisnis keseluruhan
					</p>
				</div>
				<DateRangeFilter value={range} onChange={setRange} />
			</div>

			<div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
				<BIKpiCard
					label="Total Anggota Aktif"
					value={kpis.activeMembers}
					icon={icons.members}
					loading={loading}
				/>
				<BIKpiCard
					label="Total Saldo Simpanan"
					value={formatCurrency(kpis.savingsBalance, { short: true })}
					icon={icons.savings}
					loading={loading}
				/>
				<BIKpiCard
					label="Total Pinjaman Outstanding"
					value={formatCurrency(kpis.outstandingLoans, { short: true })}
					icon={icons.loan}
					loading={loading}
				/>
				<BIKpiCard
					label="Cash Flow Bulan Ini"
					value={formatCurrency(kpis.cashFlow, { short: true })}
					icon={icons.cashflow}
					loading={loading}
				/>
				<BIKpiCard
					label="Penjualan Hari Ini"
					value={formatCurrency(kpis.todaySales, { short: true })}
					icon={icons.sales}
					loading={loading}
				/>
			</div>

			<div className="grid lg:grid-cols-2 gap-5">
				<Card variant="standard" className="!p-6">
					<h3 className="font-display font-bold text-[#0F172A] text-[16px] mb-1">
						Tren Kas Masuk vs Keluar
					</h3>
					<p className="text-[12px] text-[#94A3B8] mb-4">
						{range === "7d" ? "7 hari" : range === "30d" ? "30 hari" : range === "thisMonth" ? "bulan ini" : "semua"} terakhir
					</p>
					{loading ? (
						<div className="skel h-[200px] w-full rounded-lg" />
					) : cashFlowData.length === 0 ? (
						<div className="flex items-center justify-center h-[200px] text-[#94A3B8] text-[13px]">
							Tidak ada data transaksi
						</div>
					) : (
						<BILineChart
							data={cashFlowData}
							lines={[
								{ dataKey: "income", name: "Kas Masuk", color: "#22C55E" },
								{ dataKey: "expense", name: "Kas Keluar", color: "#EF4444" },
							]}
							xKey="label"
							height={200}
						/>
					)}
				</Card>

				<Card variant="standard" className="!p-6">
					<h3 className="font-display font-bold text-[#0F172A] text-[16px] mb-1">
						Komposisi Status Anggota
					</h3>
					<p className="text-[12px] text-[#94A3B8] mb-4">
						Distribusi anggota berdasarkan status
					</p>
					{loading ? (
						<div className="skel h-[200px] w-full rounded-lg" />
					) : (
						<MemberStatusDonut data={memberStatusCounts} />
					)}
				</Card>
			</div>

			{criticalAlerts.length > 0 && (
				<Card variant="standard" className="!p-6">
					<h3 className="font-display font-bold text-[#0F172A] text-[16px] mb-3">
						Notifikasi Kritis
					</h3>
					<div className="space-y-2">
						{criticalAlerts.map((alert, i) => (
							<AlertItem key={i} alert={alert} />
						))}
					</div>
				</Card>
			)}
		</div>
	);
}
