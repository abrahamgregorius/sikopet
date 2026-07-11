/** @format */

import { useState, useEffect } from "react";
import DashboardLayout from "../../components/ui/DashboardLayout";
import LoanPortfolio from "./components/LoanPortfolio";
import LoanList from "./components/LoanList";
import LoanDetail from "./components/LoanDetail";
import LoanApplicationForm from "./components/LoanApplicationForm";
import { db } from "../../database/db";
import { exportLoansToCSV, exportLoansToExcel } from "../../lib/exportUtils";

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
									onClick={() => exportLoansToCSV(loans)}
									disabled={loans.length === 0}
									className="w-full text-left px-4 py-2.5 text-[13px] text-[#374151] hover:bg-[#F1F5F9] transition-colors first:rounded-t-lg last:rounded-b-lg disabled:opacity-50 disabled:cursor-not-allowed"
								>
									Export as CSV
								</button>
								<button
									onClick={() => exportLoansToExcel(loans)}
									disabled={loans.length === 0}
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
							Pengajuan Baru
						</button>
					</div>
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
