/** @format */

import { useState, useEffect } from "react";
import { db } from "../../../database/index.js";
import Breadcrumb from "./Breadcrumb";

const CATEGORY_OPTIONS = [
	"Sembako",
	"Toiletries",
	"Minuman",
	"Makanan",
	"Alat Tulis",
	"Lainnya",
];

const LOW_STOCK_THRESHOLD = 10;

export default function InventoryPage() {
	const [products, setProducts] = useState([]);
	const [inventory, setInventory] = useState([]);
	const [loading, setLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState("");
	const [filterCategory, setFilterCategory] = useState("all");
	const [filterStock, setFilterStock] = useState("all");
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [adjustModal, setAdjustModal] = useState(null);
	const [editingProduct, setEditingProduct] = useState(null);
	const [toast, setToast] = useState(null);
	const [form, setForm] = useState({
		name: "",
		category: "Sembako",
		price: "",
	});
	const [adjustForm, setAdjustForm] = useState({
		type: "in",
		amount: "",
		note: "",
	});
	const [formError, setFormError] = useState("");

	useEffect(() => {
		loadData();
	}, []);

	async function loadData() {
		setLoading(true);
		try {
			const [allProducts, allInventory] = await Promise.all([
				db.products.toArray(),
				db.inventory.toArray(),
			]);
			setProducts(allProducts);
			setInventory(allInventory);
		} catch (err) {
			console.error("[InventoryPage] Failed to load:", err);
			showToast("Gagal memuat data", "error");
		} finally {
			setLoading(false);
		}
	}

	function showToast(message, type) {
		setToast({ message, type });
		setTimeout(() => setToast(null), 3000);
	}

	function getProductWithStock(productId) {
		const prod = products.find((p) => p.id === productId);
		const inv = inventory.find((i) => i.productId === productId);
		if (!prod) return null;
		return {
			...prod,
			stock: inv?.stock || 0,
			minimumStock: inv?.minimumStock || 0,
			location: inv?.location || "-",
			updatedAt: inv?.updatedAt,
		};
	}

	function getInventoryMap() {
		const map = {};
		inventory.forEach((inv) => {
			map[inv.productId] = inv;
		});
		return map;
	}

	function getFilteredProducts() {
		const invMap = getInventoryMap();
		let filtered = products.map((prod) => ({
			...prod,
			stock: invMap[prod.id]?.stock || 0,
			minimumStock: invMap[prod.id]?.minimumStock || 0,
			location: invMap[prod.id]?.location || "-",
			updatedAt: invMap[prod.id]?.updatedAt,
		}));

		if (searchQuery) {
			const q = searchQuery.toLowerCase();
			filtered = filtered.filter(
				(p) =>
					p.name.toLowerCase().includes(q) ||
					p.category.toLowerCase().includes(q),
			);
		}

		if (filterCategory !== "all") {
			filtered = filtered.filter((p) => p.category === filterCategory);
		}

		if (filterStock === "low") {
			filtered = filtered.filter((p) => p.stock <= p.minimumStock);
		} else if (filterStock === "out") {
			filtered = filtered.filter((p) => p.stock === 0);
		}

		return filtered.sort(
			(a, b) => new Date(b.updatedAt) - new Date(a.updatedAt),
		);
	}

	function resetForm() {
		setForm({ name: "", category: "Sembako", price: "" });
		setFormError("");
		setEditingProduct(null);
	}

	function openCreateModal() {
		resetForm();
		setIsModalOpen(true);
	}

	function openEditModal(product) {
		setEditingProduct(product);
		setForm({
			name: product.name,
			category: product.category,
			price: product.price.toString(),
		});
		setIsModalOpen(true);
	}

	function openAdjustModal(product) {
		setAdjustModal(product);
		setAdjustForm({ type: "in", amount: "", note: "" });
	}

	async function handleSubmit(e) {
		e.preventDefault();
		if (!form.name.trim()) {
			setFormError("Nama produk wajib diisi");
			return;
		}
		if (!form.price || parseFloat(form.price) < 0) {
			setFormError("Harga tidak valid");
			return;
		}

		try {
			const productData = {
				name: form.name.trim(),
				category: form.category,
				price: parseFloat(form.price),
				updatedAt: new Date(),
			};

			if (editingProduct) {
				await db.products.update(editingProduct.id, productData);
				showToast("Produk berhasil diperbarui", "success");
			} else {
				productData.createdAt = new Date();
				const newProductId = await db.products.add(productData);
				await db.inventory.add({
					productId: newProductId,
					stock: 0,
					minimumStock: 10,
					location: "Gudang A-1",
					updatedAt: new Date(),
				});
				showToast("Produk berhasil ditambahkan", "success");
			}

			setIsModalOpen(false);
			resetForm();
			loadData();
		} catch (err) {
			console.error("[InventoryPage] Save failed:", err);
			setFormError("Gagal menyimpan produk");
		}
	}

	async function handleAdjust(e) {
		e.preventDefault();
		if (!adjustForm.amount || parseInt(adjustForm.amount) <= 0) {
			return;
		}

		try {
			const inv = inventory.find((i) => i.productId === adjustModal.id);
			const amount = parseInt(adjustForm.amount);
			let newStock =
				adjustForm.type === "in"
					? (inv?.stock || 0) + amount
					: Math.max(0, (inv?.stock || 0) - amount);

			if (inv) {
				await db.inventory.update(inv.id, {
					stock: newStock,
					updatedAt: new Date(),
				});
			} else {
				await db.inventory.add({
					productId: adjustModal.id,
					stock: newStock,
					minimumStock: 10,
					location: "Gudang A-1",
					updatedAt: new Date(),
				});
			}

			await db.products.update(adjustModal.id, {
				updatedAt: new Date(),
			});

			showToast(
				`Stock ${adjustForm.type === "in" ? "ditambahkan" : "dikurangi"}`,
				"success",
			);
			setAdjustModal(null);
			loadData();
		} catch (err) {
			console.error("[InventoryPage] Adjust failed:", err);
			showToast("Gagal mengubah stock", "error");
		}
	}

	async function handleDelete(product) {
		if (!confirm(`Hapus "${product.name}" dari inventaris?`)) return;
		try {
			const inv = inventory.find((i) => i.productId === product.id);
			if (inv) await db.inventory.delete(inv.id);
			await db.products.delete(product.id);
			showToast("Produk berhasil dihapus", "success");
			loadData();
		} catch (err) {
			console.error("[InventoryPage] Delete failed:", err);
			showToast("Gagal menghapus produk", "error");
		}
	}

	async function handleUpdateLocation(product, newLocation) {
		try {
			const inv = inventory.find((i) => i.productId === product.id);
			if (inv) {
				await db.inventory.update(inv.id, { location: newLocation });
			} else {
				await db.inventory.add({
					productId: product.id,
					stock: 0,
					minimumStock: 10,
					location: newLocation,
					updatedAt: new Date(),
				});
			}
			loadData();
		} catch (err) {
			console.error("[InventoryPage] Location update failed:", err);
		}
	}

	const filteredProducts = getFilteredProducts();
	const lowStockCount = filteredProducts.filter(
		(p) => p.stock <= p.minimumStock,
	).length;

	return (
		<div className="space-y-6">
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h1 className="font-display font-extrabold text-[28px] sm:text-[32px] text-[#0F172A] tracking-tight">
						Inventaris
					</h1>
					<p className="text-[14px] text-[#6B7280] mt-1">
						Kelola stok barang dan inventaris gudang
					</p>
				</div>
				<button
					onClick={openCreateModal}
					className="focus-ring inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#398eb3] text-white font-semibold text-[14px] hover:bg-[#2F7A9A] transition-colors"
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
					Tambah Produk
				</button>
			</div>

			{lowStockCount > 0 && (
				<div className="rounded-lg bg-[#FEF3C7] border border-[#FCD34D] px-4 py-3 flex items-center gap-3">
					<svg
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="#F59E0B"
						strokeWidth="2"
					>
						<path
							d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.7 3.86a2 2 0 00-3.42 0z"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
					<p className="text-[13px] text-[#92400E] font-medium">
						<span className="font-bold">{lowStockCount}</span> produk stock
						rendah
					</p>
				</div>
			)}

			<div className="flex flex-col sm:flex-row gap-3">
				<div className="relative flex-1">
					<svg
						className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
					>
						<circle cx="11" cy="11" r="8" />
						<path d="M21 21l-4.35-4.35" strokeLinecap="round" />
					</svg>
					<input
						type="text"
						placeholder="Cari produk..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="focus-ring w-full h-[44px] pl-10 pr-4 rounded-[12px] border border-[#E5E7EB] bg-white text-[14px] text-[#0F172A] placeholder-[#9CA3AF] transition-colors"
					/>
				</div>
				<select
					value={filterCategory}
					onChange={(e) => setFilterCategory(e.target.value)}
					className="focus-ring h-[44px] px-4 rounded-[12px] border border-[#E5E7EB] bg-white text-[14px] text-[#0F172A] transition-colors"
				>
					<option value="all">Semua Kategori</option>
					{CATEGORY_OPTIONS.map((cat) => (
						<option key={cat} value={cat}>
							{cat}
						</option>
					))}
				</select>
				<select
					value={filterStock}
					onChange={(e) => setFilterStock(e.target.value)}
					className="focus-ring h-[44px] px-4 rounded-[12px] border border-[#E5E7EB] bg-white text-[14px] text-[#0F172A] transition-colors"
				>
					<option value="all">Semua Stock</option>
					<option value="low">Stock Rendah</option>
					<option value="out">Stock Habis</option>
				</select>
			</div>

			<div className="rounded-lg bg-white border border-[#E5E7EB] overflow-hidden">
				{loading ? (
					<div className="flex items-center justify-center h-48">
						<div className="w-8 h-8 border-2 border-[#398eb3] border-t-transparent rounded-lg animate-spin" />
					</div>
				) : filteredProducts.length === 0 ? (
					<div className="flex flex-col items-center justify-center h-48 text-center px-6">
						<div className="w-14 h-14 rounded-lg bg-[#F1F5F9] grid place-items-center mb-4">
							<svg
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								stroke="#94A3B8"
								strokeWidth="1.8"
							>
								<path
									d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
						</div>
						<p className="text-[14px] text-[#94A3B8]">
							Tidak ada produk ditemukan
						</p>
					</div>
				) : (
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead>
								<tr className="border-b border-[#E8EEF2]">
									<th className="text-left px-5 py-3.5 text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider">
										Produk
									</th>
									<th className="text-left px-5 py-3.5 text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider">
										Kategori
									</th>
									<th className="text-right px-5 py-3.5 text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider">
										Harga
									</th>
									<th className="text-right px-5 py-3.5 text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider">
										Stock
									</th>
									<th className="text-left px-5 py-3.5 text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider">
										Lokasi
									</th>
									<th className="text-right px-5 py-3.5 text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider">
										Aksi
									</th>
								</tr>
							</thead>
							<tbody>
								{filteredProducts.map((product) => {
									const isLow = product.stock <= product.minimumStock;
									const isOut = product.stock === 0;
									return (
										<tr
											key={product.id}
											className="border-b border-[#E8EEF2] last:border-0 hover:bg-[#F7FAFC] transition-colors"
										>
											<td className="px-5 py-4">
												<div className="flex items-center gap-3">
													<div className="w-10 h-10 rounded-lg bg-[#EAF6FB] grid place-items-center">
														<svg
															width="18"
															height="18"
															viewBox="0 0 24 24"
															fill="none"
															stroke="#398eb3"
															strokeWidth="1.8"
														>
															<path
																d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
																strokeLinecap="round"
																strokeLinejoin="round"
															/>
														</svg>
													</div>
													<div>
														<p className="font-medium text-[14px] text-[#0F172A]">
															{product.name}
														</p>
														<p className="text-[12px] text-[#94A3B8]">
															ID: {product.id}
														</p>
													</div>
												</div>
											</td>
											<td className="px-5 py-4">
												<span className="inline-flex px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-[#F1F5F9] text-[#475569]">
													{product.category}
												</span>
											</td>
											<td className="px-5 py-4 text-right text-[14px] font-medium text-[#0F172A]">
												Rp {product.price.toLocaleString("id-ID")}
											</td>
											<td className="px-5 py-4 text-right">
												<span
													className={`inline-flex px-2.5 py-1 rounded-lg text-[11px] font-bold ${
														isOut
															? "bg-[#FEE2E2] text-[#EF4444]"
															: isLow
																? "bg-[#FEF3C7] text-[#F59E0B]"
																: "bg-[#DCFCE7] text-[#22C55E]"
													}`}
												>
													{product.stock}
													{isLow && !isOut && (
														<svg
															width="12"
															height="12"
															viewBox="0 0 24 24"
															fill="none"
															stroke="currentColor"
															strokeWidth="2"
															className="ml-1"
														>
															<path
																d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.7 3.86a2 2 0 00-3.42 0z"
																strokeLinecap="round"
																strokeLinejoin="round"
															/>
														</svg>
													)}
												</span>
											</td>
											<td className="px-5 py-4 text-[13px] text-[#6B7280]">
												{product.location}
											</td>
											<td className="px-5 py-4">
												<div className="flex items-center justify-end gap-1">
													<button
														onClick={() => openAdjustModal(product)}
														className="focus-ring p-2 rounded-lg hover:bg-[#EAF6FB] text-[#94A3B8] hover:text-[#398eb3] transition-colors"
														title="Adjust Stock"
													>
														<svg
															width="16"
															height="16"
															viewBox="0 0 24 24"
															fill="none"
															stroke="currentColor"
															strokeWidth="2"
														>
															<path
																d="M12 5v14M5 12h14"
																strokeLinecap="round"
															/>
														</svg>
													</button>
													<button
														onClick={() => openEditModal(product)}
														className="focus-ring p-2 rounded-lg hover:bg-[#F1F5F9] text-[#94A3B8] hover:text-[#398eb3] transition-colors"
														title="Edit"
													>
														<svg
															width="16"
															height="16"
															viewBox="0 0 24 24"
															fill="none"
															stroke="currentColor"
															strokeWidth="2"
														>
															<path
																d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"
																strokeLinecap="round"
															/>
															<path
																d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
																strokeLinecap="round"
																strokeLinejoin="round"
															/>
														</svg>
													</button>
													<button
														onClick={() => handleDelete(product)}
														className="focus-ring p-2 rounded-lg hover:bg-[#FEE2E2] text-[#94A3B8] hover:text-[#EF4444] transition-colors"
														title="Hapus"
													>
														<svg
															width="16"
															height="16"
															viewBox="0 0 24 24"
															fill="none"
															stroke="currentColor"
															strokeWidth="2"
														>
															<path
																d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"
																strokeLinecap="round"
																strokeLinejoin="round"
															/>
														</svg>
													</button>
												</div>
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>
				)}
			</div>

			{isModalOpen && (
				<>
					<div
						onClick={() => setIsModalOpen(false)}
						className="fixed inset-0 bg-[#0F172A]/40 z-[80]"
					/>
					<div className="fixed inset-0 z-[90] grid place-items-center px-4">
						<div className="w-full max-w-[440px] bg-white rounded-lg p-6 sm:p-7">
							<div className="flex items-center justify-between mb-5">
								<h3 className="font-display font-bold text-[18px] text-[#0F172A]">
									{editingProduct ? "Edit Produk" : "Produk Baru"}
								</h3>
								<button
									onClick={() => setIsModalOpen(false)}
									className="focus-ring p-1.5 rounded-lg hover:bg-[#F1F5F9] text-[#94A3B8]"
								>
									<svg
										width="18"
										height="18"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
									>
										<path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
									</svg>
								</button>
							</div>
							<form onSubmit={handleSubmit} className="space-y-4">
								<div>
									<label className="block text-[12.5px] font-semibold text-[#475569] mb-1.5">
										Nama Produk
									</label>
									<input
										type="text"
										value={form.name}
										onChange={(e) => setForm({ ...form, name: e.target.value })}
										placeholder="cth. Beras Premium 5kg"
										className="focus-ring w-full h-[48px] px-4 rounded-[12px] border border-[#E5E7EB] text-[15px] focus:border-[#398EB3] focus:outline-none transition-colors"
									/>
								</div>
								<div>
									<label className="block text-[12.5px] font-semibold text-[#475569] mb-1.5">
										Kategori
									</label>
									<select
										value={form.category}
										onChange={(e) =>
											setForm({ ...form, category: e.target.value })
										}
										className="focus-ring w-full h-[48px] px-4 rounded-[12px] border border-[#E5E7EB] text-[15px] focus:border-[#398EB3] focus:outline-none transition-colors appearance-none cursor-pointer"
										style={{
											backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
											backgroundRepeat: "no-repeat",
											backgroundPosition: "right 16px center",
											paddingRight: "40px",
										}}
									>
										{CATEGORY_OPTIONS.map((cat) => (
											<option key={cat} value={cat}>
												{cat}
											</option>
										))}
									</select>
								</div>
								<div>
									<label className="block text-[12.5px] font-semibold text-[#475569] mb-1.5">
										Harga
									</label>
									<div className="relative">
										<span className="absolute left-4 top-1/2 -translate-y-1/2 text-[14px] text-[#94A3B8]">
											Rp
										</span>
										<input
											type="number"
											value={form.price}
											onChange={(e) =>
												setForm({ ...form, price: e.target.value })
											}
											placeholder="0"
											className="focus-ring w-full h-[48px] pl-10 pr-4 rounded-[12px] border border-[#E5E7EB] text-[15px] focus:border-[#398EB3] focus:outline-none transition-colors"
										/>
									</div>
								</div>
								{formError && (
									<div className="rounded-lg bg-[#FEE2E2] px-4 py-3">
										<p className="text-[13px] text-[#EF4444] font-medium">
											{formError}
										</p>
									</div>
								)}
								<div className="flex gap-3 pt-2">
									<button
										type="button"
										onClick={() => setIsModalOpen(false)}
										className="focus-ring flex-1 h-[46px] rounded-lg border border-[#E5E7EB] font-semibold text-[14px] text-[#475569] hover:bg-[#F1F5F9] transition-colors"
									>
										Batal
									</button>
									<button
										type="submit"
										className="focus-ring flex-1 h-[46px] rounded-lg bg-[#398eb3] text-white font-semibold text-[14px] hover:bg-[#2F7A9A] transition-colors"
									>
										{editingProduct ? "Simpan" : "Tambah"}
									</button>
								</div>
							</form>
						</div>
					</div>
				</>
			)}

			{adjustModal && (
				<>
					<div
						onClick={() => setAdjustModal(null)}
						className="fixed inset-0 bg-[#0F172A]/40 z-[80]"
					/>
					<div className="fixed inset-0 z-[90] grid place-items-center px-4">
						<div className="w-full max-w-[380px] bg-white rounded-lg p-6 sm:p-7">
							<div className="flex items-center justify-between mb-5">
								<h3 className="font-display font-bold text-[18px] text-[#0F172A]">
									Adjust Stock
								</h3>
								<button
									onClick={() => setAdjustModal(null)}
									className="focus-ring p-1.5 rounded-lg hover:bg-[#F1F5F9] text-[#94A3B8]"
								>
									<svg
										width="18"
										height="18"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
									>
										<path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
									</svg>
								</button>
							</div>
							<div className="mb-4 p-3 rounded-lg bg-[#F1F5F9]">
								<p className="font-medium text-[14px] text-[#0F172A]">
									{adjustModal.name}
								</p>
								<p className="text-[13px] text-[#6B7280]">
									Stock saat ini:{" "}
									<span className="font-bold text-[#398eb3]">
										{adjustModal.stock}
									</span>
								</p>
							</div>
							<form onSubmit={handleAdjust} className="space-y-4">
								<div className="grid grid-cols-2 gap-3">
									<button
										type="button"
										onClick={() => setAdjustForm({ ...adjustForm, type: "in" })}
										className={`h-[48px] rounded-lg font-semibold text-[14px] transition-colors ${
											adjustForm.type === "in"
												? "bg-[#22C55E] text-white"
												: "bg-[#F1F5F9] text-[#6B7280] hover:bg-[#E2E8F0]"
										}`}
									>
										+ Tambah Stock
									</button>
									<button
										type="button"
										onClick={() =>
											setAdjustForm({ ...adjustForm, type: "out" })
										}
										className={`h-[48px] rounded-lg font-semibold text-[14px] transition-colors ${
											adjustForm.type === "out"
												? "bg-[#EF4444] text-white"
												: "bg-[#F1F5F9] text-[#6B7280] hover:bg-[#E2E8F0]"
										}`}
									>
										- Kurangi Stock
									</button>
								</div>
								<div>
									<label className="block text-[12.5px] font-semibold text-[#475569] mb-1.5">
										Jumlah
									</label>
									<input
										type="number"
										value={adjustForm.amount}
										onChange={(e) =>
											setAdjustForm({
												...adjustForm,
												amount: e.target.value,
											})
										}
										placeholder="0"
										min="1"
										className="focus-ring w-full h-[48px] px-4 rounded-[12px] border border-[#E5E7EB] text-[15px] focus:border-[#398EB3] focus:outline-none transition-colors"
									/>
								</div>
								<div>
									<label className="block text-[12.5px] font-semibold text-[#475569] mb-1.5">
										Catatan (opsional)
									</label>
									<input
										type="text"
										value={adjustForm.note}
										onChange={(e) =>
											setAdjustForm({
												...adjustForm,
												note: e.target.value,
											})
										}
										placeholder="cth. Restok dari supplier"
										className="focus-ring w-full h-[48px] px-4 rounded-[12px] border border-[#E5E7EB] text-[15px] focus:border-[#398EB3] focus:outline-none transition-colors"
									/>
								</div>
								<button
									type="submit"
									className="focus-ring w-full h-[46px] rounded-lg bg-[#398eb3] text-white font-semibold text-[14px] hover:bg-[#2F7A9A] transition-colors"
								>
									Konfirmasi
								</button>
							</form>
						</div>
					</div>
				</>
			)}

			{toast && (
				<div
					className={`fixed bottom-6 right-6 z-[100] px-5 py-3 rounded-lg flex items-center gap-3 animate-pop-in ${
						toast.type === "success"
							? "bg-[#22C55E] text-white"
							: "bg-[#EF4444] text-white"
					}`}
				>
					{toast.type === "success" ? (
						<svg
							width="18"
							height="18"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2.5"
						>
							<path
								d="M20 6L9 17l-5-5"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
					) : (
						<svg
							width="18"
							height="18"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2.5"
						>
							<circle cx="12" cy="12" r="10" />
							<path d="M15 9l-6 6M9 9l6 6" strokeLinecap="round" />
						</svg>
					)}
					<span className="text-[13.5px] font-medium">{toast.message}</span>
				</div>
			)}
		</div>
	);
}
