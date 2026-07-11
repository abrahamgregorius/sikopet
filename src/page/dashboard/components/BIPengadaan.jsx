/** @format */

import { useState } from "react";
import { Card, Badge } from "../../../components/ui";
import { useBIData, useBIPengadaan } from "../../../hooks/useBIData.jsx";
import { formatCurrency } from "../../../utils/formatCurrency.js";
import DateRangeFilter from "./DateRangeFilter.jsx";
import { BIBarChart } from "./BICharts.jsx";

const statusVariant = {
	pending: "warning",
	approved: "info",
	received: "success",
	rejected: "danger",
};

const statusColor = {
	pending: "#F59E0B",
	approved: "#3B82F6",
	received: "#22C55E",
	rejected: "#EF4444",
};

function ProcurementStatusRow({ status, count }) {
	const variant = statusVariant[status.toLowerCase()] || "neutral";
	const color = statusColor[status.toLowerCase()] || "#94A3B8";

	return (
		<div className="flex items-center justify-between py-3 border-b border-[#E8EEF2] last:border-0">
			<div className="flex items-center gap-2">
				<span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
				<span className="text-[13px] font-medium text-[#475569]">{status}</span>
			</div>
			<Badge variant={variant}>{count}</Badge>
		</div>
	);
}

function SupplierPurchaseRow({ supplier, rank }) {
	return (
		<div className="flex items-center justify-between py-2 border-b border-[#E8EEF2] last:border-0">
			<div className="flex items-center gap-3 min-w-0">
				<span className="w-5 h-5 rounded-full bg-[#EAF6FB] text-[#2F7698] text-[10px] font-bold grid place-items-center flex-shrink-0">
					{rank}
				</span>
				<p className="text-[13px] font-medium text-[#0F172A] truncate">
					{supplier.supplierName}
				</p>
			</div>
			<p className="text-[12px] font-semibold text-[#0F172A]">
				{formatCurrency(supplier.total, { short: true })}
			</p>
		</div>
	);
}

function SupplierEvalTable({ data }) {
	if (!data?.length) {
		return (
			<div className="py-6 text-center text-[13px] text-[#94A3B8]">
				Tidak ada data evaluasi supplier
			</div>
		);
	}

	return (
		<div className="overflow-x-auto">
			<table className="w-full min-w-[400px]">
				<thead>
					<tr className="border-b border-[#E5E7EB]">
						<th className="py-2.5 px-3 text-left text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wide">
							Supplier
						</th>
						<th className="py-2.5 px-3 text-right text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wide">
							Rating
						</th>
						<th className="py-2.5 px-3 text-right text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wide">
							Total Transaksi
						</th>
					</tr>
				</thead>
				<tbody>
					{data.map((s, i) => (
						<tr key={i} className="border-b border-[#E8EEF2] last:border-0">
							<td className="py-2.5 px-3 text-[13px] text-[#0F172A] font-medium">
								{s.name}
							</td>
							<td className="py-2.5 px-3 text-right">
								<div className="flex items-center justify-end gap-1">
									<svg width="12" height="12" viewBox="0 0 24 24" fill="#F59E0B" stroke="none">
										<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
									</svg>
									<span className="text-[13px] font-semibold text-[#0F172A]">
										{s.rating?.toFixed(1) || "N/A"}
									</span>
								</div>
							</td>
							<td className="py-2.5 px-3 text-[13px] font-semibold text-[#0F172A] text-right">
								{formatCurrency(s.totalTransaction, { short: true })}
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

export default function BIPengadaan() {
	const [range, setRange] = useState("30d");
	const biData = useBIData(range);
	const proc = useBIPengadaan(biData);

	return (
		<div className="space-y-5">
			<div className="flex items-center justify-between">
				<div>
					<h2 className="font-display font-bold text-[#0F172A] text-[18px]">
						Modul Pengadaan & Supplier
					</h2>
					<p className="text-[12.5px] text-[#94A3B8] mt-0.5">
						Analisis pengadaan dan evaluasi vendor
					</p>
				</div>
				<DateRangeFilter value={range} onChange={setRange} />
			</div>

			<Card variant="standard" className="!p-6">
				<h3 className="font-display font-bold text-[#0F172A] text-[16px] mb-1">
					Status Pengadaan
				</h3>
				<p className="text-[12px] text-[#94A3B8] mb-4">
					Distribusi berdasarkan status
				</p>
				{proc.loading ? (
					<div className="space-y-2">
						{[1, 2, 3, 4].map((i) => (
							<div key={i} className="skel h-10 w-full rounded" />
						))}
					</div>
				) : (
					<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
						{proc.procurementByStatus.map((item) => (
							<ProcurementStatusRow key={item.status} status={item.status} count={item.count} />
						))}
					</div>
				)}
			</Card>

			<div className="grid lg:grid-cols-2 gap-5">
				<Card variant="standard" className="!p-6">
					<h3 className="font-display font-bold text-[#0F172A] text-[16px] mb-1">
						Total Pembelian per Supplier
					</h3>
					<p className="text-[12px] text-[#94A3B8] mb-4">
						Berdasarkan total transaksi pengadaan
					</p>
					{proc.loading ? (
						<div className="skel h-[200px] w-full rounded-lg" />
					) : proc.supplierPurchaseData.length === 0 ? (
						<div className="flex items-center justify-center h-[200px] text-[#94A3B8] text-[13px]">
							Tidak ada data supplier
						</div>
					) : (
						<BIBarChart
							data={proc.supplierPurchaseData}
							bars={[{ dataKey: "total", name: "Total Pembelian", color: "#398eb3" }]}
							xKey="supplierName"
							height={200}
						/>
					)}
				</Card>

				<Card variant="standard" className="!p-6">
					<h3 className="font-display font-bold text-[#0F172A] text-[16px] mb-3">
						Evaluasi Supplier
					</h3>
					<p className="text-[12px] text-[#94A3B8] mb-4">
						Rating vs total transaksi
					</p>
					{proc.loading ? (
						<div className="space-y-2">
							{[1, 2, 3, 4, 5].map((i) => (
								<div key={i} className="skel h-8 w-full rounded" />
							))}
						</div>
					) : (
						<SupplierEvalTable data={proc.supplierEvalData} />
					)}
				</Card>
			</div>

			<Card variant="standard" className="!p-6">
				<h3 className="font-display font-bold text-[#0F172A] text-[16px] mb-3">
					Top Supplier
				</h3>
				{proc.loading ? (
					<div className="space-y-2">
						{[1, 2, 3, 4, 5].map((i) => (
							<div key={i} className="skel h-8 w-full rounded" />
						))}
					</div>
				) : proc.supplierPurchaseData.length === 0 ? (
					<div className="py-6 text-center text-[13px] text-[#94A3B8]">
						Tidak ada data supplier
					</div>
				) : (
					proc.supplierPurchaseData.map((s, i) => (
						<SupplierPurchaseRow key={s.supplierId} supplier={s} rank={i + 1} />
					))
				)}
			</Card>
		</div>
	);
}
