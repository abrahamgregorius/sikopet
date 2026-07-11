/** @format */

import { useState, useEffect } from "react";
import { db } from "../../../database/index.js";
import Breadcrumb from "./Breadcrumb";

const ROLES = [
	{ value: "admin", label: "Admin" },
	{ value: "operator", label: "Operator" },
	{ value: "ba", label: "Business Assistant (BA)" },
	{ value: "pmo", label: "Project Management Officer (PMO)" },
];

const ROLE_COLORS = {
	admin: "text-[#EF4444] bg-[#FEE2E2]",
	operator: "text-[#398eb3] bg-[#EAF6FB]",
	ba: "text-[#8B5CF6] bg-[#F3E8FF]",
	pmo: "text-[#F59E0B] bg-[#FEF3C7]",
};

const ROLE_Badge = {
	admin: "text-[#EF4444] bg-[#FEE2E2]",
	operator: "text-[#398eb3] bg-[#EAF6FB]",
	ba: "text-[#8B5CF6] bg-[#F3E8FF]",
	pmo: "text-[#F59E0B] bg-[#FEF3C7]",
};

export default function UsersPage() {
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState("");
	const [filterRole, setFilterRole] = useState("all");
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingUser, setEditingUser] = useState(null);
	const [toast, setToast] = useState(null);
	const [form, setForm] = useState({
		name: "",
		email: "",
		password: "",
		role: "operator",
		cooperativeId: 1,
	});
	const [formError, setFormError] = useState("");

	useEffect(() => {
		loadUsers();
	}, []);

	async function loadUsers() {
		setLoading(true);
		try {
			const allUsers = await db.users.toArray();
			setUsers(
				allUsers.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
			);
		} catch (err) {
			console.error("[UsersPage] Failed to load users:", err);
			showToast("Gagal memuat data pengguna", "error");
		} finally {
			setLoading(false);
		}
	}

	function showToast(message, type) {
		setToast({ message, type });
		setTimeout(() => setToast(null), 3000);
	}

	function resetForm() {
		setForm({
			name: "",
			email: "",
			password: "",
			role: "operator",
			cooperativeId: 1,
		});
		setFormError("");
		setEditingUser(null);
	}

	function openCreateModal() {
		resetForm();
		setIsModalOpen(true);
	}

	function openEditModal(user) {
		setEditingUser(user);
		setForm({
			name: user.name,
			email: user.email,
			password: "",
			role: user.role,
			cooperativeId: user.cooperativeId,
		});
		setIsModalOpen(true);
	}

	async function handleSubmit(e) {
		e.preventDefault();

		if (!form.name.trim() || !form.email.trim()) {
			setFormError("Nama dan email wajib diisi");
			return;
		}

		if (!editingUser && !form.password.trim()) {
			setFormError("Password wajib diisi untuk user baru");
			return;
		}

		if (form.password && form.password.length < 8) {
			setFormError("Password minimal 8 karakter");
			return;
		}

		try {
			const userData = {
				name: form.name.trim(),
				email: form.email.trim().toLowerCase(),
				role: form.role,
				cooperativeId: form.cooperativeId,
				updatedAt: new Date(),
			};

			if (form.password) {
				userData.password = form.password;
			}

			if (editingUser) {
				await db.users.update(editingUser.id, userData);
				showToast("User berhasil diperbarui", "success");
			} else {
				userData.createdAt = new Date();
				await db.users.add(userData);
				showToast("User berhasil dibuat", "success");
			}

			setIsModalOpen(false);
			resetForm();
			loadUsers();
			window.dispatchEvent(new CustomEvent("modules-updated"));
		} catch (err) {
			console.error("[UsersPage] Save failed:", err);
			if (err.message?.includes("unique")) {
				setFormError("Email sudah terdaftar");
			} else {
				setFormError("Gagal menyimpan user");
			}
		}
	}

	async function handleDelete(user) {
		if (!confirm(`Hapus user "${user.name}"?`)) return;

		try {
			await db.users.delete(user.id);
			showToast("User berhasil dihapus", "success");
			loadUsers();
			window.dispatchEvent(new CustomEvent("modules-updated"));
		} catch (err) {
			console.error("[UsersPage] Delete failed:", err);
			showToast("Gagal menghapus user", "error");
		}
	}

	function getFilteredUsers() {
		let filtered = [...users];

		if (searchQuery) {
			const q = searchQuery.toLowerCase();
			filtered = filtered.filter(
				(u) =>
					u.name.toLowerCase().includes(q) ||
					u.email.toLowerCase().includes(q) ||
					u.role.toLowerCase().includes(q),
			);
		}

		if (filterRole !== "all") {
			filtered = filtered.filter((u) => u.role === filterRole);
		}

		return filtered;
	}

	const filteredUsers = getFilteredUsers();

	return (
		<div className="space-y-6">
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h1 className="font-display font-extrabold text-[28px] sm:text-[32px] text-[#0F172A] tracking-tight">
						Karyawan
					</h1>
					<p className="text-[14px] text-[#6B7280] mt-1">
						Kelola data karyawan dan kredensial akses
					</p>
				</div>
				<button
					onClick={openCreateModal}
					className="focus-ring inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#398eb3] text-white font-semibold text-[14px] hover:bg-[#2F7A9A] transition-colors shadow-glow"
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
					Tambah Karyawan
				</button>
			</div>

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
						placeholder="Cari karyawan..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="focus-ring w-full h-[44px] pl-10 pr-4 rounded-[12px] border border-[#E5E7EB] bg-white text-[14px] text-[#0F172A] placeholder-[#9CA3AF] transition-colors"
					/>
				</div>
				<select
					value={filterRole}
					onChange={(e) => setFilterRole(e.target.value)}
					className="focus-ring h-[44px] px-4 rounded-[12px] border border-[#E5E7EB] bg-white text-[14px] text-[#0F172A] transition-colors"
				>
					<option value="all">Semua Role</option>
					{ROLES.map((r) => (
						<option key={r.value} value={r.value}>
							{r.label}
						</option>
					))}
				</select>
			</div>

			<div className="rounded-lg bg-white border border-[#D8E4EA] overflow-hidden">
				{loading ? (
					<div className="flex items-center justify-center h-48">
						<div className="w-8 h-8 border-2 border-[#398eb3] border-t-transparent rounded-lg animate-spin" />
					</div>
				) : filteredUsers.length === 0 ? (
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
								<circle cx="9" cy="8" r="3" />
								<path
									d="M2 20a7 7 0 0114 0M16 6a3 3 0 010 6M22 20a7 7 0 00-6-6.9"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
						</div>
						<p className="text-[14px] text-[#94A3B8]">
							Tidak ada karyawan ditemukan
						</p>
					</div>
				) : (
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead>
								<tr className="border-b border-[#E8EEF2]">
									<th className="text-left px-5 py-3.5 text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider">
										Nama
									</th>
									<th className="text-left px-5 py-3.5 text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider">
										Email
									</th>
									<th className="text-left px-5 py-3.5 text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider">
										Role
									</th>
									<th className="text-left px-5 py-3.5 text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider">
										Bergabung
									</th>
									<th className="text-right px-5 py-3.5 text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider">
										Aksi
									</th>
								</tr>
							</thead>
							<tbody>
								{filteredUsers.map((user) => (
									<tr
										key={user.id}
										className="border-b border-[#E8EEF2] last:border-0 hover:bg-[#F7FAFB] transition-colors"
									>
										<td className="px-5 py-4">
											<div className="flex items-center gap-3">
												<div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#398eb3] to-[#2F7698] grid place-items-center text-white text-[13px] font-bold">
													{user.name
														.split(" ")
														.map((n) => n[0])
														.join("")
														.slice(0, 2)
														.toUpperCase()}
												</div>
												<span className="font-medium text-[14px] text-[#0F172A]">
													{user.name}
												</span>
											</div>
										</td>
										<td className="px-5 py-4 text-[14px] text-[#6B7280]">
											{user.email}
										</td>
										<td className="px-5 py-4">
											<span
												className={`inline-flex px-2.5 py-1 rounded-lg text-[11px] font-semibold ${ROLE_COLORS[user.role] || "text-[#94A3B8] bg-[#F1F5F9]"}`}
											>
												{ROLES.find((r) => r.value === user.role)?.label ||
													user.role}
											</span>
										</td>
										<td className="px-5 py-4 text-[13px] text-[#94A3B8]">
											{new Date(user.createdAt).toLocaleDateString("id-ID", {
												day: "numeric",
												month: "short",
												year: "numeric",
											})}
										</td>
										<td className="px-5 py-4">
											<div className="flex items-center justify-end gap-2">
												<button
													onClick={() => openEditModal(user)}
													className="focus-ring p-2 rounded-lg hover:bg-[#F1F5F9] text-[#94A3B8] hover:text-[#398eb3] transition-colors"
													aria-label="Edit"
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
													onClick={() => handleDelete(user)}
													className="focus-ring p-2 rounded-lg hover:bg-[#FEE2E2] text-[#94A3B8] hover:text-[#EF4444] transition-colors"
													aria-label="Hapus"
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
								))}
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
						<div className="w-full max-w-[440px] bg-white rounded-lg shadow-lift p-6 sm:p-7">
							<div className="flex items-center justify-between mb-5">
								<h3 className="font-display font-bold text-[18px] text-[#0F172A]">
									{editingUser ? "Edit Karyawan" : "Karyawan Baru"}
								</h3>
								<button
									onClick={() => setIsModalOpen(false)}
									className="focus-ring p-1.5 rounded-lg hover:bg-[#F1F5F9] text-[#94A3B8]"
									aria-label="Tutup"
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
										Nama Lengkap
									</label>
									<input
										type="text"
										value={form.name}
										onChange={(e) => setForm({ ...form, name: e.target.value })}
										placeholder="cth. Budi Santoso"
										className="focus-ring w-full h-[48px] px-4 rounded-[12px] border border-[#E5E7EB] bg-white text-[15px] text-[#0F172A] placeholder-[#9CA3AF] transition-colors hover:border-[#D1D5DB] focus:border-[#398EB3] focus:outline-none"
									/>
								</div>

								<div>
									<label className="block text-[12.5px] font-semibold text-[#475569] mb-1.5">
										Email
									</label>
									<input
										type="email"
										value={form.email}
										onChange={(e) =>
											setForm({ ...form, email: e.target.value })
										}
										placeholder="cth. budi@koperasi.id"
										className="focus-ring w-full h-[48px] px-4 rounded-[12px] border border-[#E5E7EB] bg-white text-[15px] text-[#0F172A] placeholder-[#9CA3AF] transition-colors hover:border-[#D1D5DB] focus:border-[#398EB3] focus:outline-none"
									/>
								</div>

								<div>
									<label className="block text-[12.5px] font-semibold text-[#475569] mb-1.5">
										Password {editingUser && "(kosongkan jika tidak diubah)"}
									</label>
									<input
										type="password"
										value={form.password}
										onChange={(e) =>
											setForm({ ...form, password: e.target.value })
										}
										placeholder={
											editingUser ? "Minimal 8 karakter" : "Minimal 8 karakter"
										}
										className="focus-ring w-full h-[48px] px-4 rounded-[12px] border border-[#E5E7EB] bg-white text-[15px] text-[#0F172A] placeholder-[#9CA3AF] transition-colors hover:border-[#D1D5DB] focus:border-[#398EB3] focus:outline-none"
									/>
								</div>

								<div>
									<label className="block text-[12.5px] font-semibold text-[#475569] mb-1.5">
										Role / Jabatan
									</label>
									<select
										value={form.role}
										onChange={(e) => setForm({ ...form, role: e.target.value })}
										className="focus-ring w-full h-[48px] px-4 rounded-[12px] border border-[#E5E7EB] bg-white text-[15px] text-[#0F172A] transition-colors hover:border-[#D1D5DB] focus:border-[#398EB3] focus:outline-none appearance-none cursor-pointer"
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

								{formError && (
									<div className="rounded-lg bg-[#FEE2E2] border border-[#FECACA] px-4 py-3">
										<p className="text-[13px] text-[#EF4444] font-medium">
											{formError}
										</p>
									</div>
								)}

								<div className="flex gap-3 pt-2">
									<button
										type="button"
										onClick={() => setIsModalOpen(false)}
										className="focus-ring flex-1 h-[46px] rounded-lg border border-[#D8E4EA] font-semibold text-[14px] text-[#475569] hover:bg-[#F1F5F9] transition-colors"
									>
										Batal
									</button>
									<button
										type="submit"
										className="focus-ring flex-1 h-[46px] rounded-lg bg-[#398eb3] text-white font-semibold text-[14px] hover:bg-[#2F7A9A] transition-colors shadow-glow"
									>
										{editingUser ? "Simpan Perubahan" : "Buat Karyawan"}
									</button>
								</div>
							</form>
						</div>
					</div>
				</>
			)}

			{toast && (
				<div
					className={`fixed bottom-6 right-6 z-[100] px-5 py-3 rounded-lg shadow-lift flex items-center gap-3 animate-pop-in ${
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
