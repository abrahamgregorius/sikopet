/** @format */

import { useState } from "react";
import DashboardLayout from "../../components/ui/DashboardLayout";
import SalesOverview from "./components/SalesOverview";
import SalesList from "./components/SalesList";
import SalesDetail from "./components/SalesDetail";
import SalesForm from "./components/SalesForm";

const MOCK_SALES = [
	{
		id: 1,
		date: "2026-07-10",
		invoice: "INV-2026-0892",
		customer: "Pelanggan Umum",
		items: 4,
		subtotal: 275000,
		tax: 30250,
		total: 305250,
		payment: "cash",
		status: "completed",
	},
	{
		id: 2,
		date: "2026-07-10",
		invoice: "INV-2026-0891",
		customer: "Toko Sembako Jaya",
		items: 12,
		subtotal: 1850000,
		tax: 203500,
		total: 2053500,
		payment: "transfer",
		status: "completed",
	},
	{
		id: 3,
		date: "2026-07-09",
		invoice: "INV-2026-0890",
		customer: "Warung Bu Rahma",
		items: 6,
		subtotal: 425000,
		tax: 46750,
		total: 471750,
		payment: "qris",
		status: "completed",
	},
	{
		id: 4,
		date: "2026-07-09",
		invoice: "INV-2026-0889",
		customer: "Pelanggan Umum",
		items: 2,
		subtotal: 96000,
		tax: 10560,
		total: 106560,
		payment: "cash",
		status: "completed",
	},
	{
		id: 5,
		date: "2026-07-08",
		invoice: "INV-2026-0888",
		customer: "PT Cahaya Mandiri",
		items: 20,
		subtotal: 4200000,
		tax: 462000,
		total: 4662000,
		payment: "transfer",
		status: "completed",
	},
	{
		id: 6,
		date: "2026-07-08",
		invoice: "INV-2026-0887",
		customer: "Toko Kita",
		items: 8,
		subtotal: 650000,
		tax: 71500,
		total: 721500,
		payment: "transfer",
		status: "pending",
	},
];

export default function PenjualanPage() {
	const [sales, setSales] = useState(MOCK_SALES);
	const [selectedSale, setSelectedSale] = useState(null);
	const [showForm, setShowForm] = useState(false);
	const [statusFilter, setStatusFilter] = useState("all");
	const [search, setSearch] = useState("");

	const filtered = sales.filter((s) => {
		const matchSearch =
			s.customer.toLowerCase().includes(search.toLowerCase()) ||
			s.invoice.toLowerCase().includes(search.toLowerCase());
		const matchStatus = statusFilter === "all" || s.status === statusFilter;
		return matchSearch && matchStatus;
	});

	const totalSales = sales
		.filter((s) => s.status === "completed")
		.reduce((sum, s) => sum + s.total, 0);
	const totalPending = sales
		.filter((s) => s.status === "pending")
		.reduce((sum, s) => sum + s.total, 0);
	const avgTransaction =
		totalSales / (sales.filter((s) => s.status === "completed").length || 1);

	const handleAdd = (data) => {
		const newSale = {
			id: sales.length + 1,
			...data,
			status: "completed",
			invoice: `INV-2026-${893 + sales.length}`,
		};
		setSales((prev) => [newSale, ...prev]);
		setShowForm(false);
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

				<SalesOverview
					totalSales={totalSales}
					totalPending={totalPending}
					transactionCount={
						sales.filter((s) => s.status === "completed").length
					}
					avgTransaction={avgTransaction}
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
