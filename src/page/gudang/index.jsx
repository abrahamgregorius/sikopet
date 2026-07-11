/** @format */

import { useState } from "react";
import ModuleLayout from "../modules/ModuleLayout";
import WarehouseOverview from "./components/WarehouseOverview";
import InventoryList from "./components/InventoryList";
import InventoryDetail from "./components/InventoryDetail";
import StockForm from "./components/StockForm";

const MOCK_INVENTORY = [
	{
		id: 1,
		code: "BRG-001",
		name: "Beras Premium 5kg",
		category: "Sembako",
		stock: 120,
		minStock: 50,
		unit: "pack",
		lastRestock: "2026-07-05",
		location: "Gudang A-1",
	},
	{
		id: 2,
		code: "BRG-002",
		name: "Minyak Goreng 1L",
		category: "Sembako",
		stock: 85,
		minStock: 30,
		unit: "botol",
		lastRestock: "2026-07-03",
		location: "Gudang A-2",
	},
	{
		id: 3,
		code: "BRG-003",
		name: "Gula Pasir 1kg",
		category: "Sembako",
		stock: 200,
		minStock: 40,
		unit: "kg",
		lastRestock: "2026-07-01",
		location: "Gudang A-1",
	},
	{
		id: 4,
		code: "BRG-004",
		name: "Telur Ayam 1kg",
		category: "Sembako",
		stock: 45,
		minStock: 60,
		unit: "kg",
		lastRestock: "2026-07-08",
		location: "Gudang B-1",
	},
	{
		id: 5,
		code: "BRG-005",
		name: "Mie Instan",
		category: "Sembako",
		stock: 500,
		minStock: 100,
		unit: "pcs",
		lastRestock: "2026-06-28",
		location: "Gudang C-1",
	},
	{
		id: 6,
		code: "BRG-006",
		name: "Kopi Sachet",
		category: "Minuman",
		stock: 300,
		minStock: 80,
		unit: "pcs",
		lastRestock: "2026-07-02",
		location: "Gudang B-2",
	},
	{
		id: 7,
		code: "BRG-007",
		name: "Teh Celup 25s",
		category: "Minuman",
		stock: 150,
		minStock: 50,
		unit: "box",
		lastRestock: "2026-07-04",
		location: "Gudang B-2",
	},
	{
		id: 8,
		code: "BRG-008",
		name: "Sabun Mandi 100g",
		category: "Toiletries",
		stock: 200,
		minStock: 60,
		unit: "pcs",
		lastRestock: "2026-06-25",
		location: "Gudang C-2",
	},
];

export default function GudangPage() {
	const [inventory, setInventory] = useState(MOCK_INVENTORY);
	const [selectedItem, setSelectedItem] = useState(null);
	const [showForm, setShowForm] = useState(false);
	const [categoryFilter, setCategoryFilter] = useState("all");
	const [search, setSearch] = useState("");
	const [stockAlert, setStockAlert] = useState("all");

	const categories = [...new Set(inventory.map((i) => i.category))];

	const filtered = inventory.filter((i) => {
		const matchSearch =
			i.name.toLowerCase().includes(search.toLowerCase()) ||
			i.code.toLowerCase().includes(search.toLowerCase());
		const matchCategory =
			categoryFilter === "all" || i.category === categoryFilter;
		const matchAlert =
			stockAlert === "all" ||
			(stockAlert === "low" && i.stock < i.minStock) ||
			(stockAlert === "ok" && i.stock >= i.minStock);
		return matchSearch && matchCategory && matchAlert;
	});

	const lowStockCount = inventory.filter((i) => i.stock < i.minStock).length;
	const totalItems = inventory.length;
	const totalStock = inventory.reduce((sum, i) => sum + i.stock, 0);

	const handleRestock = (id, qty) => {
		setInventory((prev) =>
			prev.map((i) =>
				i.id === id
					? {
							...i,
							stock: i.stock + qty,
							lastRestock: new Date().toISOString().split("T")[0],
						}
					: i,
			),
		);
		setSelectedItem(null);
	};

	return (
		<ModuleLayout>
			<div className="space-y-6">
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
					<div>
						<h1 className="font-display font-extrabold text-[28px] text-[#0F172A] tracking-tight">
							Gudang
						</h1>
						<p className="text-[14px] text-[#475569] mt-1">
							Manajemen Stok & Inventaris
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
						Stok Masuk
					</button>
				</div>

				<WarehouseOverview
					totalItems={totalItems}
					totalStock={totalStock}
					lowStockCount={lowStockCount}
				/>

				<div className="grid lg:grid-cols-[1fr_360px] gap-6">
					<InventoryList
						inventory={filtered}
						search={search}
						categoryFilter={categoryFilter}
						stockAlert={stockAlert}
						categories={categories}
						onSearch={setSearch}
						onCategoryFilter={setCategoryFilter}
						onStockAlert={setStockAlert}
						onSelect={setSelectedItem}
						selectedId={selectedItem?.id}
					/>

					{selectedItem ? (
						<InventoryDetail
							item={selectedItem}
							onClose={() => setSelectedItem(null)}
							onRestock={handleRestock}
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
									<path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
									<path d="M9 22V12h6v10" />
								</svg>
							</div>
							<p className="text-[14px] text-[#94A3B8]">
								Pilih item untuk melihat detail
							</p>
						</div>
					)}
				</div>
			</div>

			{showForm && (
				<StockForm
					onClose={() => setShowForm(false)}
					onSubmit={(data) => {
						const newItem = {
							id: inventory.length + 1,
							...data,
							code: `BRG-${String(inventory.length + 1).padStart(3, "0")}`,
						};
						setInventory((prev) => [newItem, ...prev]);
						setShowForm(false);
					}}
				/>
			)}
		</ModuleLayout>
	);
}
