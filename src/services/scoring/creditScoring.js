/** @format */

import { db } from "../../database/db";

function clamp(value, min, max) {
	return Math.min(Math.max(value, min), max);
}

function getOutstanding(loan) {
	const paid = loan.paidAmount || loan.paid || 0;
	const remaining = loan.remainingAmount || 0;
	return Math.max(remaining, loan.principal - paid);
}

async function calculateCreditScore(memberId, requestedLoanAmount = null) {
	const member = await db.members.get(memberId);
	if (!member) {
		throw new Error("Member not found");
	}

	const loans = await db.loans.where("memberId").equals(memberId).toArray();
	const savings = await db.savings.where("memberId").equals(memberId).toArray();

	const today = new Date();

	const factors = [];

	// FAKTOR 1: Riwayat Bayar Pinjaman (bobot 35%)
	const completedLoans = loans.filter((l) => l.status === "completed");
	const nonPendingLoans = loans.filter((l) => l.status !== "pending");
	let faktor1;
	if (nonPendingLoans.length === 0) {
		faktor1 = {
			key: "paymentHistory",
			label: "Riwayat Pembayaran Pinjaman",
			weight: 0.35,
			score: 60,
			reason: "Belum memiliki riwayat pinjaman sebelumnya (skor netral).",
		};
	} else {
		const onTimeRatio = completedLoans.length / nonPendingLoans.length;
		const skorDasar = onTimeRatio * 100;

		const overdueLoans = loans.filter(
			(l) =>
				l.status === "active" &&
				l.dueDate &&
				new Date(l.dueDate) < today
		);
		const penalti = overdueLoans.length * 30;
		const skorFaktor = clamp(skorDasar - penalti, 0, 100);

		let reason = `Memiliki ${completedLoans.length} dari ${nonPendingLoans.length} pinjaman yang lunas tepat waktu.`;
		if (overdueLoans.length > 0) {
			reason += `, namun terdapat ${overdueLoans.length} pinjaman aktif yang telah melewati jatuh tempo.`;
		}

		faktor1 = {
			key: "paymentHistory",
			label: "Riwayat Pembayaran Pinjaman",
			weight: 0.35,
			score: Math.round(skorFaktor),
			reason,
		};
	}
	factors.push(faktor1);

	// FAKTOR 2: Rasio Simpanan vs Pinjaman (bobot 25%)
	const totalDeposit = savings
		.filter((s) => s.type === "deposit")
		.reduce((sum, s) => sum + (s.amount || 0), 0);
	const totalInterest = savings
		.filter((s) => s.type === "interest")
		.reduce((sum, s) => sum + (s.amount || 0), 0);
	const totalWithdrawal = savings
		.filter((s) => s.type === "withdrawal")
		.reduce((sum, s) => sum + (s.amount || 0), 0);
	const totalSaldoSimpanan = totalDeposit + totalInterest - totalWithdrawal;

	let faktor2;
	if (requestedLoanAmount === null || requestedLoanAmount <= 0) {
		const avgPrincipal =
			nonPendingLoans.length > 0
				? nonPendingLoans.reduce((sum, l) => sum + (l.principal || 0), 0) /
				  nonPendingLoans.length
				: 0;

		if (avgPrincipal <= 0) {
			faktor2 = {
				key: "savingsToLoanRatio",
				label: "Rasio Simpanan vs Pinjaman",
				weight: 0.25,
				score: 60,
				reason:
					"Belum ada pengajuan pinjaman untuk dibandingkan dengan saldo simpanan.",
			};
		} else {
			const rasio = totalSaldoSimpanan / avgPrincipal;
			let skorFaktor;
			if (rasio >= 0.5) skorFaktor = 100;
			else if (rasio >= 0.3) skorFaktor = 80;
			else if (rasio >= 0.15) skorFaktor = 60;
			else if (rasio >= 0.05) skorFaktor = 40;
			else skorFaktor = 20;

			faktor2 = {
				key: "savingsToLoanRatio",
				label: "Rasio Simpanan vs Pinjaman",
				weight: 0.25,
				score: skorFaktor,
				reason: `Saldo simpanan (Rp ${totalSaldoSimpanan.toLocaleString(
					"id-ID"
				)}) setara ${(rasio * 100).toFixed(1)}% dari rata-rata pinjaman sebelumnya (Rp ${Math.round(
					avgPrincipal
				).toLocaleString("id-ID")}).`,
			};
		}
	} else {
		const rasio = totalSaldoSimpanan / requestedLoanAmount;
		let skorFaktor;
		if (rasio >= 0.5) skorFaktor = 100;
		else if (rasio >= 0.3) skorFaktor = 80;
		else if (rasio >= 0.15) skorFaktor = 60;
		else if (rasio >= 0.05) skorFaktor = 40;
		else skorFaktor = 20;

		faktor2 = {
			key: "savingsToLoanRatio",
			label: "Rasio Simpanan vs Pinjaman",
			weight: 0.25,
			score: skorFaktor,
			reason: `Saldo simpanan (Rp ${totalSaldoSimpanan.toLocaleString(
				"id-ID"
			)}) setara ${(rasio * 100).toFixed(1)}% dari jumlah pinjaman yang diajukan (Rp ${requestedLoanAmount.toLocaleString(
				"id-ID"
			)}).`,
		};
	}
	factors.push(faktor2);

	// FAKTOR 3: Beban Utang Aktif (bobot 10%)
	const activeLoans = loans.filter((l) => l.status === "active");
	const totalOutstandingAktif = activeLoans.reduce(
		(sum, l) => sum + getOutstanding(l),
		0
	);

	let skorFaktor3;
	let reason3;
	if (totalSaldoSimpanan <= 0) {
		skorFaktor3 = totalOutstandingAktif > 0 ? 10 : 100;
		reason3 =
			totalOutstandingAktif > 0
				? `Total kewajiban pinjaman aktif (Rp ${totalOutstandingAktif.toLocaleString(
						"id-ID"
				  )}) namun saldo simpanan masih Rp 0.`
				: "Tidak memiliki kewajiban pinjaman aktif.";
	} else {
		const rasioBeban = totalOutstandingAktif / totalSaldoSimpanan;
		if (rasioBeban <= 0.2) skorFaktor3 = 100;
		else if (rasioBeban <= 0.5) skorFaktor3 = 70;
		else if (rasioBeban <= 1.0) skorFaktor3 = 40;
		else skorFaktor3 = 10;

		reason3 = `Total kewajiban pinjaman aktif (Rp ${totalOutstandingAktif.toLocaleString(
			"id-ID"
		)}) dibanding saldo simpanan (Rp ${totalSaldoSimpanan.toLocaleString(
			"id-ID"
		)}) berada pada rasio ${rasioBeban.toFixed(2)}.`;
	}

	const faktor3 = {
		key: "activeDebtBurden",
		label: "Beban Utang Aktif",
		weight: 0.1,
		score: skorFaktor3,
		reason: reason3,
	};
	factors.push(faktor3);

	// FAKTOR 4: Konsistensi Setoran Simpanan (bobot 15%)
	const sixMonthsAgo = new Date();
	sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

	const recentDeposits = savings.filter(
		(s) =>
			s.type === "deposit" &&
			s.createdAt &&
			new Date(s.createdAt) >= sixMonthsAgo
	);

	const monthGroups = {};
	recentDeposits.forEach((s) => {
		const date = new Date(s.createdAt);
		const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
			2,
			"0"
		)}`;
		monthGroups[key] = true;
	});

	const bulanAdaSetoran = Object.keys(monthGroups).length;
	const skorDasar4 = (bulanAdaSetoran / 6) * 100;

	let penalti4 = 0;
	const largeWithdrawal = savings.find(
		(s) =>
			s.type === "withdrawal" && s.amount > totalSaldoSimpanan * 0.5
	);
	if (largeWithdrawal) {
		penalti4 = 20;
	}

	const skorFaktor4 = clamp(skorDasar4 - penalti4, 0, 100);

	const faktor4 = {
		key: "savingsConsistency",
		label: "Konsistensi Setoran",
		weight: 0.15,
		score: Math.round(skorFaktor4),
		reason: `Melakukan setoran rutin pada ${bulanAdaSetoran} dari 6 bulan terakhir.${
			largeWithdrawal ? " Ditemukan penarikan besar yang memengaruhi skor." : ""
		}`,
	};
	factors.push(faktor4);

	// FAKTOR 5: Lama Keanggotaan (bobot 15%)
	const joinDate = member.joinDate ? new Date(member.joinDate) : new Date();
	const bulanKeanggotaan = Math.max(
		0,
		(today.getFullYear() - joinDate.getFullYear()) * 12 +
			(today.getMonth() - joinDate.getMonth())
	);

	let skorFaktor5;
	if (bulanKeanggotaan < 3) skorFaktor5 = 20;
	else if (bulanKeanggotaan < 6) skorFaktor5 = 40;
	else if (bulanKeanggotaan < 12) skorFaktor5 = 60;
	else if (bulanKeanggotaan < 24) skorFaktor5 = 80;
	else skorFaktor5 = 100;

	if (member.status === "active") {
		skorFaktor5 = Math.min(100, skorFaktor5 + 10);
	}

	const faktor5 = {
		key: "membershipTenure",
		label: "Lama Keanggotaan",
		weight: 0.15,
		score: skorFaktor5,
		reason: `Telah menjadi anggota cooperativa selama ${bulanKeanggotaan} bulan.${
			member.status === "active"
				? " Status keanggotaan aktif."
				: ""
		}`,
	};
	factors.push(faktor5);

	// SKOR AKHIR
	const skorAkhir = Math.round(
		faktor1.score * 0.35 +
			faktor2.score * 0.25 +
			faktor3.score * 0.1 +
			faktor4.score * 0.15 +
			faktor5.score * 0.15
	);

	// KATEGORI RISIKO
	let riskLevel;
	let riskLabel;
	let recommendation;

	if (skorAkhir >= 80) {
		riskLevel = "LOW_RISK";
		riskLabel = "Risiko Rendah";
		recommendation = "Direkomendasikan untuk disetujui.";
	} else if (skorAkhir >= 60) {
		riskLevel = "MEDIUM_RISK";
		riskLabel = "Risiko Sedang";
		recommendation =
			"Perlu review manual oleh pengurus sebelum disetujui.";
	} else if (skorAkhir >= 40) {
		riskLevel = "MEDIUM_HIGH_RISK";
		riskLabel = "Risiko Sedang-Tinggi";
		recommendation =
			"Pertimbangkan jaminan tambahan atau pengurangan plafon.";
	} else {
		riskLevel = "HIGH_RISK";
		riskLabel = "Risiko Tinggi";
		recommendation =
			"Direkomendasikan untuk ditinjau ulang atau ditolak sementara.";
	}

	return {
		memberId,
		memberName: member.name,
		score: skorAkhir,
		riskLevel,
		riskLabel,
		recommendation,
		factors,
		calculatedAt: new Date(),
	};
}

export { calculateCreditScore };
