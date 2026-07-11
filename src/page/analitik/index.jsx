/** @format */

import { useState } from "react";
import BIExecutiveSummary from "../dashboard/components/BIExecutiveSummary";
import BIInventori from "../dashboard/components/BIInventori";
import BIKeuangan from "../dashboard/components/BIKeuangan";
import BIPengadaan from "../dashboard/components/BIPengadaan";
import BIPenjualan from "../dashboard/components/BIPenjualan";
import BISimpanPinjam from "../dashboard/components/BISimpanPinjam";
import { DashboardLayout } from "../../components/ui";

const BI_TABS = [
	{ id: "executive", label: "Eksekutif" },
	{ id: "simpanpinjam", label: "Simpan Pinjam" },
	{ id: "inventori", label: "Inventori" },
	{ id: "penjualan", label: "Penjualan" },
	{ id: "pengadaan", label: "Pengadaan" },
	{ id: "keuangan", label: "Keuangan" },
];

export default function Analitik() {
	const [biTab, setBiTab] = useState("executive");

	return (
		<DashboardLayout>
			<div>
				<div
					role="tablist"
					className="flex items-center gap-1 bg-[#F1F5F9] rounded-xl p-1 overflow-x-auto mb-4"
				>
					{BI_TABS.map((tab) => (
						<button
							key={tab.id}
							role="tab"
							aria-selected={biTab === tab.id}
							onClick={() => setBiTab(tab.id)}
							className={`px-4 py-2 rounded-lg text-[13px] font-semibold transition-all whitespace-nowrap ${
								biTab === tab.id
									? "bg-white text-[#398eb3] shadow-sm"
									: "text-[#475569] hover:text-[#0F172A]"
							}`}
						>
							{tab.label}
						</button>
					))}
				</div>

				{biTab === "executive" && <BIExecutiveSummary />}
				{biTab === "simpanpinjam" && <BISimpanPinjam />}
				{biTab === "inventori" && <BIInventori />}
				{biTab === "penjualan" && <BIPenjualan />}
				{biTab === "pengadaan" && <BIPengadaan />}
				{biTab === "keuangan" && <BIKeuangan />}
			</div>
		</DashboardLayout>
	);
}
