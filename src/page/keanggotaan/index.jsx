/** @format */

import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../../database/index.js";
import { pushToOutbox } from "../../lib/syncService";
import { useAuth } from "../../contexts/AuthContext";
import DashboardLayout from "../../components/ui/DashboardLayout";
import MemberList from "./components/MemberList";
import MemberStats from "./components/MemberStats";
import MemberForm from "./components/MemberForm";
import MemberDetail from "./components/MemberDetail";
import { exportMembersToCSV, exportMembersToExcel } from "../../lib/exportUtils";

export default function KeanggotaanPage() {
	const { user } = useAuth();
	const [selectedMember, setSelectedMember] = useState(null);
	const [showForm, setShowForm] = useState(false);
	const [editingMember, setEditingMember] = useState(null);
	const [search, setSearch] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");

	const members = useLiveQuery(
		() =>
			db.members
				.orderBy("name")
				.toArray(),
		[]
	);

	const filtered = (members || []).filter((m) => {
		const matchSearch =
			(m.name || "").toLowerCase().includes(search.toLowerCase()) ||
			(m.nik || "").includes(search) ||
			(m.phone || "").includes(search);
		const matchStatus = statusFilter === "all" || m.status === statusFilter;
		return matchSearch && matchStatus;
	});

	const nextMemberNumber = (() => {
		if (!members) return "KSP-0001";
		const nums = members
			.map((m) => {
				const match = (m.memberNumber || "").match(/KSP-(\d+)/);
				return match ? parseInt(match[1], 10) : 0;
			})
			.filter((n) => n > 0);
		const max = nums.length > 0 ? Math.max(...nums) : 0;
		return "KSP-" + String(max + 1).padStart(4, "0");
	})();

	const handleAddMember = async (data) => {
		if (!user) return;
		const cooperativeId = user.cooperativeId || 1;

		if (editingMember) {
			const updated = {
				...editingMember,
				nik: data.nik,
				name: data.name,
				bornDate: data.bornDate,
				address: data.address || "",
				phone: data.phone,
			};
			await db.members.update(editingMember.id, updated);
			await pushToOutbox({
				entityType: "members",
				operationType: "update",
				payload: updated,
				localId: editingMember.id,
			});
		} else {
			const newMember = {
				cooperativeId,
				memberNumber: data.memberNumber,
				nik: data.nik,
				name: data.name,
				bornDate: data.bornDate,
				address: data.address || "",
				phone: data.phone,
				status: "pending",
				joinDate: new Date().toISOString().split("T")[0],
				cloudId: null,
				syncedAt: null,
			};
			const id = await db.members.add(newMember);
			await pushToOutbox({
				entityType: "members",
				operationType: "create",
				payload: { ...newMember, id },
			});
		}
		setShowForm(false);
		setEditingMember(null);
	};

	return (
		<DashboardLayout>
			<div className="space-y-6">
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
					<div>
						<h1 className="font-display font-extrabold text-[28px] text-[#0F172A] tracking-tight">
							Keanggotaan
						</h1>
						<p className="text-[14px] text-[#475569] mt-1">
							Pengelolaan Anggota Cooperativa
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
									onClick={() => exportMembersToCSV(members || [])}
									disabled={!members || members.length === 0}
									className="w-full text-left px-4 py-2.5 text-[13px] text-[#374151] hover:bg-[#F1F5F9] transition-colors first:rounded-t-lg last:rounded-b-lg disabled:opacity-50 disabled:cursor-not-allowed"
								>
									Export as CSV
								</button>
								<button
									onClick={() => exportMembersToExcel(members || [])}
									disabled={!members || members.length === 0}
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
							Daftar Anggota Baru
						</button>
					</div>
				</div>

				<MemberStats members={members || []} />

				<div className="grid lg:grid-cols-[1fr_360px] gap-6">
					<MemberList
						members={filtered}
						search={search}
						statusFilter={statusFilter}
						onSearch={setSearch}
						onFilter={setStatusFilter}
						onSelect={setSelectedMember}
						selectedId={selectedMember?.id}
					/>

					{selectedMember ? (
						<MemberDetail
							member={selectedMember}
							onClose={() => setSelectedMember(null)}
							onEdit={() => {
								setEditingMember(selectedMember);
								setShowForm(true);
							}}
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
									<path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" />
								</svg>
							</div>
							<p className="text-[14px] text-[#94A3B8]">
								Pilih anggota untuk melihat detail
							</p>
						</div>
					)}
				</div>
			</div>

			{showForm && (
				<MemberForm
					onClose={() => {
						setShowForm(false);
						setEditingMember(null);
					}}
					onSubmit={handleAddMember}
					nextMemberNumber={nextMemberNumber}
					member={editingMember}
				/>
			)}
		</DashboardLayout>
	);
}
