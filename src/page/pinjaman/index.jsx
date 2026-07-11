/** @format */

import { useState, useEffect } from "react";
import DashboardLayout from "../../components/ui/DashboardLayout";
import LoanPortfolio from "./components/LoanPortfolio";
import LoanList from "./components/LoanList";
import LoanDetail from "./components/LoanDetail";
import LoanApplicationForm from "./components/LoanApplicationForm";
import { db } from "../../database/db";

export default function PinjamanPage() {
	const [loans, setLoans] = useState([]);
	const [selectedLoan, setSelectedLoan] = useState(null);
	const [showForm, setShowForm] = useState(false);
	const [statusFilter, setStatusFilter] = useState("all");
	const [loading, setLoading] = useState(true);

	const loadData = async () => {
		setLoading(true);
		try {
			const [loansData, membersData] = await Promise.all([
				db.loans.toArray(),
				db.members.toArray(),
			]);
			const memberMap = {};
			membersData.forEach((m) => {
				memberMap[m.id] = m.name;
			});
			const enrichedData = loansData.map((l) => ({
				...l,
				member: memberMap[l.memberId] || "Unknown",
				paid: l.paidAmount || 0,
				rate: l.interestRate || 0,
				tenor: l.tenorMonths || 0,
			}));
			setLoans(enrichedData);
		} catch (err) {
			console.error("[Pinjaman] Failed to load data:", err);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadData();
	}, []);

	const filtered = loans.filter((l) => {
		return statusFilter === "all" || l.status === statusFilter;
	});

	const activeLoans = loans.filter((l) => l.status === "active");
	const totalOutstanding = activeLoans.reduce(
		(sum, l) => sum + ((l.principal || 0) - (l.paidAmount || l.paid || 0)),
		0,
	);
	const totalPending = loans
		.filter((l) => l.status === "pending")
		.reduce((sum, l) => sum + (l.principal || 0), 0);

	const handleAddLoan = async (data) => {
		try {
			await db.loans.add({
				memberId: data.memberId,
				principal: data.principal,
				interestRate: data.interestRate || 10,
				tenorMonths: data.tenorMonths,
				status: "pending",
				paidAmount: 0,
				remainingAmount: data.principal,
				createdAt: new Date().toISOString(),
			});
			await loadData();
			setShowForm(false);
		} catch (err) {
			console.error("[Pinjaman] Failed to add loan:", err);
		}
	};

	const handleApprove = async (id) => {
		try {
			await db.loans.update(id, {
				status: "active",
				startDate: new Date().toISOString().split("T")[0],
			});
			await loadData();
			setSelectedLoan(null);
		} catch (err) {
			console.error("[Pinjaman] Failed to approve loan:", err);
		}
	};

	return (
		<DashboardLayout>
			<div className="space-y-6">
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
					<div>
						<h1 className="font-display font-extrabold text-[28px] text-[#0F172A] tracking-tight">
							Pinjaman
						</h1>
						<p className="text-[14px] text-[#475569] mt-1">
							Pengelolaan Pinjaman Anggota
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
						Pengajuan Baru
					</button>
				</div>

				<LoanPortfolio
					totalOutstanding={totalOutstanding}
					totalPending={totalPending}
					activeCount={activeLoans.length}
					completedCount={loans.filter((l) => l.status === "completed").length}
				/>

				<div className="grid lg:grid-cols-[1fr_360px] gap-6">
					<LoanList
						loans={filtered}
						statusFilter={statusFilter}
						onFilter={setStatusFilter}
						onSelect={setSelectedLoan}
						selectedId={selectedLoan?.id}
						loading={loading}
					/>

					{selectedLoan ? (
						<LoanDetail
							loan={selectedLoan}
							onClose={() => setSelectedLoan(null)}
							onApprove={handleApprove}
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
									<path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
								</svg>
							</div>
							<p className="text-[14px] text-[#94A3B8]">
								Pilih pinjaman untuk melihat detail
							</p>
						</div>
					)}
				</div>
			</div>

			<LoanApplicationForm
				open={showForm}
				onClose={() => setShowForm(false)}
				onSubmit={handleAddLoan}
			/>
		</DashboardLayout>
	);
}
