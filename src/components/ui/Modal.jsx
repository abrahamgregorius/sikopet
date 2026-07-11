/** @format */

import { useEffect } from "react";

export default function Modal({
	open,
	onClose,
	title,
	children,
	className = "",
}) {
	useEffect(() => {
		if (open) {
			document.body.style.overflow = "hidden";
			return () => {
				document.body.style.overflow = "";
			};
		}
	}, [open]);

	useEffect(() => {
		function handleKey(e) {
			if (e.key === "Escape" && open) onClose?.();
		}
		document.addEventListener("keydown", handleKey);
		return () => document.removeEventListener("keydown", handleKey);
	}, [open, onClose]);

	if (!open) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-10">
			<div
				className="absolute inset-0 bg-[#0F172A]/40 backdrop-blur-sm"
				onClick={onClose}
			/>
			<div
				role="dialog"
				aria-modal="true"
				aria-label={title}
				className={`relative w-full max-w-lg rounded-[24px] bg-white border-[#E5E7EB] border p-8 ${className}`}
			>
				<div className="flex items-center justify-between mb-6">
					{title && (
						<h2 className="font-display font-bold text-[20px] text-[#0F172A]">
							{title}
						</h2>
					)}
					<button
						type="button"
						onClick={onClose}
						className="focus-ring ml-auto p-2 rounded-lg text-[#94A3B8] hover:text-[#475569] hover:bg-[#F1F5F9] transition-colors"
						aria-label="Tutup"
					>
						<svg
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
						>
							<path d="M18 6L6 18M6 6l12 12" />
						</svg>
					</button>
				</div>
				{children}
			</div>
		</div>
	);
}
