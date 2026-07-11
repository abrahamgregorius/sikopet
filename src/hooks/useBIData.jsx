/** @format */
/**
 * useBIData — hook for Business Intelligence metrics from Dexie.
 */

import { useState, useEffect, useCallback } from "react";
import { db } from "../database/index.js";
import { getDateRange, filterByDateRange } from "../utils/formatCurrency.js";
import { LoanStatus, SavingType } from "../database/schema.js";

export function useBIData(dateRange = "30d") {
	const [data, setData] = useState({
		loading: true,
		members: [],
		loans: [],
		savings: [],
		inventory: [],
		products: [],
		transactions: [],
		customers: [],
		suppliers: [],
		procurements: [],
	});

	const load = useCallback(async () => {
		try {
			const [members, loans, savings, inventory, products, transactions, customers, suppliers, procurements] =
				await Promise.allSettled([
					db.members.toArray(),
					db.loans.toArray(),
					db.savings.toArray(),
					db.inventory.toArray(),
					db.products.toArray(),
					db.transactions.toArray(),
					db.customers.toArray(),
					db.suppliers.toArray(),
					db.procurements.toArray(),
				]);

			setData({
				loading: false,
				members: members.status === "fulfilled" ? members.value : [],
				loans: loans.status === "fulfilled" ? loans.value : [],
				savings: savings.status === "fulfilled" ? savings.value : [],
				inventory: inventory.status === "fulfilled" ? inventory.value : [],
				products: products.status === "fulfilled" ? products.value : [],
				transactions: transactions.status === "fulfilled" ? transactions.value : [],
				customers: customers.status === "fulfilled" ? customers.value : [],
				suppliers: suppliers.status === "fulfilled" ? suppliers.value : [],
				procurements: procurements.status === "fulfilled" ? procurements.value : [],
			});
		} catch (err) {
			console.warn("[useBIData] Failed to load:", err);
			setData((prev) => ({ ...prev, loading: false }));
		}
	}, []);

	useEffect(() => {
		load();
		const interval = setInterval(load, 30000);
		return () => clearInterval(interval);
	}, [load]);

	const { start, end } = getDateRange(dateRange);

	return {
		...data,
		dateRange,
		dateRangeStart: start,
		dateRangeEnd: end,
		refresh: load,
	};
}

export function useBIExecutiveSummary(biData) {
	const { members, loans, savings, transactions, loading, dateRangeStart, dateRangeEnd } = biData;

	const activeMembers = members.filter((m) => m.status === "active" || m.status === "ACTIVE" || m.status === "Active");

	const savingsBalance = savings.reduce((sum, s) => {
		if (s.type === "deposit" || s.type === "DEPOSIT" || s.type === SavingType?.DEPOSIT) {
			return sum + (s.amount || 0);
		}
		if (s.type === "withdrawal" || s.type === "WITHDRAWAL" || s.type === SavingType?.WITHDRAWAL) {
			return sum - (s.amount || 0);
		}
		return sum;
	}, 0);

	const activeLoans = loans.filter((l) => l.status === "active" || l.status === "ACTIVE" || l.status === LoanStatus?.ACTIVE);
	const outstandingLoans = activeLoans.reduce((sum, l) => sum + (l.principal || 0), 0);

	const filteredTx = filterByDateRange(transactions, "date", dateRangeStart, dateRangeEnd);
	const monthIncome = filteredTx
		.filter((t) => t.type === "income" || t.type === "INCOME")
		.reduce((sum, t) => sum + (t.totalAmount || t.amount || 0), 0);
	const monthExpense = filteredTx
		.filter((t) => t.type === "expense" || t.type === "EXPENSE")
		.reduce((sum, t) => sum + (t.totalAmount || t.amount || 0), 0);
	const cashFlow = monthIncome - monthExpense;

	const todaySales = transactions
		.filter((t) => {
			const d = new Date(t.date || t.createdAt);
			const today = new Date();
			return d.toDateString() === today.toDateString() && (t.type === "sale" || t.type === "SALE");
		})
		.reduce((sum, t) => sum + (t.totalAmount || t.amount || 0), 0);

	const memberStatusCounts = {
		active: members.filter((m) => m.status === "active" || m.status === "ACTIVE").length,
		inactive: members.filter((m) => m.status === "inactive" || m.status === "INACTIVE").length,
		pending: members.filter((m) => m.status === "pending" || m.status === "PENDING").length,
	};

	const cashFlowData = buildCashFlowTrend(transactions, dateRangeStart, dateRangeEnd);

	const criticalAlerts = buildCriticalAlerts(loans, biData.inventory, biData.procurements);

	return {
		loading,
		kpis: {
			activeMembers: activeMembers.length,
			savingsBalance,
			outstandingLoans,
			cashFlow,
			todaySales,
		},
		memberStatusCounts,
		cashFlowData,
		criticalAlerts,
	};
}

