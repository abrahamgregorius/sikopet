/** @format */

import { useState } from "react";
import ModuleLayout from "../modules/ModuleLayout";
import ProcurementOverview from "./components/ProcurementOverview";
import ProcurementList from "./components/ProcurementList";
import ProcurementDetail from "./components/ProcurementDetail";
import ProcurementForm from "./components/ProcurementForm";

const MOCK_PROCUREMENTS = [
	{
		id: 1,
		date: "2026-07-10",
		supplier: "PT Sumber Makmur",
		product: "Beras Premium 5kg",
		quantity: 100,
		unitPrice: 68000,
		total: 6800000,
		status: "pending",
		method: "transfer",
	},
	{
		id: 2,
		date: "2026-07-09",
		supplier: "CV Tiga Dara",
		product: "Minyak Goreng 1L",
		quantity: 200,
		unitPrice: 16500,
		total: 3300000,
		status: "approved",
		method: "transfer",
	},
	{
		id: 3,
		date: "2026-07-08",
		supplier: "PT Berkah Tani",
		product: "Pupuk Organik 25kg",
		quantity: 50,
		unitPrice: 125000,
		total: 6250000,
		status: "received",
		method: "cash",
	},
	{
		id: 4,
		date: "2026-07-07",
		supplier: "UD Saujana",
		product: "Gula Pasir 50kg",
		quantity: 80,
		unitPrice: 13500,
		total: 1080000,
		status: "pending",
		method: "transfer",
	},
	{
		id: 5,
		date: "2026-07-06",
		supplier: "PT Sumber Makmur",
		product: "Telur Ayam 1kg",
		quantity: 150,
		unitPrice: 26000,
		total: 3900000,
		status: "received",
		method: "transfer",
	},
	{
		id: 6,
		date: "2026-07-05",
		supplier: "CV Tiga Dara",
		product: "Mie Instan",
		quantity: 500,
		unitPrice: 3200,
		total: 1600000,
		status: "rejected",
		method: "cash",
	},
];

export default function PengadaanPage() {
	const [procurements, setProcurements] = useState(MOCK_PROCUREMENTS);
	const [selectedProcurement, setSelectedProcurement] = useState(null);
	const [showForm, setShowForm] = useState(false);
	const [statusFilter, setStatusFilter] = useState("all");
	const [search, setSearch] = useState("");

	const filtered = procurements.filter((p) => {
		const matchSearch =
			p.supplier.toLowerCase().includes(search.toLowerCase()) ||
			p.product.toLowerCase().includes(search.toLowerCase());
		const matchStatus = statusFilter === "all" || p.status === statusFilter;
		return matchSearch && matchStatus;
	});

	const totalPengajuan = procurements
		.filter((p) => p.status === "pending")
		.reduce((sum, p) => sum + p.total, 0);
	const totalApproved = procurements
		.filter((p) => p.status === "approved")
		.reduce((sum, p) => sum + p.total, 0);
	const totalReceived = procurements
		.filter((p) => p.status === "received")
		.reduce((sum, p) => sum + p.total, 0);

	const handleAdd = (data) => {
		const newItem = { id: procurements.length + 1, ...data, status: "pending" };
		setProcurements((prev) => [newItem, ...prev]);
		setShowForm(false);
	};

	const handleApprove = (id) => {
		setProcurements((prev) =>
			prev.map((p) => (p.id === id ? { ...p, status: "approved" } : p)),
		);
		setSelectedProcurement(null);
	};

	const handleReceive = (id) => {
		setProcurements((prev) =>
			prev.map((p) => (p.id === id ? { ...p, status: "received" } : p)),
		);
		setSelectedProcurement(null);
	};

	return (
		<ModuleLayout>
			<div className="space-y-6">
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
					<div>
						<h1 className="font-display font-extrabold text-[28px] text-[#0F172A] tracking-tight">
							Pengadaan
						</h1>
						<p className="text-[14px] text-[#475569] mt-1">
							Pengelolaan Pengadaan Barang
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

				<ProcurementOverview
					totalPengajuan={totalPengajuan}
					totalApproved={totalApproved}
					totalReceived={totalReceived}
					pendingCount={
						procurements.filter((p) => p.status === "pending").length
					}
					approvedCount={
						procurements.filter((p) => p.status === "approved").length
					}
				/>

				<div className="grid lg:grid-cols-[1fr_360px] gap-6">
					<ProcurementList
						procurements={filtered}
						search={search}
						statusFilter={statusFilter}
						onSearch={setSearch}
						onFilter={setStatusFilter}
						onSelect={setSelectedProcurement}
						selectedId={selectedProcurement?.id}
					/>

					{selectedProcurement ? (
						<ProcurementDetail
							procurement={selectedProcurement}
							onClose={() => setSelectedProcurement(null)}
							onApprove={handleApprove}
							onReceive={handleReceive}
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
									<path d="M1 3h15v13H1zM16 8h4l3 3v5h-7V8z" />
									<circle cx="5.5" cy="18.5" r="2.5" />
									<circle cx="18.5" cy="18.5" r="2.5" />
								</svg>
							</div>
							<p className="text-[14px] text-[#94A3B8]">
								Pilih pengadaan untuk melihat detail
							</p>
						</div>
					)}
				</div>
			</div>

			{showForm && (
				<ProcurementForm
					onClose={() => setShowForm(false)}
					onSubmit={handleAdd}
				/>
			)}
		</ModuleLayout>
	);
}
