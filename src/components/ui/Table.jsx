/** @format */

export default function Table({ columns = [], rows = [], className = "" }) {
	return (
		<div className={`w-full overflow-x-auto ${className}`}>
			<table className="w-full min-w-[640px]">
				<thead>
					<tr className="border-b border-[#E8EEF2]">
						{columns.map((col, i) => (
							<th
								key={col.key || i}
								className={`px-4 py-3 text-[12px] font-semibold text-[#64748B] uppercase tracking-wide ${
									col.align === "right" ? "text-right" : "text-left"
								}`}
							>
								{col.label}
							</th>
						))}
					</tr>
				</thead>
				<tbody className="divide-y divide-[#F1F5F9]">
					{rows.map((row, rowIdx) => (
						<tr
							key={row.id || rowIdx}
							className="hover:bg-[#F8FAFC] transition-colors"
						>
							{columns.map((col, colIdx) => (
								<td
									key={col.key || colIdx}
									className={`px-4 py-3.5 text-[14.5px] text-[#334155] ${
										col.align === "right" ? "text-right" : ""
									}`}
								>
									{col.render
										? col.render(row[col.key], row)
										: row[col.key]}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
