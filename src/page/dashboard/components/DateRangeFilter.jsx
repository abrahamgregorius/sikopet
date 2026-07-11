/** @format */

const RANGES = [
	{ id: "7d", label: "7 Hari" },
	{ id: "30d", label: "30 Hari" },
	{ id: "thisMonth", label: "Bulan Ini" },
	{ id: "all", label: "Semua" },
];

export default function DateRangeFilter({ value, onChange }) {
	return (
		<div
			role="tablist"
			className="inline-flex bg-[#F1F5F9] rounded-lg p-1 gap-0.5"
		>
			{RANGES.map((r) => (
				<button
					key={r.id}
					role="tab"
					aria-selected={value === r.id}
					onClick={() => onChange(r.id)}
					className={`focus-ring px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-colors ${
						value === r.id
							? "bg-white text-[#0F172A] shadow-sm"
							: "text-[#475569] hover:text-[#0F172A]"
					}`}
				>
					{r.label}
				</button>
			))}
		</div>
	);
}
