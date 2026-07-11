/** @format */

import { useState, useEffect } from "react";
import DashboardLayout from "../../components/ui/DashboardLayout";
import FinanceOverview from "./components/FinanceOverview";
import TransactionTable from "./components/TransactionTable";
import IncomeExpenseChart from "./components/IncomeExpenseChart";
import CategoryBreakdown from "./components/CategoryBreakdown";
import { db } from "../../database/db";
import { exportFinanceToCSV, exportFinanceToExcel } from "../../lib/exportUtils";

export default function KeuanganPage() {
	const [transactions, setTransactions] = useState([]);
	const [search, setSearch] = useState("");
	const [categoryFilter, setCategoryFilter] = useState("all");
	const [loading, setLoading] = useState(true);

	const loadData = async () => {
		setLoading(true);
		try {
			const data = await db.transactions
				.where("type")
				.anyOf(["income", "expense"])
				.reverse()
				.toArray();
			const enrichedData = data.map((t) => ({
				...t,
				amount: t.totalAmount || 0,
				category: t.type,
				date: t.date ? new Date(t.date).toLocaleDateString("id-ID") : "-",
			}));
			setTransactions(enrichedData);
		} catch (err) {
			console.error("[Keuangan] Failed to load data:", err);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadData();
	}, []);

	const filtered = transactions.filter((t) => {
		const matchSearch = (t.description || "")
			.toLowerCase()
			.includes(search.toLowerCase());
		const matchCat = categoryFilter === "all" || t.category === categoryFilter;
		return matchSearch && matchCat;
	});

	const totalIncome = transactions
		.filter((t) => t.type === "income")
		.reduce((sum, t) => sum + (t.amount || 0), 0);
	const totalExpense = transactions
		.filter((t) => t.type === "expense")
		.reduce((sum, t) => sum + (t.amount || 0), 0);
	const netBalance = totalIncome - totalExpense;

	const incomeByCategory = {};
	const expenseByCategory = {};
	transactions.forEach((t) => {
		const amount = t.amount || 0;
		const key = (t.description || t.type || "Other").split(" ")[0];
		if (t.type === "income") {
			incomeByCategory[key] = (incomeByCategory[key] || 0) + amount;
		} else {
			expenseByCategory[key] = (expenseByCategory[key] || 0) + amount;
		}
	});

	return (
		<DashboardLayout>
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
									onClick={() => exportFinanceToCSV(transactions)}
									disabled={transactions.length === 0}
									className="w-full text-left px-4 py-2.5 text-[13px] text-[#374151] hover:bg-[#F1F5F9] transition-colors first:rounded-t-lg last:rounded-b-lg disabled:opacity-50 disabled:cursor-not-allowed"
								>
									Export as CSV
								</button>
								<button
									onClick={() => exportFinanceToExcel(transactions)}
									disabled={transactions.length === 0}
									className="w-full text-left px-4 py-2.5 text-[13px] text-[#374151] hover:bg-[#F1F5F9] transition-colors first:rounded-t-lg last:rounded-b-lg disabled:opacity-50 disabled:cursor-not-allowed"
								>
									Export as Excel
								</button>
							</div>
						</div>
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
					loading={loading}
				/>
			</div>
		</DashboardLayout>
	);
}
