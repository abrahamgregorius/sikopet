/** @format */

export default function Checkbox({
	label,
	id,
	checked,
	onChange,
	className = "",
	...props
}) {
	return (
		<label className={`flex items-center gap-2 cursor-pointer ${className}`}>
			<input
				id={id}
				type="checkbox"
				checked={checked}
				onChange={onChange}
				className="focus-ring w-4 h-4 rounded border-[#D1D5DB] text-[#398EB3] accent-[#398EB3] cursor-pointer"
				{...props}
			/>
			{label && (
				<span className="text-[13.5px] text-[#6B7280]">{label}</span>
			)}
		</label>
	);
}
