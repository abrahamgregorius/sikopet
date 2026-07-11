/** @format */

import { useState, useEffect } from "react";
import DashboardLayout from "../../components/ui/DashboardLayout";
import SalesOverview from "./components/SalesOverview";
import SalesList from "./components/SalesList";
import SalesDetail from "./components/SalesDetail";
import SalesForm from "./components/SalesForm";
import { exportSalesToCSV, exportSalesToExcel } from "../../lib/exportUtils";
import { db } from "../../database/db";

export default function PenjualanPage() {
	const [sales, setSales] = useState([]);
	const [loading, setLoading] = useState(true);
	const [selectedSale, setSelectedSale] = useState(null);
	const [showForm, setShowForm] = useState(false);
	const [statusFilter, setStatusFilter] = useState("all");
	const [search, setSearch] = useState("");

	const loadData = async () => {
		setLoading(true);
		try {
			const data = await db.transactions
				.where("type")
				.equals("sale")
				.reverse()
				.toArray();
			const enrichedData = data.map((t) => ({
				id: t.id,
				invoice: t.invoice || `TX-${t.id}`,
				date: t.createdAt ? new Date(t.createdAt).toLocaleDateString("id-ID") : "-",
				customer: t.customer || "Pelanggan",
				items: t.items?.length || 0,
				subtotal: t.subtotal || 0,
				tax: t.tax || 0,
				total: t.total || 0,
				payment: t.paymentMethod || "cash",
				status: t.status || "completed",
			}));
			setSales(enrichedData);
		} catch (err) {
			console.error("[Penjualan] Failed to load data:", err);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadData();
	}, []);

	const filtered = sales.filter((s) => {
		const matchSearch =
			(s.customer || "").toLowerCase().includes(search.toLowerCase()) ||
			(s.invoice || "").toLowerCase().includes(search.toLowerCase());
		const matchStatus = statusFilter === "all" || s.status === statusFilter;
		return matchSearch && matchStatus;
	});

	const totalSales = sales
		.filter((s) => s.status === "completed")
		.reduce((sum, s) => sum + (s.total || 0), 0);
	const totalPending = sales
		.filter((s) => s.status === "pending")
		.reduce((sum, s) => sum + (s.total || 0), 0);
	const completedCount = sales.filter((s) => s.status === "completed").length;
	const avgTransaction = completedCount > 0 ? totalSales / completedCount : 0;

	const handleAdd = async (data) => {
		try {
			const subtotal = Number(data.subtotal);
			const tax = Math.round(subtotal * 0.11);
			await db.transactions.add({
				type: "sale",
				invoice: `INV-${new Date().getFullYear()}-${String(sales.length + 1).padStart(4, "0")}`,
				customer: data.customer,
				items: Number(data.items),
				subtotal,
				tax,
				total: subtotal + tax,
				paymentMethod: data.payment,
				status: "completed",
				createdAt: new Date().toISOString(),
			});
			await loadData();
			setShowForm(false);
		} catch (err) {
			console.error("[Penjualan] Failed to add transaction:", err);
		}
	};

	return (
		<DashboardLayout>
			<div className="space-y-6">
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
					<div>
						<h1 className="font-display font-extrabold text-[28px] text-[#0F172A] tracking-tight">
							Penjualan
						</h1>
						<p className="text-[14px] text-[#475569] mt-1">
							Riwayat & Statistik Penjualan
						</p>
					</div>
					<div className="flex gap-3">
						<div className="relative group">
							<button
								className="focus-ring inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#E5E7EB] bg-white text-[#475569] font-semibold text-[14px] hover:bg-[#F1F5F9] transition-colors"
							>
								<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
									<path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" strokeLinecap="round" />
								</svg>
								Export
								<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
									<path d="M6 9l6 6 6-6" strokeLinecap="round" />
								</svg>
							</button>
							<div className="absolute right-0 top-full mt-1 w-40 rounded-lg border border-[#E5E7EB] bg-white shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
								<button
									onClick={() => exportSalesToCSV(sales)}
									disabled={sales.length === 0}
									className="w-full text-left px-4 py-2.5 text-[13px] text-[#374151] hover:bg-[#F1F5F9] transition-colors first:rounded-t-lg last:rounded-b-lg disabled:opacity-50 disabled:cursor-not-allowed"
								>
									Export as CSV
								</button>
								<button
									onClick={() => exportSalesToExcel(sales)}
									disabled={sales.length === 0}
									className="w-full text-left px-4 py-2.5 text-[13px] text-[#374151] hover:bg-[#F1F5F9] transition-colors first:rounded-t-lg last:rounded-b-lg disabled:opacity-50 disabled:cursor-not-allowed"
								>
									Export as Excel
								</button>
							</div>
						</div>
						<button
							onClick={() => setShowForm(true)}
							className="focus-ring inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#398EB3] text-white font-semibold text-[14.5px] hover:bg-[#2F7A9A] hover:-translate-y-0.5 transition-all"
						>
							<svg
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
							>
								<path d="M12 5v14M5 12h14" strokeLinecap="round" />
							</svg>
							Transaksi Baru
						</button>
					</div>
				</div>

				<SalesOverview
					totalSales={totalSales}
					totalPending={totalPending}
					transactionCount={completedCount}
					avgTransaction={avgTransaction}
					loading={loading}
				/>

				<div className="grid lg:grid-cols-[1fr_360px] gap-6">
					<SalesList
						sales={filtered}
						search={search}
						statusFilter={statusFilter}
						onSearch={setSearch}
						onFilter={setStatusFilter}
						onSelect={setSelectedSale}
						selectedId={selectedSale?.id}
						loading={loading}
					/>

					{selectedSale ? (
						<SalesDetail
							sale={selectedSale}
							onClose={() => setSelectedSale(null)}
						/>
					) : (
						<div className="rounded-lg bg-white border border-[#E5E7EB] p-8 flex flex-col items-center justify-center text-center">
							<div className="w-14 h-14 rounded-lg bg-[#F1F5F9] grid place-items-center mb-4">
								<svg
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									stroke="#94A3B8"
									strokeWidth="1.8"
								>
									<rect x="2" y="5" width="20" height="14" rx="2" />
									<path d="M2 10h20" />
								</svg>
							</div>
							<p className="text-[14px] text-[#94A3B8]">
								Pilih transaksi untuk melihat detail
							</p>
						</div>
					)}
				</div>
			</div>

			{showForm && (
				<SalesForm onClose={() => setShowForm(false)} onSubmit={handleAdd} />
			)}
		</DashboardLayout>
	);
}
