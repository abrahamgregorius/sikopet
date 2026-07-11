/** @format */

import { useState, useEffect } from "react";
import { calculateCreditScore } from "../../../services/scoring/creditScoring";

const RISK_CONFIG = {
	LOW_RISK: {
		label: "Risiko Rendah",
		color: "text-[#22C55E] bg-[#22C55E]/10",
		dotColor: "bg-[#22C55E]",
		scoreColor: "text-[#22C55E]",
		progressBg: "bg-[#22C55E]",
	},
	MEDIUM_RISK: {
		label: "Risiko Sedang",
		color: "text-[#F59E0B] bg-[#F59E0B]/10",
		dotColor: "bg-[#F59E0B]",
		scoreColor: "text-[#F59E0B]",
		progressBg: "bg-[#F59E0B]",
	},
	MEDIUM_HIGH_RISK: {
		label: "Risiko Sedang-Tinggi",
		color: "text-[#F97316] bg-[#F97316]/10",
		dotColor: "bg-[#F97316]",
		scoreColor: "text-[#F97316]",
		progressBg: "bg-[#F97316]",
	},
	HIGH_RISK: {
		label: "Risiko Tinggi",
		color: "text-[#EF4444] bg-[#EF4444]/10",
		dotColor: "bg-[#EF4444]",
		scoreColor: "text-[#EF4444]",
		progressBg: "bg-[#EF4444]",
	},
};

function FactorItem({ factor }) {
	const config =
		factor.score >= 60
			? RISK_CONFIG.LOW_RISK
			: factor.score >= 40
			? RISK_CONFIG.MEDIUM_RISK
			: factor.score >= 20
			? RISK_CONFIG.MEDIUM_HIGH_RISK
			: RISK_CONFIG.HIGH_RISK;

	return (
		<div className="space-y-2">
			<div className="flex items-center justify-between">
				<span className="text-[13px] font-medium text-[#374151]">
					{factor.label}
				</span>
				<span className={`text-[13px] font-bold ${config.scoreColor}`}>
					{factor.score}
				</span>
			</div>
			<div className="w-full h-2 rounded-lg bg-[#F1F5F9] overflow-hidden">
				<div
					className={`h-full rounded-lg ${config.progressBg} transition-all duration-500`}
					style={{ width: `${factor.score}%` }}
				/>
			</div>
			<p className="text-[12px] text-[#6B7280] leading-relaxed">
				{factor.reason}
			</p>
		</div>
	);
}

export default function CreditScoreCard({
	memberId,
	requestedLoanAmount = null,
	compact = false,
}) {
	const [result, setResult] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		if (!memberId) {
			setLoading(false);
			return;
		}

		let isMounted = true;
		setLoading(true);
		setError(null);

		calculateCreditScore(memberId, requestedLoanAmount)
			.then((scoreResult) => {
				if (isMounted) {
					setResult(scoreResult);
					setLoading(false);
				}
			})
			.catch((err) => {
				if (isMounted) {
					setError(err.message || "Gagal menghitung skor");
					setLoading(false);
				}
			});

		return () => {
			isMounted = false;
		};
	}, [memberId, requestedLoanAmount]);

	if (!memberId) {
		return null;
	}

	if (loading) {
		return (
			<div className="rounded-lg bg-white border border-[#E5E7EB] p-5">
				<div className="animate-pulse space-y-4">
					<div className="h-4 bg-[#F1F5F9] rounded w-1/2" />
					<div className="h-8 bg-[#F1F5F9] rounded w-3/4" />
					<div className="h-2 bg-[#F1F5F9] rounded" />
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="rounded-lg bg-white border border-[#E5E7EB] p-5">
				<p className="text-[13px] text-[#EF4444]">{error}</p>
			</div>
		);
	}

	if (!result) {
		return null;
	}

	const config = RISK_CONFIG[result.riskLevel];

	if (compact) {
		return (
			<div className="rounded-lg bg-white border border-[#E5E7EB] p-4">
				<div className="flex items-center gap-4">
					<div className="flex-1">
						<p className="text-[11px] text-[#94A3B8] font-medium mb-1">
							Skor Kredit
						</p>
						<p
							className={`font-display font-extrabold text-[28px] ${config.scoreColor}`}
						>
							{result.score}
						</p>
					</div>
					<div className="text-right">
						<span
							className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-lg ${config.color}`}
						>
							<span
								className={`w-1.5 h-1.5 rounded-lg ${config.dotColor}`}
							></span>
							{config.label}
						</span>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="rounded-lg bg-white border border-[#E5E7EB] overflow-hidden">
			<div className="p-5 border-b border-[#E8EEF2]">
				<div className="flex items-start justify-between gap-4">
					<div>
						<p className="text-[11px] text-[#94A3B8] font-semibold uppercase tracking-wider mb-1">
							Skor Kredit
						</p>
						<p className="font-display font-extrabold text-[36px] text-[#0F172A] tracking-tight">
							{result.score}
							<span className="text-[18px] text-[#94A3B8] font-medium">/100</span>
						</p>
						<p className="text-[13px] text-[#6B7280] mt-1">
							{result.memberName}
						</p>
					</div>
					<div className="text-right">
						<span
							className={`inline-flex items-center gap-1.5 text-[12px] font-semibold px-3 py-1.5 rounded-lg ${config.color}`}
						>
							<span className={`w-2 h-2 rounded-lg ${config.dotColor}`}></span>
							{config.label}
						</span>
					</div>
				</div>
			</div>

			<div className="p-5 space-y-4">
				<div
					className={`rounded-lg p-4 text-[13px] font-medium ${
						result.riskLevel === "LOW_RISK"
							? "bg-[#DCFCE7] text-[#22C55E]"
							: result.riskLevel === "MEDIUM_RISK"
							? "bg-[#FEF3C7] text-[#F59E0B]"
							: result.riskLevel === "MEDIUM_HIGH_RISK"
							? "bg-[#FFF7ED] text-[#F97316]"
							: "bg-[#FEE2E2] text-[#EF4444]"
					}`}
				>
					{result.recommendation}
				</div>

				<div className="space-y-4">
					<h4 className="text-[12px] font-bold text-[#94A3B8] uppercase tracking-wider">
						Breakdown Faktor
					</h4>
					{result.factors.map((factor, idx) => (
						<div key={factor.key}>
							<FactorItem factor={factor} />
							{idx < result.factors.length - 1 && (
								<div className="border-t border-[#E8EEF2] mt-4" />
							)}
						</div>
					))}
				</div>
			</div>

			<div className="px-5 py-3 bg-[#F7FAFC] border-t border-[#E8EEF2]">
				<p className="text-[11px] text-[#9CA3AF]">
					Dihitung pada{" "}
					{new Date(result.calculatedAt).toLocaleString("id-ID", {
						day: "numeric",
						month: "short",
						year: "numeric",
						hour: "2-digit",
						minute: "2-digit",
					})}
				</p>
			</div>
		</div>
	);
}
