/** @format */

import { useState } from "react";
import { Card, Badge } from "../../../components/ui";
import { useBIData, useBIInventori } from "../../../hooks/useBIData.jsx";
import { formatCurrency, formatDate } from "../../../utils/formatCurrency.js";
import DateRangeFilter from "./DateRangeFilter.jsx";
import { BIBarChart } from "./BICharts.jsx";

function StockRow({ item }) {
	const isCritical = item.stock === 0;
	const isWarning = !isCritical && item.stock <= item.minimumStock;

	return (
		<tr className={`${isCritical ? "bg-[#FEE2E2]/40" : isWarning ? "bg-[#FEF3C7]/40" : ""} border-b border-[#E8EEF2] last:border-0`}>
			<td className="py-2.5 px-3 text-[13px] text-[#0F172A] font-medium">
				{item.productName}
			</td>
			<td className="py-2.5 px-3 text-[12px] text-[#475569]">
				{item.category}
			</td>
			<td className="py-2.5 px-3 text-[13px] text-[#0F172A] font-semibold text-right">
				{formatCurrency(item.price, { short: true })}
			</td>
			<td className="py-2.5 px-3 text-right">
				<Badge variant={isCritical ? "danger" : isWarning ? "warning" : "success"}>
					{item.stock} {item.unit || "pcs"}
				</Badge>
			</td>
			<td className="py-2.5 px-3 text-[12px] text-[#475569] text-right">
				Min: {item.minimumStock}
			</td>
			<td className="py-2.5 px-3 text-right">
				{isCritical ? (
					<Badge variant="danger">Habis</Badge>
				) : isWarning ? (
					<Badge variant="warning">Menipis</Badge>
				) : (
					<Badge variant="success">Adekuat</Badge>
				)}
			</td>
		</tr>
	);
}

function NotRestockedList({ items }) {
	if (!items?.length) {
		return (
			<div className="py-6 text-center text-[13px] text-[#94A3B8]">
				Tidak ada data
			</div>
		);
	}

	return (
		<div className="space-y-2">
			{items.map((item) => (
				<div key={item.id} className="flex items-center justify-between py-2 border-b border-[#E8EEF2] last:border-0">
					<div className="min-w-0 pr-3">
						<p className="text-[13px] font-semibold text-[#0F172A] truncate">
							{item.productName}
						</p>
						<p className="text-[11px] text-[#94A3B8]">
							{item.location || "Tanpa lokasi"}
						</p>
					</div>
					<div className="flex flex-col items-end flex-shrink-0">
						<p className="text-[12px] font-semibold text-[#EF4444]">
							{formatDate(item.lastRestockDate, { format: "short" })}
						</p>
						<p className="text-[10px] text-[#94A3B8]">Terakhir restock</p>
					</div>
				</div>
			))}
		</div>
	);
}

export default function BIInventori() {
	const [range, setRange] = useState("30d");
	const biData = useBIData(range);
	const inv = useBIInventori(biData);

	return (
		<div className="space-y-5">
			<div className="flex items-center justify-between">
				<div>
					<h2 className="font-display font-bold text-[#0F172A] text-[18px]">
						Modul Inventori & Gudang
					</h2>
					<p className="text-[12.5px] text-[#94A3B8] mt-0.5">
						Analisis stok dan inventori barang
					</p>
				</div>
				<DateRangeFilter value={range} onChange={setRange} />
			</div>

			<div className="grid lg:grid-cols-2 gap-5">
				<Card variant="standard" className="!p-6">
					<h3 className="font-display font-bold text-[#0F172A] text-[16px] mb-1">
						Nilai Inventori per Kategori
					</h3>
					<p className="text-[12px] text-[#94A3B8] mb-4">
						Stock × Harga per kategori
					</p>
					{inv.loading ? (
						<div className="skel h-[200px] w-full rounded-lg" />
					) : inv.categoryData.length === 0 ? (
						<div className="flex items-center justify-center h-[200px] text-[#94A3B8] text-[13px]">
							Tidak ada data inventori
						</div>
					) : (
						<BIBarChart
							data={inv.categoryData}
							bars={[{ dataKey: "value", name: "Nilai", color: "#398eb3" }]}
							xKey="category"
							height={200}
						/>
					)}
				</Card>

				<Card variant="standard" className="!p-6">
					<h3 className="font-display font-bold text-[#0F172A] text-[16px] mb-1">
						Barang Tidak Direstock
					</h3>
					<p className="text-[12px] text-[#94A3B8] mb-4">
						Produk paling lama tidak direstock
					</p>
					{inv.loading ? (
						<div className="space-y-2">
							{[1, 2, 3, 4, 5].map((i) => (
								<div key={i} className="skel h-10 w-full rounded" />
							))}
						</div>
					) : (
						<NotRestockedList items={inv.notRestocked} />
					)}
				</Card>
			</div>

			<Card variant="standard" className="!p-6">
				<div className="flex items-center justify-between mb-4">
					<div>
						<h3 className="font-display font-bold text-[#0F172A] text-[16px]">
							Daftar Stok
						</h3>
						<p className="text-[12px] text-[#94A3B8] mt-0.5">
							{inv.loading
								? "Memuat..."
								: `${inv.inventory.length} item`}
						</p>
					</div>
					<div className="flex gap-3 text-[11px]">
						<span className="flex items-center gap-1">
							<span className="w-2 h-2 rounded-sm bg-[#EF4444]" />Habis
						</span>
						<span className="flex items-center gap-1">
							<span className="w-2 h-2 rounded-sm bg-[#F59E0B]" />Menipis
						</span>
						<span className="flex items-center gap-1">
							<span className="w-2 h-2 rounded-sm bg-[#22C55E]" />Adekuat
						</span>
					</div>
				</div>

				{inv.loading ? (
					<div className="space-y-2">
						{[1, 2, 3, 4, 5].map((i) => (
							<div key={i} className="skel h-12 w-full rounded" />
						))}
					</div>
				) : inv.inventory.length === 0 ? (
					<div className="py-8 text-center text-[13px] text-[#94A3B8]">
						Tidak ada data inventori
					</div>
				) : (
					<div className="overflow-x-auto">
						<table className="w-full min-w-[600px]">
							<thead>
								<tr className="border-b border-[#E5E7EB]">
									<th className="py-2.5 px-3 text-left text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wide">
										Produk
									</th>
									<th className="py-2.5 px-3 text-left text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wide">
										Kategori
									</th>
									<th className="py-2.5 px-3 text-right text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wide">
										Harga
									</th>
									<th className="py-2.5 px-3 text-right text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wide">
										Stok
									</th>
									<th className="py-2.5 px-3 text-right text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wide">
										Min.
									</th>
									<th className="py-2.5 px-3 text-right text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wide">
										Status
									</th>
								</tr>
							</thead>
							<tbody>
								{inv.inventory.map((item) => (
									<StockRow key={item.id} item={item} />
								))}
							</tbody>
						</table>
					</div>
				)}
			</Card>
		</div>
	);
}
