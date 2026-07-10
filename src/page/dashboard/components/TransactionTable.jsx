/** @format */

import { useState } from "react";
import { Badge, Button, Input, EmptyState } from "../../../components/ui";

const transactions = [
	{ name: "Koperasi Sejahtera Bersama", type: "Simpanan", amount: "Rp 4.200.000", status: "Berhasil", date: "14 Jul 2026" },
	{ name: "Koperasi Tani Makmur", type: "Pinjaman", amount: "Rp 12.500.000", status: "Tertunda", date: "14 Jul 2026" },
	{ name: "Koperasi Nusa Bakti", type: "Penjualan POS", amount: "Rp 863.000", status: "Berhasil", date: "13 Jul 2026" },
	{ name: "Koperasi Mitra Usaha", type: "Simpanan", amount: "Rp 1.750.000", status: "Gagal", date: "13 Jul 2026" },
	{ name: "Koperasi Karya Bersama", type: "Pinjaman", amount: "Rp 6.000.000", status: "Berhasil", date: "12 Jul 2026" },
];

const statusVariant = { Berhasil: "success", Tertunda: "warning", Gagal: "danger" };

export default function TransactionTable({ onCtxMenu }) {
	const [search, setSearch] = useState("");
	const [isFilterOpen, setIsFilterOpen] = useState(false);
	const filtered = transactions.filter(tx => tx.name.toLowerCase().includes(search.toLowerCase()));

	return (
		<section id="transaksi" aria-label="Transaksi terbaru" className="reveal in rounded-3xl bg-white border border-[#D8E4EA] overflow-hidden">
			<div className="p-6 pb-4">
				<div className="flex flex-wrap items-center justify-between gap-3">
					<div>
						<h3 className="font-display font-bold text-[#0F172A] text-[16px]">Transaksi Terbaru</h3>
						<p className="text-[12.5px] text-[#94A3B8] mt-0.5">Aktivitas keuangan dari seluruh unit koperasi</p>
					</div>
					<div className="flex items-center gap-2">
						<Input id="tx-search" type="search" placeholder="Cari…" value={search} onChange={(e) => setSearch(e.target.value)} className="!w-40 sm:!w-52" />
						<Button variant="secondary" onClick={() => setIsFilterOpen(!isFilterOpen)} className="!px-3.5 !py-2 !text-[13px]">
							<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 6h16M7 12h10M10 18h4" strokeLinecap="round" /></svg>
							Filter
							<svg style={{ transform: isFilterOpen ? "rotate(180deg)" : "rotate(0)" }} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="transition-transform"><path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" /></svg>
						</Button>
					</div>
				</div>

				<div className={`nested-panel ${isFilterOpen ? "nested-open" : ""}`}>
					<div className="flex flex-wrap gap-2 pt-4">
						{["Berhasil", "Tertunda", "Gagal"].map((f) => (
							<label key={f} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F1F5F9] text-[12.5px] font-medium text-[#475569] cursor-pointer">
								<input type="checkbox" className="accent-[#398eb3]" defaultChecked /> {f}
							</label>
						))}
						<label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F1F5F9] text-[12.5px] font-medium text-[#475569] cursor-pointer">Jenis: Semua ▾</label>
					</div>
				</div>
			</div>

			<div className="overflow-x-auto">
				{filtered.length > 0 ? (
					<table className="w-full text-left">
						<thead>
							<tr className="border-y border-[#D8E4EA] bg-[#F1F5F9]/60">
								<th scope="col" className="px-6 py-3 text-[11.5px] font-bold text-[#94A3B8] uppercase tracking-wide">Koperasi</th>
								<th scope="col" className="px-6 py-3 text-[11.5px] font-bold text-[#94A3B8] uppercase tracking-wide">Jenis</th>
								<th scope="col" className="px-6 py-3 text-[11.5px] font-bold text-[#94A3B8] uppercase tracking-wide">Jumlah</th>
								<th scope="col" className="px-6 py-3 text-[11.5px] font-bold text-[#94A3B8] uppercase tracking-wide">Status</th>
								<th scope="col" className="px-6 py-3 text-[11.5px] font-bold text-[#94A3B8] uppercase tracking-wide">Tanggal</th>
								<th scope="col" className="px-6 py-3 text-[11.5px] font-bold text-[#94A3B8] uppercase tracking-wide text-right">Aksi</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-[#E8EEF2]">
							{filtered.map((tx, idx) => (
								<tr key={idx} className="hover:bg-[#F1F5F9]/50">
									<td className="px-6 py-3.5 text-[13.5px] font-semibold text-[#0F172A]">{tx.name}</td>
									<td className="px-6 py-3.5 text-[13.5px] text-[#475569]">{tx.type}</td>
									<td className="px-6 py-3.5 text-[13.5px] font-semibold text-[#0F172A]">{tx.amount}</td>
									<td className="px-6 py-3.5">
										<Badge variant={statusVariant[tx.status]} showDot>{tx.status}</Badge>
									</td>
									<td className="px-6 py-3.5 text-[13px] text-[#94A3B8]">{tx.date}</td>
									<td className="px-6 py-3.5 text-right">
										<button onClick={onCtxMenu} className="focus-ring p-1.5 rounded-lg hover:bg-[#F1F5F9] text-[#94A3B8]" aria-label="Menu aksi"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="5" r="1.4" /><circle cx="12" cy="12" r="1.4" /><circle cx="12" cy="19" r="1.4" /></svg></button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				) : (
					<EmptyState
						icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="1.6"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" strokeLinecap="round" /></svg>}
						title="Tidak ada transaksi ditemukan"
						description="Coba ubah kata kunci pencarian atau atur ulang filter Anda."
					/>
				)}
			</div>

			{filtered.length > 0 && (
				<div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-t border-[#D8E4EA]">
					<p className="text-[12.5px] text-[#94A3B8]">Menampilkan 1–{filtered.length} dari 248 transaksi</p>
					<nav className="flex items-center gap-1" aria-label="Pagination">
						<button className="focus-ring w-8 h-8 rounded-lg text-[#94A3B8] hover:bg-[#F1F5F9]" aria-label="Sebelumnya">‹</button>
						<button className="focus-ring w-8 h-8 rounded-lg bg-[#398eb3] text-white font-semibold text-[13px]">1</button>
						<button className="focus-ring w-8 h-8 rounded-lg text-[#475569] hover:bg-[#F1F5F9] font-semibold text-[13px]">2</button>
						<button className="focus-ring w-8 h-8 rounded-lg text-[#475569] hover:bg-[#F1F5F9] font-semibold text-[13px]">3</button>
						<span className="px-1 text-[#94A3B8]">…</span>
						<button className="focus-ring w-8 h-8 rounded-lg text-[#475569] hover:bg-[#F1F5F9] font-semibold text-[13px]">50</button>
						<button className="focus-ring w-8 h-8 rounded-lg text-[#94A3B8] hover:bg-[#F1F5F9]" aria-label="Berikutnya">›</button>
					</nav>
				</div>
			)}
		</section>
	);
}
