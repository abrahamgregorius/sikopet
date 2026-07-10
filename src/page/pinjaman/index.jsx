/** @format */

import { useState } from "react";
import ModuleLayout from "../modules/ModuleLayout";
import LoanPortfolio from "./components/LoanPortfolio";
import LoanList from "./components/LoanList";
import LoanDetail from "./components/LoanDetail";
import LoanApplicationForm from "./components/LoanApplicationForm";

const MOCK_LOANS = [
	{ id: 1, member: "Rina Wulandari", principal: 10000000, rate: 1.2, tenor: 12, startDate: "2026-01-15", status: "active", paid: 3400000, pending: 0 },
	{ id: 2, member: "Bambang Sutrisno", principal: 20000000, rate: 1.2, tenor: 24, startDate: "2025-11-20", status: "active", paid: 8500000, pending: 500000 },
	{ id: 3, member: "Ahmad Hidayat", principal: 5000000, rate: 1.5, tenor: 6, startDate: "2026-04-10", status: "active", paid: 3000000, pending: 0 },
	{ id: 4, member: "Dewi Lestari", principal: 15000000, rate: 1.2, tenor: 18, startDate: "2026-03-05", status: "pending", paid: 0, pending: 0 },
	{ id: 5, member: "Nur Hasanah", principal: 8000000, rate: 1.2, tenor: 12, startDate: "2026-02-28", status: "active", paid: 4000000, pending: 0 },
	{ id: 6, member: "Joko Pramono", principal: 12000000, rate: 1.5, tenor: 15, startDate: "2026-05-12", status: "pending", paid: 0, pending: 0 },
	{ id: 7, member: "Made Ayu Kartika", principal: 6000000, rate: 1.2, tenor: 8, startDate: "2025-12-01", status: "completed", paid: 6000000, pending: 0 },
	{ id: 8, member: "Siti Aminah", principal: 3000000, rate: 1.5, tenor: 6, startDate: "2025-09-15", status: "completed", paid: 3000000, pending: 0 },
];

export default function PinjamanPage() {
	const [loans, setLoans] = useState(MOCK_LOANS);
	const [selectedLoan, setSelectedLoan] = useState(null);
	const [showForm, setShowForm] = useState(false);
	const [statusFilter, setStatusFilter] = useState("all");

	const filtered = loans.filter((l) => {
		return statusFilter === "all" || l.status === statusFilter;
	});

	const activeLoans = loans.filter((l) => l.status === "active");
	const totalOutstanding = activeLoans.reduce((sum, l) => sum + (l.principal - l.paid), 0);
	const totalPending = loans.filter((l) => l.status === "pending").reduce((sum, l) => sum + l.principal, 0);

	const handleAddLoan = (data) => {
		const newLoan = {
			id: loans.length + 1,
			...data,
			status: "pending",
			paid: 0,
			pending: 0,
		};
		setLoans((prev) => [newLoan, ...prev]);
		setShowForm(false);
	};

	const handleApprove = (id) => {
		setLoans((prev) =>
			prev.map((l) =>
				l.id === id ? { ...l, status: "active", startDate: new Date().toISOString().split("T")[0] } : l
			)
		);
		setSelectedLoan(null);
	};

	return (
		<ModuleLayout>
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
						className="focus-ring inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#398EB3] text-white font-semibold text-[14.5px] shadow-glow hover:bg-[#2F7A9A] hover:-translate-y-0.5 transition-all"
					>
						<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
					/>

					{selectedLoan ? (
						<LoanDetail
							loan={selectedLoan}
							onClose={() => setSelectedLoan(null)}
							onApprove={handleApprove}
						/>
					) : (
						<div className="rounded-2xl bg-white border border-[#D8E4EA] shadow-soft p-8 flex flex-col items-center justify-center text-center">
							<div className="w-14 h-14 rounded-full bg-[#F1F5F9] grid place-items-center mb-4">
								<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="1.8">
									<path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
								</svg>
							</div>
							<p className="text-[14px] text-[#94A3B8]">Pilih pinjaman untuk melihat detail</p>
						</div>
					)}
				</div>
			</div>

			{showForm && (
				<LoanApplicationForm onClose={() => setShowForm(false)} onSubmit={handleAddLoan} />
			)}
		</ModuleLayout>
	);
}
