/** @format */

import { useState } from "react";
import { Badge, Button, Input, EmptyState } from "../../../components/ui";
import { useDashboardData } from "../../../hooks/useDashboardData.jsx";

const statusVariant = { Berhasil: "success", Tertunda: "warning", Gagal: "danger" };

export default function TransactionTable({ onCtxMenu }) {
  const { transactions, loading } = useDashboardData();
  const [search, setSearch] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState(["Berhasil", "Tertunda", "Gagal"]);

  const filtered = transactions.filter((tx) => {
    const matchSearch =
      tx.name.toLowerCase().includes(search.toLowerCase()) ||
      tx.type.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter.includes(tx.status);
    return matchSearch && matchStatus;
  });

  const toggleStatus = (s) => {
    setStatusFilter((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  };

  return (
    <section id="transaksi" aria-label="Transaksi terbaru" className="reveal in rounded-3xl bg-white border border-[#D8E4EA] overflow-hidden">
      <div className="p-6 pb-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-display font-bold text-[#0F172A] text-[16px]">Transaksi Terbaru</h3>
            <p className="text-[12.5px] text-[#94A3B8] mt-0.5">
              {loading ? "Memuat..." : `${transactions.length} transaksi tersimpan`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Input
              id="tx-search"
              type="search"
              placeholder="Cari..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="!w-40 sm:!w-52"
            />
            <Button variant="secondary" onClick={() => setIsFilterOpen(!isFilterOpen)} className="!px-3.5 !py-2 !text-[13px]">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M4 6h16M7 12h10M10 18h4" strokeLinecap="round" />
              </svg>
              Filter
            </Button>
          </div>
        </div>

        <div className={`nested-panel ${isFilterOpen ? "nested-open" : ""}`}>
          <div className="flex flex-wrap gap-2 pt-4">
            {["Berhasil", "Tertunda", "Gagal"].map((f) => (
              <label
                key={f}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F1F5F9] text-[12.5px] font-medium text-[#475569] cursor-pointer"
              >
                <input
                  type="checkbox"
                  className="accent-[#398eb3]"
                  checked={statusFilter.includes(f)}
                  onChange={() => toggleStatus(f)}
                />{" "}
                {f}
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        {filtered.length > 0 ? (
          <table className="w-full text-left">
            <thead>
              <tr className="border-y border-[#D8E4EA] bg-[#F1F5F9]/60">
                <th scope="col" className="px-6 py-3 text-[11.5px] font-bold text-[#94A3B8] uppercase tracking-wide">Keterangan</th>
                <th scope="col" className="px-6 py-3 text-[11.5px] font-bold text-[#94A3B8] uppercase tracking-wide">Jenis</th>
                <th scope="col" className="px-6 py-3 text-[11.5px] font-bold text-[#94A3B8] uppercase tracking-wide">Jumlah</th>
                <th scope="col" className="px-6 py-3 text-[11.5px] font-bold text-[#94A3B8] uppercase tracking-wide">Status</th>
                <th scope="col" className="px-6 py-3 text-[11.5px] font-bold text-[#94A3B8] uppercase tracking-wide">Tanggal</th>
                <th scope="col" className="px-6 py-3 text-[11.5px] font-bold text-[#94A3B8] uppercase tracking-wide text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8EEF2]">
              {filtered.map((tx) => (
                <tr key={tx.id} className="hover:bg-[#F1F5F9]/50">
                  <td className="px-6 py-3.5 text-[13.5px] font-semibold text-[#0F172A]">{tx.name}</td>
                  <td className="px-6 py-3.5 text-[13.5px] text-[#475569]">{tx.type}</td>
                  <td className="px-6 py-3.5 text-[13.5px] font-semibold text-[#0F172A]">{tx.amountFormatted}</td>
                  <td className="px-6 py-3.5">
                    <Badge variant={statusVariant[tx.status] || "neutral"} showDot>{tx.status}</Badge>
                  </td>
                  <td className="px-6 py-3.5 text-[13px] text-[#94A3B8]">{tx.date}</td>
                  <td className="px-6 py-3.5 text-right">
                    <button onClick={onCtxMenu} className="focus-ring p-1.5 rounded-lg hover:bg-[#F1F5F9] text-[#94A3B8]" aria-label="Menu aksi">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="5" r="1.4" /><circle cx="12" cy="12" r="1.4" /><circle cx="12" cy="19" r="1.4" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <EmptyState
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="1.6">
                <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" strokeLinecap="round" />
              </svg>
            }
            title="Belum ada transaksi"
            description="Transaksi akan muncul di sini setelah data tersinkronisasi dari server."
          />
        )}
      </div>

      {filtered.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-t border-[#D8E4EA]">
          <p className="text-[12.5px] text-[#94A3B8]">
            Menampilkan {filtered.length} dari {transactions.length} transaksi
          </p>
        </div>
      )}
    </section>
  );
}
