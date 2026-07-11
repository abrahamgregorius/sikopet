/** @format */

import { useState, useEffect } from "react";
import ModuleLayout from "../modules/ModuleLayout";
import ProductGrid from "./components/ProductGrid";
import CartPanel from "./components/CartPanel";
import TransactionSummary from "./components/TransactionSummary";
import RecentTransactions from "./components/RecentTransactions";
import { db } from "../../database/db";

export default function KasirPage() {
	const [products, setProducts] = useState([]);
	const [recentTransactions, setRecentTransactions] = useState([]);
	const [loading, setLoading] = useState(true);
	const [cart, setCart] = useState([]);
	const [discount, setDiscount] = useState(0);
	const [paymentMethod, setPaymentMethod] = useState("cash");

	const loadData = async () => {
		setLoading(true);
		try {
			const [productsData, inventoryData, transactionsData] = await Promise.all([
				db.products.toArray(),
				db.inventory.toArray(),
				db.transactions.where("type").equals("sale").reverse().limit(10).toArray(),
			]);

			const inventoryMap = {};
			inventoryData.forEach((inv) => {
				inventoryMap[inv.productId] = inv.stock;
			});

			const enrichedProducts = productsData.map((p) => ({
				...p,
				price: p.salePrice || 0,
				stock: inventoryMap[p.id] || 0,
			}));

			const enrichedTx = transactionsData.map((tx) => ({
				...tx,
				invoice: tx.invoice || `TX-${tx.id}`,
				time: tx.createdAt ? new Date(tx.createdAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) : "-",
			}));

			setProducts(enrichedProducts);
			setRecentTransactions(enrichedTx);
		} catch (err) {
			console.error("[Kasir] Failed to load data:", err);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadData();
	}, []);

	const addToCart = (product) => {
		setCart((prev) => {
			const existing = prev.find((item) => item.id === product.id);
			if (existing) {
				return prev.map((item) =>
					item.id === product.id ? { ...item, qty: item.qty + 1 } : item,
				);
			}
			return [...prev, { ...product, qty: 1 }];
		});
	};

	const updateQty = (id, qty) => {
		if (qty <= 0) {
			setCart((prev) => prev.filter((item) => item.id !== id));
		} else {
			setCart((prev) =>
				prev.map((item) => (item.id === id ? { ...item, qty } : item)),
			);
		}
	};

	const removeFromCart = (id) => {
		setCart((prev) => prev.filter((item) => item.id !== id));
	};

	const subtotal = cart.reduce((sum, item) => sum + (item.price || 0) * item.qty, 0);
	const discountAmount = (discount / 100) * subtotal;
	const total = subtotal - discountAmount;
	const tax = total * 0.11;
	const grandTotal = total + tax;

	const handleBayar = async () => {
		if (cart.length === 0) return;
		try {
			const transaction = {
				type: "sale",
				items: cart,
				subtotal,
				discount,
				discountAmount,
				tax,
				total: grandTotal,
				paymentMethod,
				createdAt: new Date().toISOString(),
			};
			await db.transactions.add(transaction);
			await loadData();
			alert(
				`Pembayaran berhasil!\nMetode: ${paymentMethod}\nTotal: Rp ${grandTotal.toLocaleString("id-ID")}`,
			);
			setCart([]);
			setDiscount(0);
		} catch (err) {
			console.error("[Kasir] Failed to save transaction:", err);
			alert("Gagal menyimpan transaksi. Silakan coba lagi.");
		}
	};

	const handleClearCart = () => {
		setCart([]);
		setDiscount(0);
	};

	return (
		<ModuleLayout>
			<div className="space-y-6">
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
					<div>
						<h1 className="font-display font-extrabold text-[28px] text-[#0F172A] tracking-tight">
							Kasir
						</h1>
						<p className="text-[14px] text-[#475569] mt-1">
							Point of Sale — Transaksi Offline
						</p>
					</div>
					<div className="flex items-center gap-3">
						<span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#22C55E] bg-[#22C55E]/10 px-2.5 py-1 rounded-lg">
							<span className="w-1.5 h-1.5 rounded-lg bg-[#22C55E]"></span>
							{loading ? "Memuat..." : "Offline OK"}
						</span>
					</div>
				</div>

				<div className="grid lg:grid-cols-[1fr_380px] gap-6">
					<div className="space-y-5">
						<ProductGrid products={products} onAdd={addToCart} loading={loading} />

						<RecentTransactions transactions={recentTransactions} />
					</div>

					<div className="space-y-5">
						<CartPanel
							cart={cart}
							subtotal={subtotal}
							discount={discount}
							discountAmount={discountAmount}
							tax={tax}
							grandTotal={grandTotal}
							paymentMethod={paymentMethod}
							onSetDiscount={setDiscount}
							onSetPayment={setPaymentMethod}
							onUpdateQty={updateQty}
							onRemove={removeFromCart}
							onBayar={handleBayar}
							onClear={handleClearCart}
						/>

						<TransactionSummary
							totalTransactions={recentTransactions.length}
							totalSales={subtotal}
							avgTransaction={89000}
						/>
					</div>
				</div>
			</div>
		</ModuleLayout>
	);
}