function buildCashFlowTrend(transactions, start, end) {
	const days = [];
	const current = new Date(start);
	const endDate = new Date(end);

	while (current <= endDate) {
		const dayKey = current.toISOString().split("T")[0];
		const dayTx = transactions.filter((t) => {
			const d = new Date(t.date || t.createdAt).toISOString().split("T")[0];
			return d === dayKey;
		});

		const income = dayTx
			.filter((t) => t.type === "income" || t.type === "INCOME")
			.reduce((s, t) => s + (t.totalAmount || t.amount || 0), 0);
		const expense = dayTx
			.filter((t) => t.type === "expense" || t.type === "EXPENSE")
			.reduce((s, t) => s + (t.totalAmount || t.amount || 0), 0);

		days.push({
			date: dayKey,
			label: new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short" }).format(current),
			income,
			expense,
		});

		current.setDate(current.getDate() + 1);
	}

	return days;
}

function buildCriticalAlerts(loans, inventory, procurements) {
	const alerts = [];
	const today = new Date();
	today.setHours(0, 0, 0, 0);

	const overdueLoans = loans.filter((l) => {
		const status = (l.status || "").toLowerCase();
		if (status !== "active" && status !== "overdue") return false;
		const due = new Date(l.dueDate || l.disbursementDate || 0);
		return due < today;
	});
	if (overdueLoans.length > 0) {
		alerts.push({
			type: "danger",
			title: "Pinjaman Jatuh Tempo",
			message: `${overdueLoans.length} pinjaman sudah melewati jatuh tempo`,
		});
	}

	const pendingProcurements = procurements.filter((p) => {
		const s = (p.status || "").toLowerCase();
		return s === "pending" || s === "approved";
	});
	if (pendingProcurements.length > 0) {
		alerts.push({
			type: "warning",
			title: "Approval Pengadaan",
			message: `${pendingProcurements.length} pengadaan menunggu persetujuan`,
		});
	}

	const lowStock = inventory.filter((inv) => {
		const min = inv.minimumStock || 0;
		return inv.stock <= min && inv.stock > 0;
	});
	if (lowStock.length > 0) {
		alerts.push({
			type: "warning",
			title: "Stok Menipis",
			message: `${lowStock.length} item stok hampir habis`,
		});
	}

	const outOfStock = inventory.filter((inv) => inv.stock === 0);
	if (outOfStock.length > 0) {
		alerts.push({
			type: "danger",
			title: "Stok Habis",
			message: `${outOfStock.length} item stok habis`,
		});
	}

	return alerts;
}

export function useBISimpanPinjam(biData) {
	const { savings, loans, members, loading, dateRangeStart, dateRangeEnd } = biData;

	const savingsByMonth = buildSavingsByMonth(savings, dateRangeStart, dateRangeEnd);

	const memberBalances = buildMemberBalances(savings, members);

	const loanPortfolio = buildLoanPortfolio(loans);

	const dueSoonLoans = buildDueSoonLoans(loans, members);

	const nplRatio = buildNLPRatio(loans);

	return {
		loading,
		savingsByMonth,
		topSavingsMembers: memberBalances.slice(0, 5),
		loanPortfolio,
		dueSoonLoans,
		nplRatio,
	};
}

