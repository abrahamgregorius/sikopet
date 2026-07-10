/** @format */

import { useState } from "react";

export default function Input({
	label,
	id,
	type = "text",
	placeholder,
	value,
	onChange,
	error,
	required,
	autoComplete,
	className = "",
	...props
}) {
	const [showPassword, setShowPassword] = useState(false);
	const isPassword = type === "password";
	const inputType = isPassword && showPassword ? "text" : type;

	return (
		<div className={className}>
			{label && (
				<label
					htmlFor={id}
					className="block text-[13.5px] font-medium text-[#374151] mb-1.5"
				>
					{label}
					{required && <span className="text-[#EF4444] ml-0.5">*</span>}
				</label>
			)}
			<div className="relative">
				<input
					id={id}
					type={inputType}
					placeholder={placeholder}
					value={value}
					onChange={onChange}
					required={required}
					autoComplete={autoComplete}
					className={`focus-ring w-full h-[48px] px-4${isPassword ? " pr-12" : ""} rounded-[12px] border ${
						error ? "border-[#EF4444]" : "border-[#E5E7EB]"
					} bg-white text-[15px] text-[#0F172A] placeholder-[#9CA3AF] transition-colors duration-200 hover:border-[#D1D5DB] focus:border-[#398EB3] focus:outline-none`}
					{...props}
				/>
				{isPassword && (
					<button
						type="button"
						onClick={() => setShowPassword(!showPassword)}
						className="focus-ring absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-[#9CA3AF] hover:text-[#6B7280] transition-colors"
						aria-label={
							showPassword
								? "Sembunyikan kata sandi"
								: "Tampilkan kata sandi"
						}
					>
						{showPassword ? (
							<svg
								width="18"
								height="18"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="1.8"
							>
								<path
									d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
								<line
									x1="1"
									y1="1"
									x2="23"
									y2="23"
									stroke="currentColor"
									strokeWidth="1.8"
									strokeLinecap="round"
								/>
							</svg>
						) : (
							<svg
								width="18"
								height="18"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="1.8"
							>
								<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
								<circle cx="12" cy="12" r="3" />
							</svg>
						)}
					</button>
				)}
			</div>
			{error && (
				<p className="text-[12px] text-[#EF4444] mt-1">{error}</p>
			)}
		</div>
	);
}
