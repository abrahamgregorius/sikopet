/** @format */

import { useState, useEffect } from "react";
import DashboardLayout from "../../components/ui/DashboardLayout";
import WarehouseOverview from "./components/WarehouseOverview";
import InventoryList from "./components/InventoryList";
import InventoryDetail from "./components/InventoryDetail";
import StockForm from "./components/StockForm";
import { db } from "../../database/db";
import { exportInventoryToCSV, exportInventoryToExcel } from "../../lib/exportUtils";

export default function GudangPage() {
	const [inventory, setInventory] = useState([]);
	const [products, setProducts] = useState([]);
	const [selectedItem, setSelectedItem] = useState(null);
	const [showForm, setShowForm] = useState(false);
	const [categoryFilter, setCategoryFilter] = useState("all");
	const [search, setSearch] = useState("");
	const [stockAlert, setStockAlert] = useState("all");
	const [loading, setLoading] = useState(true);

	const loadData = async () => {
		setLoading(true);
		try {
			const [productsData, inventoryData] = await Promise.all([
				db.products.toArray(),
				db.inventory.toArray(),
			]);
			const enrichedInventory = inventoryData.map((inv) => {
				const product = productsData.find((p) => p.id === inv.productId);
				return {
					...inv,
					name: product?.name || "Unknown",
					category: product?.category || "Lainnya",
					code: `BRG-${String(inv.id || 0).padStart(3, "0")}`,
					minStock: inv.minimumStock || 0,
					unit: product?.unit || "pcs",
				};
			});
			setProducts(productsData);
			setInventory(enrichedInventory);
		} catch (err) {
			console.error("[Gudang] Failed to load data:", err);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadData();
	}, []);

	const categories = [...new Set(inventory.map((i) => i.category))];

	const filtered = inventory.filter((i) => {
		const matchSearch =
			(i.name || "").toLowerCase().includes(search.toLowerCase()) ||
			(i.code || "").toLowerCase().includes(search.toLowerCase());
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
	const totalStock = inventory.reduce((sum, i) => sum + (i.stock || 0), 0);

	const handleRestock = async (id, qty) => {
		try {
			const item = inventory.find((i) => i.id === id);
			if (!item) return;
			await db.inventory.update(id, {
				stock: (item.stock || 0) + qty,
				updatedAt: new Date().toISOString(),
			});
			await loadData();
			setSelectedItem(null);
		} catch (err) {
			console.error("[Gudang] Failed to restock:", err);
		}
	};

	const handleAddItem = async (data) => {
		try {
			let product = products.find((p) => p.name === data.name);
			let productId;

			if (!product) {
				productId = await db.products.add({
					name: data.name,
					category: data.category || "Lainnya",
					unit: data.unit || "pcs",
					createdAt: new Date().toISOString(),
				});
			} else {
				productId = product.id;
			}

			await db.inventory.add({
				productId,
				stock: data.stock || 0,
				minimumStock: data.minStock || 0,
				location: data.location || "-",
				updatedAt: new Date().toISOString(),
			});

			await loadData();
			setShowForm(false);
		} catch (err) {
			console.error("[Gudang] Failed to add item:", err);
		}
	};

	return (
		<DashboardLayout>
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
									onClick={() => exportInventoryToCSV(inventory)}
									disabled={inventory.length === 0}
									className="w-full text-left px-4 py-2.5 text-[13px] text-[#374151] hover:bg-[#F1F5F9] transition-colors first:rounded-t-lg last:rounded-b-lg disabled:opacity-50 disabled:cursor-not-allowed"
								>
									Export as CSV
								</button>
								<button
									onClick={() => exportInventoryToExcel(inventory)}
									disabled={inventory.length === 0}
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
							Stok Masuk
						</button>
					</div>
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
						loading={loading}
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
					onSubmit={handleAddItem}
				/>
			)}
		</DashboardLayout>
	);
}
