/** @format */

export default function Toggle({
	checked = false,
	onChange,
	disabled = false,
	label,
	className = "",
	...props
}) {
	return (
		<label
			className={`inline-flex items-center gap-2.5 cursor-pointer ${
				disabled ? "opacity-50 cursor-not-allowed" : ""
			} ${className}`}
		>
			<button
				type="button"
				role="switch"
				aria-checked={checked}
				disabled={disabled}
				onClick={() => !disabled && onChange?.(!checked)}
				className={`focus-ring relative inline-flex h-6 w-11 shrink-0 rounded-lg border-2 border-transparent transition-colors duration-300 ${
					checked ? "bg-[#398EB3]" : "bg-[#D1D5DB]"
				}`}
				{...props}
			>
				<span
					className={`pointer-events-none inline-block h-5 w-5 rounded-lg bg-white shadow-lg ring-0 transition-transform duration-300 ${
						checked ? "translate-x-5" : "translate-x-0"
					}`}
				/>
			</button>
			{label && <span className="text-[14.5px] text-[#334155]">{label}</span>}
		</label>
	);
}
