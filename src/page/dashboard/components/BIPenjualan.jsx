/** @format */

import { useState } from "react";
import { Card, Badge } from "../../../components/ui";
import { useBIData, useBIPenjualan } from "../../../hooks/useBIData.jsx";
import { formatCurrency, formatDate } from "../../../utils/formatCurrency.js";
import DateRangeFilter from "./DateRangeFilter.jsx";
import { BILineChart, BIDonutChart } from "./BICharts.jsx";

function TopCustomerRow({ customer, rank }) {
	return (
		<div className="flex items-center justify-between py-2 border-b border-[#E8EEF2] last:border-0">
			<div className="flex items-center gap-3 min-w-0">
				<span className="w-6 h-6 rounded-full bg-[#EAF6FB] text-[#2F7698] text-[11px] font-bold grid place-items-center flex-shrink-0">
					{rank}
				</span>
				<div className="min-w-0">
					<p className="text-[13px] font-semibold text-[#0F172A] truncate">
						{customer.name}
					</p>
					<p className="text-[11px] text-[#94A3B8]">
						{customer.code || `#${customer.id}`} · {customer.category || "Umum"}
					</p>
				</div>
			</div>
			<div className="flex flex-col items-end flex-shrink-0">
				<p className="text-[12px] font-bold text-[#0F172A]">
					{formatCurrency(customer.totalTransaction || 0, { short: true })}
				</p>
				<p className="text-[10px] text-[#94A3B8]">
					{customer.visitCount || 0} kali kunjungan
				</p>
			</div>
		</div>
	);
}

function InactiveCustomerRow({ customer }) {
	const lastVisit = customer.lastVisit ? new Date(customer.lastVisit) : null;
	const today = new Date();
	const monthsAgo = lastVisit
		? Math.floor((today.getTime() - lastVisit.getTime()) / (1000 * 60 * 60 * 24 * 30))
		: null;

	return (
		<div className="flex items-center justify-between py-2 border-b border-[#E8EEF2] last:border-0">
			<div className="min-w-0 pr-3">
				<p className="text-[13px] font-semibold text-[#0F172A] truncate">
					{customer.name}
				</p>
				<p className="text-[11px] text-[#94A3B8]">
					{customer.code || `#${customer.id}`}
				</p>
			</div>
			<div className="flex flex-col items-end flex-shrink-0">
				<Badge variant="neutral">
					{monthsAgo !== null ? `${monthsAgo} bulan lalu` : "Tidak ada data"}
				</Badge>
				<p className="text-[10px] text-[#94A3B8] mt-0.5">
					{lastVisit ? formatDate(lastVisit) : "-"}
				</p>
			</div>
		</div>
	);
}

export default function BIPenjualan() {
	const [range, setRange] = useState("30d");
	const biData = useBIData(range);
	const sale = useBIPenjualan(biData);

	return (
		<div className="space-y-5">
			<div className="flex items-center justify-between">
				<div>
					<h2 className="font-display font-bold text-[#0F172A] text-[18px]">
						Modul Penjualan & Pelanggan
					</h2>
					<p className="text-[12.5px] text-[#94A3B8] mt-0.5">
						Analisis penjualan dan perilaku pelanggan
					</p>
				</div>
				<DateRangeFilter value={range} onChange={setRange} />
			</div>

			<div className="grid lg:grid-cols-2 gap-5">
				<Card variant="standard" className="!p-6">
					<h3 className="font-display font-bold text-[#0F172A] text-[16px] mb-1">
						Revenue Harian
					</h3>
					<p className="text-[12px] text-[#94A3B8] mb-4">
						Total penjualan per hari
					</p>
					{sale.loading ? (
						<div className="skel h-[200px] w-full rounded-lg" />
					) : sale.dailyRevenue.length === 0 ? (
						<div className="flex items-center justify-center h-[200px] text-[#94A3B8] text-[13px]">
							Tidak ada data penjualan
						</div>
					) : (
						<BILineChart
							data={sale.dailyRevenue}
							lines={[{ dataKey: "revenue", name: "Revenue", color: "#398eb3" }]}
							xKey="label"
							height={200}
						/>
					)}
				</Card>

				<Card variant="standard" className="!p-6">
					<h3 className="font-display font-bold text-[#0F172A] text-[16px] mb-1">
						Distribusi Metode Pembayaran
					</h3>
					<p className="text-[12px] text-[#94A3B8] mb-4">
						Proporsi berdasarkan metode
					</p>
					{sale.loading ? (
						<div className="skel h-[200px] w-full rounded-lg" />
					) : sale.paymentData.length === 0 ? (
						<div className="flex items-center justify-center h-[200px] text-[#94A3B8] text-[13px]">
							Tidak ada data pembayaran
						</div>
					) : (
						<BIDonutChart
							data={sale.paymentData}
							dataKey="amount"
							nameKey="method"
						/>
					)}
				</Card>
			</div>

			<div className="grid lg:grid-cols-2 gap-5">
				<Card variant="standard" className="!p-6">
					<h3 className="font-display font-bold text-[#0F172A] text-[16px] mb-3">
						Top 5 Customer
					</h3>
					{sale.loading ? (
						<div className="space-y-2">
							{[1, 2, 3, 4, 5].map((i) => (
								<div key={i} className="skel h-10 w-full rounded" />
							))}
						</div>
					) : sale.topCustomers.length === 0 ? (
						<div className="py-6 text-center text-[13px] text-[#94A3B8]">
							Tidak ada data customer
						</div>
					) : (
						sale.topCustomers.map((c, i) => (
							<TopCustomerRow key={c.id} customer={c} rank={i + 1} />
						))
					)}
				</Card>

				<Card variant="standard" className="!p-6">
					<h3 className="font-display font-bold text-[#0F172A] text-[16px] mb-3">
						Pelanggan Tidak Aktif
					</h3>
					<p className="text-[12px] text-[#94A3B8] mb-3">
						Target retensi pelanggan
					</p>
					{sale.loading ? (
						<div className="space-y-2">
							{[1, 2, 3, 4, 5].map((i) => (
								<div key={i} className="skel h-10 w-full rounded" />
							))}
						</div>
					) : sale.inactiveCustomers.length === 0 ? (
						<div className="py-6 text-center text-[13px] text-[#94A3B8]">
							Semua pelanggan aktif
						</div>
					) : (
						sale.inactiveCustomers.map((c) => (
							<InactiveCustomerRow key={c.id} customer={c} />
						))
					)}
				</Card>
			</div>
		</div>
	);
}
