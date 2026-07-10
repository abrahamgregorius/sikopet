/** @format */

import { useState } from "react";

const CATEGORIES = ["Semua", "Sembako", "Minuman", "Toiletries", "Lainnya"];

export default function ProductGrid({ products, onAdd }) {
	const [activeCategory, setActiveCategory] = useState("Semua");
	const [search, setSearch] = useState("");

	const filtered = products.filter((p) => {
		const matchCat = activeCategory === "Semua" || p.category === activeCategory;
		const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
		return matchCat && matchSearch;
	});

	return (
		<div className="rounded-2xl bg-white border border-[#D8E4EA] shadow-soft p-5">
			<div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
				<div className="relative flex-1">
					<svg
						className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]"
						width="16"
						height="16"
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
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="focus-ring w-full h-[40px] pl-9 pr-4 rounded-xl border border-[#E5E7EB] bg-white text-[14px] text-[#0F172A] placeholder-[#9CA3AF] focus:border-[#398EB3] focus:outline-none transition-colors"
					/>
				</div>
				<div className="flex gap-2 overflow-x-auto pb-1">
					{CATEGORIES.map((cat) => (
						<button
							key={cat}
							onClick={() => setActiveCategory(cat)}
							className={`shrink-0 focus-ring px-3 py-1.5 rounded-full text-[12.5px] font-semibold transition-all ${
								activeCategory === cat
									? "bg-[#398EB3] text-white"
									: "bg-[#F1F5F9] text-[#475569] hover:bg-[#E5E7EB]"
							}`}
						>
							{cat}
						</button>
					))}
				</div>
			</div>

			<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
				{filtered.map((product) => (
					<button
						key={product.id}
						onClick={() => onAdd(product)}
						className="focus-ring text-left p-3.5 rounded-xl border border-[#E5E7EB] hover:border-[#398EB3] hover:shadow-soft transition-all group"
					>
						<div className="w-full h-16 rounded-lg bg-[#F1F5F9] mb-3 flex items-center justify-center">
							<svg
								width="28"
								height="28"
								viewBox="0 0 24 24"
								fill="none"
								stroke="#94A3B8"
								strokeWidth="1.5"
							>
								<path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0" />
							</svg>
						</div>
						<p className="text-[13px] font-semibold text-[#0F172A] leading-tight group-hover:text-[#398EB3] transition-colors">
							{product.name}
						</p>
						<p className="text-[14px] font-bold text-[#398EB3] mt-1">
							Rp {product.price.toLocaleString("id-ID")}
						</p>
						<p className="text-[11px] text-[#94A3B8] mt-0.5">
							Stok: {product.stock}
						</p>
					</button>
				))}
			</div>

			{filtered.length === 0 && (
				<div className="text-center py-10 text-[#94A3B8] text-[14px]">
					Produk tidak ditemukan
				</div>
			)}
		</div>
	);
}
