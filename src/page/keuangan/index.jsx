/** @format */

import { useState, useEffect } from "react";
import ModuleLayout from "../modules/ModuleLayout";
import FinanceOverview from "./components/FinanceOverview";
import TransactionTable from "./components/TransactionTable";
import IncomeExpenseChart from "./components/IncomeExpenseChart";
import CategoryBreakdown from "./components/CategoryBreakdown";
import { db } from "../../database/db";

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
						<button className="focus-ring inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#E5E7EB] bg-white text-[#0F172A] font-semibold text-[14px] hover:bg-white transition-all">
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
					loading={loading}
				/>
			</div>
		</ModuleLayout>
	);
}
