/** @format */

import { useState } from "react";
import { db } from "../../../database/db";

export default function TaskModal({ isOpen, onClose }) {
	const [title, setTitle] = useState("");
	const [dueDate, setDueDate] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!title.trim()) return;

		await db.tasks.add({
			label: title.trim(),
			dueDate: dueDate || null,
			status: "open",
			done: false,
			createdAt: new Date().toISOString(),
		});

		setTitle("");
		setDueDate("");
		onClose();
		window.dispatchEvent(new CustomEvent("tasks-updated"));
	};

	if (!isOpen) return null;

	return (
		<>
			<div
				onClick={onClose}
				className={`overlay fixed inset-0 bg-[#0F172A]/40 z-[80] transition-opacity ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
			/>
			<div
				className={`sheet-modal fixed inset-0 z-[90] grid place-items-center px-4 transition-opacity ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
				role="dialog"
				aria-modal="true"
				aria-labelledby="task-modal-title"
			>
				<div
					className={`w-full max-w-[440px] bg-white rounded-lg shadow-lift p-6 sm:p-7 transition-transform ${isOpen ? "scale-100" : "scale-95"}`}
				>
					<div className="flex items-center justify-between mb-5">
						<h3
							id="task-modal-title"
							className="font-display font-bold text-[#0F172A] text-[18px]"
						>
							Tugas Baru
						</h3>
						<button
							onClick={onClose}
							className="focus-ring p-1.5 rounded-lg hover:bg-[#F1F5F9] text-[#94A3B8]"
							aria-label="Tutup"
						>
							<svg
								width="18"
								height="18"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
							>
								<path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
							</svg>
						</button>
					</div>

					<form onSubmit={handleSubmit} className="space-y-4">
						<div>
							<label
								htmlFor="task-title"
								className="block text-[12.5px] font-semibold text-[#475569] mb-1.5"
							>
								Judul Tugas
							</label>
							<input
								id="task-title"
								type="text"
								required
								placeholder="cth. Tinjau laporan keuangan Q3"
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								className="focus-ring w-full px-3.5 py-2.5 rounded-lg border border-[#D8E4EA] text-[13.5px] focus:border-[#67B2D4] transition-colors"
							/>
						</div>
						<div>
							<label
								htmlFor="task-due"
								className="block text-[12.5px] font-semibold text-[#475569] mb-1.5"
							>
								Tenggat
							</label>
							<input
								id="task-due"
								type="date"
								value={dueDate}
								onChange={(e) => setDueDate(e.target.value)}
								className="focus-ring w-full px-3.5 py-2.5 rounded-lg border border-[#D8E4EA] text-[13.5px] focus:border-[#67B2D4] transition-colors"
							/>
						</div>
						<div className="flex gap-3 pt-2">
							<button
								type="button"
								onClick={onClose}
								className="focus-ring flex-1 py-2.5 rounded-lg border border-[#D8E4EA] font-semibold text-[13.5px] text-[#475569] hover:bg-[#F1F5F9] transition-colors"
							>
								Batal
							</button>
							<button
								type="submit"
								className="focus-ring flex-1 py-2.5 rounded-lg bg-[#398eb3] text-white font-semibold text-[13.5px] hover:bg-[#2F7698] transition-colors"
							>
								Simpan Tugas
							</button>
						</div>
					</form>
				</div>
			</div>
		</>
	);
}
