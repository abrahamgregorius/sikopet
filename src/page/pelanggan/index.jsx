/** @format */

import { useState } from "react";
import ModuleLayout from "../modules/ModuleLayout";
import CustomerStats from "./components/CustomerStats";
import CustomerList from "./components/CustomerList";
import CustomerDetail from "./components/CustomerDetail";
import CustomerForm from "./components/CustomerForm";

const MOCK_CUSTOMERS = [
	{
		id: 1,
		name: "Toko Sembako Jaya",
		contact: "Bpk. agus Salim",
		phone: "081298765001",
		email: "agus@toko-jaya.co.id",
		address: "Jl. Kembang Jepun No. 88, Surabaya",
		category: "Pedagang Besar",
		totalTransaction: 250000000,
		visitCount: 45,
		lastVisit: "2026-07-09",
		status: "active",
	},
	{
		id: 2,
		name: "Warung Bu Rahma",
		contact: "Ibu. Rahma Wati",
		phone: "081298765002",
		email: "rahma@warungrahma.com",
		address: "Jl. Dupak No. 22, Surabaya",
		category: "Pedagang Kecil",
		totalTransaction: 85000000,
		visitCount: 32,
		lastVisit: "2026-07-08",
		status: "active",
	},
	{
		id: 3,
		name: "PT Cahaya Mandiri",
		contact: "Bpk. Hendro Wijaya",
		phone: "081298765003",
		email: "hendro@cahayamandiri.com",
		address: "Jl. Tambak Sawah No. 15, Sidoarjo",
		category: "Perusahaan",
		totalTransaction: 420000000,
		visitCount: 28,
		lastVisit: "2026-07-07",
		status: "active",
	},
	{
		id: 4,
		name: "Toko Kita",
		contact: "Ibu. Dina Kartika",
		phone: "081298765004",
		email: "dina@tokokita.id",
		address: "Jl. Priok No. 44, Surabaya",
		category: "Pedagang Besar",
		totalTransaction: 156000000,
		visitCount: 19,
		lastVisit: "2026-07-06",
		status: "active",
	},
	{
		id: 5,
		name: "Pelanggan Umum",
		contact: "-",
		phone: "081298765005",
		email: "-",
		address: "-",
		category: "Umum",
		totalTransaction: 12500000,
		visitCount: 8,
		lastVisit: "2026-07-05",
		status: "active",
	},
	{
		id: 6,
		name: "UD Jaya Abadi",
		contact: "Bpk. Suprapto",
		phone: "081298765006",
		email: "suprapto@jayabad i.co.id",
		address: "Jl. Margorejo No. 66, Surabaya",
		category: "Pedagang Besar",
		totalTransaction: 0,
		visitCount: 0,
		lastVisit: "-",
		status: "inactive",
	},
];

export default function PelangganPage() {
	const [customers, setCustomers] = useState(MOCK_CUSTOMERS);
	const [selectedCustomer, setSelectedCustomer] = useState(null);
	const [showForm, setShowForm] = useState(false);
	const [search, setSearch] = useState("");
	const [categoryFilter, setCategoryFilter] = useState("all");

	const categories = [...new Set(customers.map((c) => c.category))];

	const filtered = customers.filter((c) => {
		const matchSearch =
			c.name.toLowerCase().includes(search.toLowerCase()) ||
			c.contact.toLowerCase().includes(search.toLowerCase());
		const matchCategory =
			categoryFilter === "all" || c.category === categoryFilter;
		return matchSearch && matchCategory;
	});

	const handleAdd = (data) => {
		const newCustomer = {
			id: customers.length + 1,
			...data,
			status: "pending",
			totalTransaction: 0,
			visitCount: 0,
			lastVisit: "-",
		};
		setCustomers((prev) => [newCustomer, ...prev]);
		setShowForm(false);
	};

	return (
		<ModuleLayout>
			<div className="space-y-6">
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
					<div>
						<h1 className="font-display font-extrabold text-[28px] text-[#0F172A] tracking-tight">
							Pelanggan
						</h1>
						<p className="text-[14px] text-[#475569] mt-1">
							Pengelolaan Data Pelanggan
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
						Tambah Pelanggan
					</button>
				</div>

				<CustomerStats customers={customers} />

				<div className="grid lg:grid-cols-[1fr_360px] gap-6">
					<CustomerList
						customers={filtered}
						search={search}
						categoryFilter={categoryFilter}
						categories={categories}
						onSearch={setSearch}
						onCategoryFilter={setCategoryFilter}
						onSelect={setSelectedCustomer}
						selectedId={selectedCustomer?.id}
					/>

					{selectedCustomer ? (
						<CustomerDetail
							customer={selectedCustomer}
							onClose={() => setSelectedCustomer(null)}
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
									<path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
									<circle cx="12" cy="7" r="4" />
								</svg>
							</div>
							<p className="text-[14px] text-[#94A3B8]">
								Pilih pelanggan untuk melihat detail
							</p>
						</div>
					)}
				</div>
			</div>

			{showForm && (
				<CustomerForm onClose={() => setShowForm(false)} onSubmit={handleAdd} />
			)}
		</ModuleLayout>
	);
}