function buildSavingsByMonth(savings, start, end) {
	const months = {};
	const current = new Date(start);
	const endDate = new Date(end);

	while (current <= endDate) {
		const key = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, "0")}`;
		if (!months[key]) {
			months[key] = {
				month: key,
				label: new Intl.DateTimeFormat("id-ID", { month: "short", year: "numeric" }).format(current),
				deposit: 0,
				withdrawal: 0,
			};
		}
		current.setMonth(current.getMonth() + 1);
	}

	savings.forEach((s) => {
		const d = new Date(s.createdAt || s.date);
		if (d < start || d > end) return;
		const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
		if (!months[key]) return;
		const amt = s.amount || 0;
		if ((s.type === "deposit" || s.type === "DEPOSIT") && !s.description?.toLowerCase().includes("bunga")) {
			months[key].deposit += amt;
		} else if (s.type === "withdrawal" || s.type === "WITHDRAWAL") {
			months[key].withdrawal += amt;
		} else if (s.description?.toLowerCase().includes("bunga")) {
			months[key].deposit += amt;
		}
	});

	return Object.values(months).sort((a, b) => a.month.localeCompare(b.month));
}

function buildMemberBalances(savings, members) {
	const balances = {};
	savings.forEach((s) => {
		if (!balances[s.memberId]) balances[s.memberId] = 0;
		const amt = s.amount || 0;
		if (s.type === "deposit" || s.type === "DEPOSIT") {
			balances[s.memberId] += amt;
		} else {
			balances[s.memberId] -= amt;
		}
	});

	return members
		.map((m) => ({
			...m,
			balance: balances[m.id] || 0,
		}))
		.filter((m) => m.balance > 0)
		.sort((a, b) => b.balance - a.balance);
}

function buildLoanPortfolio(loans) {
	const active = loans.filter((l) => l.status === "active" || l.status === "ACTIVE" || l.status === LoanStatus?.ACTIVE);
	const pending = loans.filter((l) => l.status === "pending" || l.status === "PENDING" || l.status === LoanStatus?.PENDING);
	const completed = loans.filter((l) => l.status === "completed" || l.status === "COMPLETED" || l.status === LoanStatus?.COMPLETED);
	const overdue = loans.filter((l) => l.status === "overdue" || l.status === "OVERDUE" || l.status === LoanStatus?.OVERDUE);

	const totalPrincipal = loans.reduce((s, l) => s + (l.principal || 0), 0);
	const totalPaid = loans.reduce((s, l) => s + (l.paidAmount || l.paid || 0), 0);
	const totalOutstanding = totalPrincipal - totalPaid;

	return {
		totalPrincipal,
		totalPaid,
		totalOutstanding,
		byStatus: [
			{ status: "Aktif", count: active.length, principal: active.reduce((s, l) => s + (l.principal || 0), 0) },
			{ status: "Pending", count: pending.length, principal: pending.reduce((s, l) => s + (l.principal || 0), 0) },
			{ status: "Lunas", count: completed.length, principal: completed.reduce((s, l) => s + (l.principal || 0), 0) },
			{ status: "Overdue", count: overdue.length, principal: overdue.reduce((s, l) => s + (l.principal || 0), 0) },
		],
	};
}

function buildDueSoonLoans(loans, members) {
	const today = new Date();
	today.setHours(0, 0, 0, 0);
	const weekFromNow = new Date(today);
	weekFromNow.setDate(weekFromNow.getDate() + 7);

	return loans
		.filter((l) => {
			const status = (l.status || "").toLowerCase();
			if (status !== "active" && status !== "overdue") return false;
			const due = new Date(l.dueDate || l.disbursementDate || 0);
			return due <= weekFromNow;
		})
		.map((l) => {
			const member = members.find((m) => m.id === l.memberId);
			const due = new Date(l.dueDate || l.disbursementDate || 0);
			const isOverdue = due < today;
			return {
				...l,
				memberName: member?.name || l.memberName || l.memberId,
				dueDate: due,
				isOverdue,
			};
		})
		.sort((a, b) => a.dueDate - b.dueDate);
}

function buildNLPRatio(loans) {
	const activeLoans = loans.filter((l) => l.status === "active" || l.status === "ACTIVE" || l.status === LoanStatus?.ACTIVE);
	const overdueLoans = loans.filter((l) => {
		const today = new Date();
		const due = new Date(l.dueDate || l.disbursementDate || 0);
		return due < today && (l.status === "active" || l.status === "ACTIVE");
	});

	const totalActive = activeLoans.reduce((s, l) => s + (l.principal || 0), 0);
	const totalOverdue = overdueLoans.reduce((s, l) => s + (l.principal || 0), 0);

	return {
		overdueCount: overdueLoans.length,
		activeCount: activeLoans.length,
		ratio: totalActive > 0 ? (totalOverdue / totalActive) * 100 : 0,
		totalOverdue,
		totalActive,
	};
}

export function useBIInventori(biData) {
	const { inventory, products, loading } = biData;

	const enrichedInventory = inventory.map((inv) => {
		const product = products.find((p) => p.id === inv.productId) || {};
		return {
			...inv,
			productName: product.name || "-",
			category: product.category || "-",
			price: product.salePrice || product.price || 0,
			minimumStock: inv.minimumStock || product.minimumStock || 0,
		};
	});

	const lowStockItems = enrichedInventory.filter((inv) => {
		if (inv.stock === 0) return true;
		return inv.stock <= inv.minimumStock;
	});

	const outOfStockItems = enrichedInventory.filter((inv) => inv.stock === 0);
	const warningItems = enrichedInventory.filter((inv) => inv.stock > 0 && inv.stock <= inv.minimumStock);

	const inventoryByCategory = {};
	enrichedInventory.forEach((inv) => {
		const cat = inv.category || "Lainnya";
		if (!inventoryByCategory[cat]) inventoryByCategory[cat] = 0;
		inventoryByCategory[cat] += (inv.stock || 0) * (inv.price || 0);
	});

	const categoryData = Object.entries(inventoryByCategory).map(([category, value]) => ({
		category,
		value,
	}));

	const notRestocked = [...enrichedInventory]
		.filter((inv) => inv.lastRestock || inv.updatedAt)
		.sort((a, b) => {
			const da = new Date(a.lastRestock || a.updatedAt || 0);
			const db2 = new Date(b.lastRestock || b.updatedAt || 0);
			return da - db2;
		})
		.slice(0, 5)
		.map((inv) => ({
			...inv,
			lastRestockDate: new Date(inv.lastRestock || inv.updatedAt || 0),
		}));

	return {
		loading,
		inventory: enrichedInventory,
		lowStockItems,
		outOfStockItems,
		warningItems,
		categoryData,
		notRestocked,
	};
}

export function useBIPenjualan(biData) {
	const { transactions, customers, dateRangeStart, dateRangeEnd } = biData;

	const sales = transactions.filter((t) => t.type === "sale" || t.type === "SALE" || t.type === "income");

	const filteredSales = filterByDateRange(sales, "date", dateRangeStart, dateRangeEnd);

	const dailyRevenue = buildDailyRevenue(filteredSales, dateRangeStart, dateRangeEnd);

	const paymentMethods = {};
	filteredSales.forEach((s) => {
		const method = s.paymentMethod || "cash";
		paymentMethods[method] = (paymentMethods[method] || 0) + (s.totalAmount || s.amount || 0);
	});

	const paymentData = Object.entries(paymentMethods).map(([method, amount]) => ({
		method: method.charAt(0).toUpperCase() + method.slice(1),
		amount,
	}));

	const topCustomers = [...customers]
		.filter((c) => c.totalTransaction > 0 || c.visitCount > 0)
		.sort((a, b) => (b.totalTransaction || 0) - (a.totalTransaction || 0))
		.slice(0, 5);

	const inactiveCustomers = [...customers]
		.filter((c) => {
			if (!c.lastVisit) return true;
			const d = new Date(c.lastVisit);
			const sixMonthsAgo = new Date();
			sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
			return d < sixMonthsAgo;
		})
		.sort((a, b) => {
			const da = new Date(a.lastVisit || 0);
			const db2 = new Date(b.lastVisit || 0);
			return da - db2;
		})
		.slice(0, 5);

	return {
		loading: biData.loading,
		dailyRevenue,
		paymentData,
		topCustomers,
		inactiveCustomers,
	};
}

function buildDailyRevenue(sales, start, end) {
	const days = [];
	const current = new Date(start);
	const endDate = new Date(end);

	while (current <= endDate) {
		const dayKey = current.toISOString().split("T")[0];
		const daySales = sales.filter((s) => {
			const d = new Date(s.date || s.createdAt).toISOString().split("T")[0];
			return d === dayKey;
		});

		days.push({
			date: dayKey,
			label: new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short" }).format(current),
			revenue: daySales.reduce((s, t) => s + (t.totalAmount || t.amount || 0), 0),
		});

		current.setDate(current.getDate() + 1);
	}

	return days;
}

export function useBIPengadaan(biData) {
	const { procurements, suppliers, loading } = biData;

	const byStatus = [
		{
			status: "Pending",
			count: procurements.filter((p) => p.status === "pending" || p.status === "PENDING").length,
		},
		{
			status: "Approved",
			count: procurements.filter((p) => p.status === "approved" || p.status === "APPROVED").length,
		},
		{
			status: "Received",
			count: procurements.filter((p) => p.status === "received" || p.status === "RECEIVED").length,
		},
		{
			status: "Rejected",
			count: procurements.filter((p) => p.status === "rejected" || p.status === "REJECTED").length,
		},
	];

	const bySupplier = {};
	procurements.forEach((p) => {
		const sid = p.supplierId;
		if (!bySupplier[sid]) bySupplier[sid] = 0;
		bySupplier[sid] += p.total || 0;
	});

	const supplierPurchaseData = Object.entries(bySupplier)
		.map(([sid, total]) => {
			const supplier = suppliers.find((s) => s.id === Number(sid));
			return {
				supplierId: sid,
				supplierName: supplier?.name || `Supplier #${sid}`,
				total,
			};
		})
		.sort((a, b) => b.total - a.total)
		.slice(0, 8);

	const supplierEvalData = suppliers
		.filter((s) => s.rating != null)
		.map((s) => ({
			name: s.name,
			rating: s.rating,
			totalTransaction: s.totalTransaction || 0,
		}));

	return {
		loading,
		procurementByStatus: byStatus,
		supplierPurchaseData,
		supplierEvalData,
	};
}

