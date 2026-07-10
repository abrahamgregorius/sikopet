/** @format */

import { useState } from "react";
import { db } from "../../../database/index.js";

const ROLES = [
  { value: "admin", label: "Admin" },
  { value: "operator", label: "Operator" },
  { value: "ba", label: "Business Assistant (BA)" },
  { value: "pmo", label: "Project Management Officer (PMO)" },
];

export default function UserModal({ isOpen, onClose }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "operator",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      setError("Semua field wajib diisi.");
      return;
    }
    setLoading(true);
    try {
      await db.users.add({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        role: form.role,
        cooperativeId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      setForm({ name: "", email: "", password: "", role: "operator" });
      onClose();
    } catch (err) {
      setError("Gagal menyimpan user. Email mungkin sudah terdaftar.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <>
      <div
        onClick={handleBackdropClick}
        className={`overlay fixed inset-0 bg-[#0F172A]/40 z-[80] transition-opacity duration-200 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />
      <div
        className={`sheet-modal fixed inset-0 z-[90] grid place-items-center px-4 transition-opacity duration-200 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="user-modal-title"
      >
        <div
          className={`w-full max-w-[440px] bg-white rounded-3xl shadow-lift p-6 sm:p-7 transition-transform duration-200 ${
            isOpen ? "scale-100" : "scale-95"
          }`}
        >
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#EAF6FB] grid place-items-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#398eb3" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <line x1="19" y1="8" x2="19" y2="14" />
                  <line x1="22" y1="11" x2="16" y2="11" />
                </svg>
              </div>
              <h3 id="user-modal-title" className="font-display font-bold text-[#0F172A] text-[18px]">
                Tambah User Baru
              </h3>
            </div>
            <button
              onClick={onClose}
              className="focus-ring p-1.5 rounded-lg hover:bg-[#F1F5F9] text-[#94A3B8] transition-colors"
              aria-label="Tutup"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="user-name" className="block text-[12.5px] font-semibold text-[#475569] mb-1.5">
                Nama Lengkap
              </label>
              <input
                id="user-name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="cth. Budi Santoso"
                required
                className="focus-ring w-full h-[48px] px-4 rounded-[12px] border border-[#E5E7EB] bg-white text-[15px] text-[#0F172A] placeholder-[#9CA3AF] transition-colors duration-200 hover:border-[#D1D5DB] focus:border-[#398EB3] focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="user-email" className="block text-[12.5px] font-semibold text-[#475569] mb-1.5">
                Email
              </label>
              <input
                id="user-email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="cth. budi@koperasi.id"
                required
                className="focus-ring w-full h-[48px] px-4 rounded-[12px] border border-[#E5E7EB] bg-white text-[15px] text-[#0F172A] placeholder-[#9CA3AF] transition-colors duration-200 hover:border-[#D1D5DB] focus:border-[#398EB3] focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="user-password" className="block text-[12.5px] font-semibold text-[#475569] mb-1.5">
                Password
              </label>
              <input
                id="user-password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Minimal 8 karakter"
                required
                minLength={8}
                className="focus-ring w-full h-[48px] px-4 rounded-[12px] border border-[#E5E7EB] bg-white text-[15px] text-[#0F172A] placeholder-[#9CA3AF] transition-colors duration-200 hover:border-[#D1D5DB] focus:border-[#398EB3] focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="user-role" className="block text-[12.5px] font-semibold text-[#475569] mb-1.5">
                Role
              </label>
              <select
                id="user-role"
                name="role"
                value={form.role}
                onChange={handleChange}
                className="focus-ring w-full h-[48px] px-4 rounded-[12px] border border-[#E5E7EB] bg-white text-[15px] text-[#0F172A] transition-colors duration-200 hover:border-[#D1D5DB] focus:border-[#398EB3] focus:outline-none appearance-none cursor-pointer"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 16px center",
                  paddingRight: "40px",
                }}
              >
                {ROLES.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>

            {error && (
              <div className="rounded-xl bg-[#FEE2E2] border border-[#FECACA] px-4 py-3">
                <p className="text-[13px] text-[#EF4444] font-medium">{error}</p>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="focus-ring flex-1 h-[46px] rounded-full border border-[#D8E4EA] font-semibold text-[14px] text-[#475569] hover:bg-[#F1F5F9] transition-colors duration-200"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={loading}
                className="focus-ring flex-1 h-[46px] rounded-full bg-[#398eb3] text-white font-semibold text-[14px] hover:bg-[#2F7A9A] transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-glow"
              >
                {loading ? "Menyimpan..." : "Simpan User"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
