/** @format */

import { useState } from "react";
import ModuleLayout from "../modules/ModuleLayout";
import MemberList from "./components/MemberList";
import MemberStats from "./components/MemberStats";
import MemberForm from "./components/MemberForm";
import MemberDetail from "./components/MemberDetail";

const MOCK_MEMBERS = [
	{ id: 1, nik: "3571024806910001", name: "Rina Wulandari", bornDate: "1986-07-15", address: "Jl. Melati No. 12, Surabaya", phone: "081234567890", joinDate: "2023-01-15", status: "active", savings: 5500000, loans: 2000000 },
	{ id: 2, nik: "3571025505920002", name: "Bambang Sutrisno", bornDate: "1992-05-25", address: "Jl. Anggrek No. 8, Surabaya", phone: "081234567891", joinDate: "2023-03-22", status: "active", savings: 8200000, loans: 5000000 },
	{ id: 3, nik: "3571030101930003", name: "Made Ayu Kartika", bornDate: "1993-01-01", address: "Jl. Kenanga No. 5, Surabaya", phone: "081234567892", joinDate: "2023-06-10", status: "active", savings: 3200000, loans: 0 },
	{ id: 4, nik: "3571031510940004", name: "Ahmad Hidayat", bornDate: "1994-10-15", address: "Jl. Mawar No. 3, Sidoarjo", phone: "081234567893", joinDate: "2024-02-28", status: "active", savings: 1500000, loans: 3000000 },
	{ id: 5, nik: "3571042010950005", name: "Siti Aminah", bornDate: "1995-10-20", address: "Jl. Dahlia No. 17, Surabaya", phone: "081234567894", joinDate: "2024-05-12", status: "inactive", savings: 0, loans: 0 },
	{ id: 6, nik: "3571053011960006", name: "Dewi Lestari", bornDate: "1996-11-30", address: "Jl. Anggrek No. 22, Gresik", phone: "081234567895", joinDate: "2024-08-03", status: "active", savings: 4500000, loans: 1000000 },
	{ id: 7, nik: "3571061012970007", name: "Joko Pramono", bornDate: "1997-12-10", address: "Jl. Jasmin No. 9, Surabaya", phone: "081234567896", joinDate: "2025-01-18", status: "pending", savings: 500000, loans: 0 },
	{ id: 8, nik: "3571071510980008", name: "Nur Hasanah", bornDate: "1998-10-15", address: "Jl. Flamboyan No. 11, Surabaya", phone: "081234567897", joinDate: "2025-03-25", status: "active", savings: 2100000, loans: 1500000 },
];

export default function KeanggotaanPage() {
	const [members, setMembers] = useState(MOCK_MEMBERS);
	const [selectedMember, setSelectedMember] = useState(null);
	const [showForm, setShowForm] = useState(false);
	const [search, setSearch] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");

	const filtered = members.filter((m) => {
		const matchSearch =
			m.name.toLowerCase().includes(search.toLowerCase()) ||
			m.nik.includes(search) ||
			m.phone.includes(search);
		const matchStatus = statusFilter === "all" || m.status === statusFilter;
		return matchSearch && matchStatus;
	});

	const handleAddMember = (data) => {
		const newMember = {
			id: members.length + 1,
			...data,
			status: "pending",
			savings: 0,
			loans: 0,
		};
		setMembers((prev) => [newMember, ...prev]);
		setShowForm(false);
	};

	return (
		<ModuleLayout>
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
					<button
						onClick={() => setShowForm(true)}
						className="focus-ring inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#398EB3] text-white font-semibold text-[14.5px] shadow-glow hover:bg-[#2F7A9A] hover:-translate-y-0.5 transition-all"
					>
						<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
							<path d="M12 5v14M5 12h14" strokeLinecap="round" />
						</svg>
						Daftar Anggota Baru
					</button>
				</div>

				<MemberStats members={members} />

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
						<MemberDetail member={selectedMember} onClose={() => setSelectedMember(null)} />
					) : (
						<div className="rounded-2xl bg-white border border-[#D8E4EA] shadow-soft p-8 flex flex-col items-center justify-center text-center">
							<div className="w-14 h-14 rounded-full bg-[#F1F5F9] grid place-items-center mb-4">
								<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="1.8">
									<path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" />
								</svg>
							</div>
							<p className="text-[14px] text-[#94A3B8]">Pilih anggota untuk melihat detail</p>
						</div>
					)}
				</div>
			</div>

			{showForm && (
				<MemberForm onClose={() => setShowForm(false)} onSubmit={handleAddMember} />
			)}
		</ModuleLayout>
	);
}
