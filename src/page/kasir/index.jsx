/** @format */

import { useState } from "react";
import ModuleLayout from "../modules/ModuleLayout";
import ProductGrid from "./components/ProductGrid";
import CartPanel from "./components/CartPanel";
import TransactionSummary from "./components/TransactionSummary";
import RecentTransactions from "./components/RecentTransactions";

const MOCK_PRODUCTS = [
	{
		id: 1,
		name: "Beras Premium 5kg",
		price: 75000,
		stock: 120,
		category: "Sembako",
	},
	{
		id: 2,
		name: "Minyak Goreng 1L",
		price: 18500,
		stock: 85,
		category: "Sembako",
	},
	{
		id: 3,
		name: "Gula Pasir 1kg",
		price: 15000,
		stock: 200,
		category: "Sembako",
	},
	{
		id: 4,
		name: "Telur Ayam 1kg",
		price: 28000,
		stock: 60,
		category: "Sembako",
	},
	{ id: 5, name: "Mie Instan", price: 3500, stock: 500, category: "Sembako" },
	{ id: 6, name: "Kopi Sachet", price: 2500, stock: 300, category: "Minuman" },
	{
		id: 7,
		name: "Teh Celup 25s",
		price: 8000,
		stock: 150,
		category: "Minuman",
	},
	{
		id: 8,
		name: "Sabun Mandi 100g",
		price: 5500,
		stock: 200,
		category: "Toiletries",
	},
	{
		id: 9,
		name: "Shampo Botol 170ml",
		price: 12000,
		stock: 75,
		category: "Toiletries",
	},
	{
		id: 10,
		name: "Pasta Gigi 150g",
		price: 9500,
		stock: 120,
		category: "Toiletries",
	},
	{ id: 11, name: "Gas LPG 3kg", price: 28000, stock: 40, category: "Lainnya" },
	{ id: 12, name: "Korek Api", price: 3000, stock: 400, category: "Lainnya" },
];

export default function KasirPage() {
	const [cart, setCart] = useState([]);
	const [discount, setDiscount] = useState(0);
	const [paymentMethod, setPaymentMethod] = useState("cash");

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

	const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
	const discountAmount = (discount / 100) * subtotal;
	const total = subtotal - discountAmount;
	const tax = total * 0.11;
	const grandTotal = total + tax;

	const handleBayar = () => {
		if (cart.length === 0) return;
		alert(
			`Pembayaran berhasil!\nMetode: ${paymentMethod}\nTotal: Rp ${grandTotal.toLocaleString("id-ID")}`,
		);
		setCart([]);
		setDiscount(0);
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
							Offline OK
						</span>
					</div>
				</div>

				<div className="grid lg:grid-cols-[1fr_380px] gap-6">
					<div className="space-y-5">
						<ProductGrid products={MOCK_PRODUCTS} onAdd={addToCart} />

						<RecentTransactions />
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
							totalTransactions={127}
							totalSales={subtotal}
							avgTransaction={89000}
						/>
					</div>
				</div>
			</div>
		</ModuleLayout>
	);
}
