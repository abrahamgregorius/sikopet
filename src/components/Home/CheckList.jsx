/** @format */

export default function CheckList({ items, className = "" }) {
	return (
		<ul className={`space-y-2.5 ${className}`}>
			{items.map((text, i) => (
				<li
					key={i}
					className="flex items-center gap-2.5 text-[14.5px] text-[#475569]"
				>
					<svg
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="#4CC9B0"
						strokeWidth="2.5"
						className="shrink-0"
					>
						<path
							d="M5 13l4 4L19 7"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
					{text}
				</li>
			))}
		</ul>
	);
}
