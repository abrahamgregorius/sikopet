/** @format */

import { useState } from "react";
import ModuleLayout from "../modules/ModuleLayout";
import FinanceOverview from "./components/FinanceOverview";
import TransactionTable from "./components/TransactionTable";
import IncomeExpenseChart from "./components/IncomeExpenseChart";
import CategoryBreakdown from "./components/CategoryBreakdown";

const MOCK_TRANSACTIONS = [
	{
		id: 1,
		date: "2026-07-10",
		description: "Penjualan Toko Sembako",
		category: "income",
		amount: 2750000,
		method: "cash",
	},
	{
		id: 2,
		date: "2026-07-10",
		description: "Setoran Simpanan Wajib - Rina",
		category: "income",
		amount: 500000,
		method: "transfer",
	},
	{
		id: 3,
		date: "2026-07-09",
		description: "Pembelian Stok Barang",
		category: "expense",
		amount: 1850000,
		method: "transfer",
	},
	{
		id: 4,
		date: "2026-07-09",
		description: "Gaji Karyawan",
		category: "expense",
		amount: 8500000,
		method: "transfer",
	},
	{
		id: 5,
		date: "2026-07-08",
		description: "Angsuran Pinjaman - Bambang",
		category: "income",
		amount: 950000,
		method: "transfer",
	},
	{
		id: 6,
		date: "2026-07-08",
		description: "Listrik & Internet",
		category: "expense",
		amount: 750000,
		method: "transfer",
	},
	{
		id: 7,
		date: "2026-07-07",
		description: "Bunga Simpanan Anggota",
		category: "expense",
		amount: 425000,
		method: "transfer",
	},
	{
		id: 8,
		date: "2026-07-07",
		description: "Penjualan Grosir",
		category: "income",
		amount: 4200000,
		method: "transfer",
	},
	{
		id: 9,
		date: "2026-07-06",
		description: "Transport & Logistik",
		category: "expense",
		amount: 1200000,
		method: "cash",
	},
	{
		id: 10,
		date: "2026-07-06",
		description: "Penarikan Simpanan - Made",
		category: "expense",
		amount: 200000,
		method: "cash",
	},
];

export default function KeuanganPage() {
	const [transactions] = useState(MOCK_TRANSACTIONS);
	const [search, setSearch] = useState("");
	const [categoryFilter, setCategoryFilter] = useState("all");

	const filtered = transactions.filter((t) => {
		const matchSearch = t.description
			.toLowerCase()
			.includes(search.toLowerCase());
		const matchCat = categoryFilter === "all" || t.category === categoryFilter;
		return matchSearch && matchCat;
	});

	const totalIncome = transactions
		.filter((t) => t.category === "income")
		.reduce((sum, t) => sum + t.amount, 0);
	const totalExpense = transactions
		.filter((t) => t.category === "expense")
		.reduce((sum, t) => sum + t.amount, 0);
	const netBalance = totalIncome - totalExpense;

	const incomeByCategory = {};
	const expenseByCategory = {};
	transactions.forEach((t) => {
		if (t.category === "income") {
			incomeByCategory[t.description.split(" ")[0]] =
				(incomeByCategory[t.description.split(" ")[0]] || 0) + t.amount;
		} else {
			expenseByCategory[t.description.split(" ")[0]] =
				(expenseByCategory[t.description.split(" ")[0]] || 0) + t.amount;
		}
	});

	return (
		<ModuleLayout>
			<div className="space-y-6">
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
					<div>
						<h1 className="font-display font-extrabold text-[28px] text-[#0F172A] tracking-tight">
							Keuangan
						</h1>
						<p className="text-[14px] text-[#475569] mt-1">
							Laporan Keuangan & Arus Kas
						</p>
					</div>
					<div className="flex gap-3">
						<button className="focus-ring inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#D8E4EA] bg-white text-[#0F172A] font-semibold text-[14px] hover:bg-white hover:shadow-soft transition-all">
							<svg
								width="15"
								height="15"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
							>
								<path
									d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"
									strokeLinecap="round"
								/>
							</svg>
							Export
						</button>
					</div>
				</div>

				<FinanceOverview
					totalIncome={totalIncome}
					totalExpense={totalExpense}
					netBalance={netBalance}
				/>

				<div className="grid lg:grid-cols-2 gap-6">
					<IncomeExpenseChart
						totalIncome={totalIncome}
						totalExpense={totalExpense}
					/>
					<CategoryBreakdown
						income={incomeByCategory}
						expense={expenseByCategory}
						totalIncome={totalIncome}
						totalExpense={totalExpense}
					/>
				</div>

				<TransactionTable
					transactions={filtered}
					search={search}
					categoryFilter={categoryFilter}
					onSearch={setSearch}
					onFilter={setCategoryFilter}
				/>
			</div>
		</ModuleLayout>
	);
}