export function useBIKeuangan(biData) {
	const { transactions, dateRangeStart, dateRangeEnd } = biData;

	const filteredTx = filterByDateRange(transactions, "date", dateRangeStart, dateRangeEnd);

	const incomeVsExpense = buildIncomeVsExpense(filteredTx, dateRangeStart, dateRangeEnd);

	const totalIncome = filteredTx
		.filter((t) => t.type === "income" || t.type === "INCOME")
		.reduce((s, t) => s + (t.totalAmount || t.amount || 0), 0);
	const totalExpense = filteredTx
		.filter((t) => t.type === "expense" || t.type === "EXPENSE")
		.reduce((s, t) => s + (t.totalAmount || t.amount || 0), 0);

	const incomeByCategory = {};
	const expenseByCategory = {};

	filteredTx.forEach((t) => {
		const amt = t.totalAmount || t.amount || 0;
		const cat = t.category || "Lainnya";
		if (t.type === "income" || t.type === "INCOME") {
			incomeByCategory[cat] = (incomeByCategory[cat] || 0) + amt;
		} else {
			expenseByCategory[cat] = (expenseByCategory[cat] || 0) + amt;
		}
	});

	return {
		loading: biData.loading,
		incomeVsExpense,
		netIncome: totalIncome - totalExpense,
		totalIncome,
		totalExpense,
		incomeByCategory: Object.entries(incomeByCategory).map(([cat, val]) => ({ category: cat, value: val })),
		expenseByCategory: Object.entries(expenseByCategory).map(([cat, val]) => ({ category: cat, value: val })),
	};
}

function buildIncomeVsExpense(transactions, start, end) {
	const months = {};
	const current = new Date(start);
	const endDate = new Date(end);

	while (current <= endDate) {
		const key = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, "0")}`;
		if (!months[key]) {
			months[key] = {
				month: key,
				label: new Intl.DateTimeFormat("id-ID", { month: "short", year: "numeric" }).format(current),
				income: 0,
				expense: 0,
			};
		}
		current.setMonth(current.getMonth() + 1);
	}

	transactions.forEach((t) => {
		const d = new Date(t.date || t.createdAt);
		if (d < start || d > end) return;
		const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
		if (!months[key]) return;
		const amt = t.totalAmount || t.amount || 0;
		if (t.type === "income" || t.type === "INCOME") {
			months[key].income += amt;
		} else if (t.type === "expense" || t.type === "EXPENSE") {
			months[key].expense += amt;
		}
	});

	return Object.values(months).sort((a, b) => a.month.localeCompare(b.month));
}
