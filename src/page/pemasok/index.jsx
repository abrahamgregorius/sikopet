/** @format */

import { useState } from "react";
import ModuleLayout from "../modules/ModuleLayout";
import SupplierStats from "./components/SupplierStats";
import SupplierList from "./components/SupplierList";
import SupplierDetail from "./components/SupplierDetail";
import SupplierForm from "./components/SupplierForm";

const MOCK_SUPPLIERS = [
	{
		id: 1,
		name: "PT Sumber Makmur",
		contact: "Bpk. Hendra Wijaya",
		phone: "081234567100",
		email: "hendra@sumbermakmur.co.id",
		address: "Jl. Industri Raya No. 45, Surabaya",
		category: "Sembako",
		totalTransaction: 125000000,
		rating: 4.8,
		status: "active",
	},
	{
		id: 2,
		name: "CV Tiga Dara",
		contact: "Ibu. Sari Dewi",
		phone: "081234567101",
		email: "sari@tigadara.com",
		address: "Jl. Pelni No. 88, Sidoarjo",
		category: "Minuman",
		totalTransaction: 89500000,
		rating: 4.5,
		status: "active",
	},
	{
		id: 3,
		name: "PT Berkah Tani",
		contact: "Bpk. Ahmad Fauzi",
		phone: "081234567102",
		email: "ahmad@berkahtani.id",
		address: "Jl. Tani Utama No. 12, Gresik",
		category: "Pertanian",
		totalTransaction: 67000000,
		rating: 4.2,
		status: "active",
	},
	{
		id: 4,
		name: "UD Saujana",
		contact: "Bpk. Budi Santoso",
		phone: "081234567103",
		email: "budi@saujana.co.id",
		address: "Jl. Pasuruan No. 33, Pasuruan",
		category: "Sembako",
		totalTransaction: 45300000,
		rating: 4.0,
		status: "active",
	},
	{
		id: 5,
		name: "PT Cahaya Packaging",
		contact: "Ibu. Rina Kusuma",
		phone: "081234567104",
		email: "rina@cahayapack.com",
		address: "Jl. Packaging No. 7, Surabaya",
		category: "Kemasan",
		totalTransaction: 32100000,
		rating: 3.8,
		status: "inactive",
	},
	{
		id: 6,
		name: "CV Logistik Express",
		contact: "Bpk. Deny Prasetyo",
		phone: "081234567105",
		email: "deny@logisticexpress.com",
		address: "Jl. Truck No. 15, Surabaya",
		category: "Logistik",
		totalTransaction: 15800000,
		rating: 3.5,
		status: "pending",
	},
];

export default function PemasokPage() {
	const [suppliers, setSuppliers] = useState(MOCK_SUPPLIERS);
	const [selectedSupplier, setSelectedSupplier] = useState(null);
	const [showForm, setShowForm] = useState(false);
	const [search, setSearch] = useState("");
	const [categoryFilter, setCategoryFilter] = useState("all");

	const categories = [...new Set(suppliers.map((s) => s.category))];

	const filtered = suppliers.filter((s) => {
		const matchSearch =
			s.name.toLowerCase().includes(search.toLowerCase()) ||
			s.contact.toLowerCase().includes(search.toLowerCase());
		const matchCategory =
			categoryFilter === "all" || s.category === categoryFilter;
		return matchSearch && matchCategory;
	});

	const handleAdd = (data) => {
		const newSupplier = {
			id: suppliers.length + 1,
			...data,
			status: "pending",
			totalTransaction: 0,
			rating: 0,
		};
		setSuppliers((prev) => [newSupplier, ...prev]);
		setShowForm(false);
	};

	const handleActivate = (id) => {
		setSuppliers((prev) =>
			prev.map((s) => (s.id === id ? { ...s, status: "active" } : s)),
		);
		setSelectedSupplier(null);
	};

	return (
		<ModuleLayout>
			<div className="space-y-6">
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
					<div>
						<h1 className="font-display font-extrabold text-[28px] text-[#0F172A] tracking-tight">
							Pemasok
						</h1>
						<p className="text-[14px] text-[#475569] mt-1">
							Pengelolaan Data Pemasok
						</p>
					</div>
					<button
						onClick={() => setShowForm(true)}
						className="focus-ring inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#398EB3] text-white font-semibold text-[14.5px] shadow-glow hover:bg-[#2F7A9A] hover:-translate-y-0.5 transition-all"
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
						Tambah Pemasok
					</button>
				</div>

				<SupplierStats suppliers={suppliers} />

				<div className="grid lg:grid-cols-[1fr_360px] gap-6">
					<SupplierList
						suppliers={filtered}
						search={search}
						categoryFilter={categoryFilter}
						categories={categories}
						onSearch={setSearch}
						onCategoryFilter={setCategoryFilter}
						onSelect={setSelectedSupplier}
						selectedId={selectedSupplier?.id}
					/>

					{selectedSupplier ? (
						<SupplierDetail
							supplier={selectedSupplier}
							onClose={() => setSelectedSupplier(null)}
							onActivate={handleActivate}
						/>
					) : (
						<div className="rounded-lg bg-white border border-[#D8E4EA] shadow-soft p-8 flex flex-col items-center justify-center text-center">
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
								Pilih pemasok untuk melihat detail
							</p>
						</div>
					)}
				</div>
			</div>

			{showForm && (
				<SupplierForm onClose={() => setShowForm(false)} onSubmit={handleAdd} />
			)}
		</ModuleLayout>
	);
}
