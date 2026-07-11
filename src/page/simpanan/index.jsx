/** @format */

import { useState, useEffect } from "react";
import ModuleLayout from "../modules/ModuleLayout";
import SavingsByMember from "./components/SavingsByMember";
import SavingsForm from "./components/SavingsForm";
import SavingsOverview from "./components/SavingsOverview";
import TransactionList from "./components/TransactionList";
import { db } from "../../database/db";

export default function SimpananPage() {
	const [transactions, setTransactions] = useState([]);
	const [showForm, setShowForm] = useState(false);
	const [formType, setFormType] = useState("deposit");
	const [search, setSearch] = useState("");
	const [typeFilter, setTypeFilter] = useState("all");
	const [loading, setLoading] = useState(true);

	const loadData = async () => {
		setLoading(true);
		try {
			const [savingsData, membersData] = await Promise.all([
				db.savings.reverse().toArray(),
				db.members.toArray(),
			]);
			const memberMap = {};
			membersData.forEach((m) => {
				memberMap[m.id] = m.name;
			});
			const enrichedData = savingsData.map((s) => ({
				...s,
				member: memberMap[s.memberId] || "Unknown",
				date: s.createdAt
					? new Date(s.createdAt).toLocaleDateString("id-ID")
					: "-",
			}));
			setTransactions(enrichedData);
		} catch (err) {
			console.error("[Simpanan] Failed to load data:", err);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadData();
	}, []);

	const filtered = transactions.filter((t) => {
		const matchSearch = (t.member || "")
			.toLowerCase()
			.includes(search.toLowerCase());
		const matchType = typeFilter === "all" || t.type === typeFilter;
		return matchSearch && matchType;
	});

	const totalSimpanan = transactions
		.filter((t) => t.type === "deposit" || t.type === "interest")
		.reduce((sum, t) => sum + (t.amount || 0), 0);
	const totalPenarikan = transactions
		.filter((t) => t.type === "withdrawal")
		.reduce((sum, t) => sum + (t.amount || 0), 0);
	const netSimpanan = totalSimpanan - totalPenarikan;

	const handleAddTransaction = async (data) => {
		try {
			await db.savings.add({
				memberId: data.memberId,
				type: formType,
				amount: data.amount,
				description: data.description || "",
				createdAt: new Date().toISOString(),
			});
			await loadData();
			setShowForm(false);
		} catch (err) {
			console.error("[Simpanan] Failed to add transaction:", err);
		}
	};

	return (
		<ModuleLayout>
			<div className="space-y-6">
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
					<div>
						<h1 className="font-display font-extrabold text-[28px] text-[#0F172A] tracking-tight">
							Simpanan
						</h1>
						<p className="text-[14px] text-[#475569] mt-1">
							Pengelolaan Simpanan Anggota
						</p>
					</div>
					<div className="flex gap-3">
						<button
							onClick={() => {
								setFormType("deposit");
								setShowForm(true);
							}}
							className="focus-ring inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#E5E7EB] bg-white text-[#0F172A] font-semibold text-[14px] hover:bg-white transition-all"
						>
							<svg
								width="15"
								height="15"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
							>
								<path d="M12 5v14M5 12h14" strokeLinecap="round" />
							</svg>
							Setoran
						</button>
						<button
							onClick={() => {
								setFormType("withdrawal");
								setShowForm(true);
							}}
							className="focus-ring inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#E5E7EB] bg-white text-[#0F172A] font-semibold text-[14px] hover:bg-white transition-all"
						>
							<svg
								width="15"
								height="15"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
							>
								<path d="M12 19V5M5 12l7-7 7 7" strokeLinecap="round" />
							</svg>
							Penarikan
						</button>
					</div>
				</div>

				<SavingsOverview
					totalSimpanan={totalSimpanan}
					totalPenarikan={totalPenarikan}
					netSimpanan={netSimpanan}
				/>

				<div className="grid lg:grid-cols-[1fr_340px] gap-6">
					<TransactionList
						transactions={filtered}
						search={search}
						typeFilter={typeFilter}
						onSearch={setSearch}
						onFilter={setTypeFilter}
						loading={loading}
					/>

					<SavingsByMember transactions={transactions} />
				</div>
			</div>

			{showForm && (
				<SavingsForm
					type={formType}
					onClose={() => setShowForm(false)}
					onSubmit={handleAddTransaction}
				/>
			)}
		</ModuleLayout>
	);
}
