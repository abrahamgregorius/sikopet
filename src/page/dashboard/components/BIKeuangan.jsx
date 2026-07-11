/** @format */

import { useState } from "react";
import { Card } from "../../../components/ui";
import { useBIData, useBIKeuangan } from "../../../hooks/useBIData.jsx";
import { formatCurrency } from "../../../utils/formatCurrency.js";
import DateRangeFilter from "./DateRangeFilter.jsx";
import { BIBarChart } from "./BICharts.jsx";

function CashFlowSummary({ data }) {
	const isPositive = data.netIncome >= 0;

	return (
		<div className="grid sm:grid-cols-3 gap-4">
			<div className="bg-[#DCFCE7]/40 rounded-xl p-4">
				<p className="text-[11px] font-medium text-[#166534] mb-1">Total Kas Masuk</p>
				<p className="font-display font-bold text-[#166534] text-[18px]">
					{formatCurrency(data.totalIncome, { short: true })}
				</p>
			</div>
			<div className="bg-[#FEE2E2]/40 rounded-xl p-4">
				<p className="text-[11px] font-medium text-[#991B1B] mb-1">Total Kas Keluar</p>
				<p className="font-display font-bold text-[#991B1B] text-[18px]">
					{formatCurrency(data.totalExpense, { short: true })}
				</p>
			</div>
			<div className={`${isPositive ? "bg-[#DCFCE7]/40" : "bg-[#FEE2E2]/40"} rounded-xl p-4`}>
				<p className="text-[11px] font-medium text-[#166534] mb-1">Net Cash Flow</p>
				<p className={`font-display font-bold text-[18px] ${isPositive ? "text-[#166534]" : "text-[#991B1B]"}`}>
					{isPositive ? "+" : ""}{formatCurrency(data.netIncome, { short: true })}
				</p>
			</div>
		</div>
	);
}

function CategoryRow({ label, value, color }) {
	return (
		<div className="flex items-center gap-3">
			<span className="w-2 h-2 rounded-sm flex-shrink-0" style={{ backgroundColor: color }} />
			<span className="text-[13px] text-[#475569] flex-1 min-w-0 truncate">{label}</span>
			<span className="text-[13px] font-semibold text-[#0F172A]">
				{formatCurrency(value, { short: true })}
			</span>
		</div>
	);
}

const CAT_COLORS = ["#398eb3", "#4CC9B0", "#67B2D4", "#22C55E", "#F59E0B", "#EF4444", "#3B82F6", "#8B5CF6"];

export default function BIKeuangan() {
	const [range, setRange] = useState("30d");
	const biData = useBIData(range);
	const fin = useBIKeuangan(biData);

	return (
		<div className="space-y-5">
			<div className="flex items-center justify-between">
				<div>
					<h2 className="font-display font-bold text-[#0F172A] text-[18px]">
						Modul Keuangan
					</h2>
					<p className="text-[12.5px] text-[#94A3B8] mt-0.5">
						Analisis income vs expense per kategori
					</p>
				</div>
				<DateRangeFilter value={range} onChange={setRange} />
			</div>

			<Card variant="standard" className="!p-6">
				<h3 className="font-display font-bold text-[#0F172A] text-[16px] mb-4">
					Ringkasan Cash Flow
				</h3>
				{fin.loading ? (
					<div className="grid sm:grid-cols-3 gap-4">
						{[1, 2, 3].map((i) => (
							<div key={i} className="skel h-16 w-full rounded-xl" />
						))}
					</div>
				) : (
					<CashFlowSummary data={fin} />
				)}
			</Card>

			<Card variant="standard" className="!p-6">
				<h3 className="font-display font-bold text-[#0F172A] text-[16px] mb-1">
					Income vs Expense per Bulan
				</h3>
				<p className="text-[12px] text-[#94A3B8] mb-4">
					Perbandingan kas masuk dan keluar per bulan
				</p>
				{fin.loading ? (
					<div className="skel h-[200px] w-full rounded-lg" />
				) : fin.incomeVsExpense.length === 0 ? (
					<div className="flex items-center justify-center h-[200px] text-[#94A3B8] text-[13px]">
						Tidak ada data transaksi
					</div>
				) : (
					<BIBarChart
						data={fin.incomeVsExpense}
						bars={[
							{ dataKey: "income", name: "Kas Masuk", color: "#22C55E" },
							{ dataKey: "expense", name: "Kas Keluar", color: "#EF4444" },
						]}
						xKey="label"
						height={220}
						stacked={false}
					/>
				)}
			</Card>

			<div className="grid lg:grid-cols-2 gap-5">
				<Card variant="standard" className="!p-6">
					<h3 className="font-display font-bold text-[#0F172A] text-[16px] mb-4">
						Komposisi Income
					</h3>
					{fin.loading ? (
						<div className="space-y-2">
							{[1, 2, 3, 4].map((i) => (
								<div key={i} className="skel h-6 w-full rounded" />
							))}
						</div>
					) : fin.incomeByCategory.length === 0 ? (
						<div className="py-6 text-center text-[13px] text-[#94A3B8]">
							Tidak ada data income
						</div>
					) : (
						<div className="space-y-2">
							{fin.incomeByCategory.map((cat, i) => (
								<CategoryRow
									key={cat.category}
									label={cat.category}
									value={cat.value}
									total={fin.totalIncome}
									color={CAT_COLORS[i % CAT_COLORS.length]}
								/>
							))}
						</div>
					)}
				</Card>

				<Card variant="standard" className="!p-6">
					<h3 className="font-display font-bold text-[#0F172A] text-[16px] mb-4">
						Komposisi Expense
					</h3>
					{fin.loading ? (
						<div className="space-y-2">
							{[1, 2, 3, 4].map((i) => (
								<div key={i} className="skel h-6 w-full rounded" />
							))}
						</div>
					) : fin.expenseByCategory.length === 0 ? (
						<div className="py-6 text-center text-[13px] text-[#94A3B8]">
							Tidak ada data expense
						</div>
					) : (
						<div className="space-y-2">
							{fin.expenseByCategory.map((cat, i) => (
								<CategoryRow
									key={cat.category}
									label={cat.category}
									value={cat.value}
									total={fin.totalExpense}
									color={CAT_COLORS[i % CAT_COLORS.length]}
								/>
							))}
						</div>
					)}
				</Card>
			</div>
		</div>
	);
}
