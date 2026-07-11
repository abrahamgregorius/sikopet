/** @format */

import * as XLSX from "xlsx";

function escapeCSVValue(value) {
	if (value === null || value === undefined) return "";
	const str = String(value);
	if (str.includes(",") || str.includes('"') || str.includes("\n")) {
		return `"${str.replace(/"/g, '""')}"`;
	}
	return str;
}

function arrayToCSV(data, headers) {
	const headerRow = headers.map((h) => escapeCSVValue(h.label)).join(",");
	const rows = data.map((item) =>
		headers.map((h) => escapeCSVValue(h.getValue ? h.getValue(item) : item[h.key])).join(",")
	);
	return [headerRow, ...rows].join("\n");
}

function downloadBlob(content, filename, mimeType) {
	const blob = new Blob([content], { type: mimeType });
	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.href = url;
	link.download = filename;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	URL.revokeObjectURL(url);
}

const MEMBER_HEADERS = [
	{ key: "memberNumber", label: "No. Anggota" },
	{ key: "name", label: "Nama" },
	{ key: "nik", label: "NIK" },
	{ key: "phone", label: "Telepon" },
	{ key: "address", label: "Alamat" },
	{ key: "joinDate", label: "Tanggal Gabung" },
	{
		key: "status",
		label: "Status",
		getValue: (item) => {
			const statusMap = {
				active: "Aktif",
				pending: "Menunggu",
				inactive: "Tidak Aktif",
			};
			return statusMap[item.status] || item.status;
		},
	},
];

function prepareData(data, headers) {
	return data.map((item) => {
		const row = {};
		headers.forEach((h) => {
			row[h.label] = h.getValue ? h.getValue(item) : item[h.key];
		});
		return row;
	});
}

export function exportMembersToCSV(members) {
	const csv = arrayToCSV(members, MEMBER_HEADERS);
	const filename = `anggota_${new Date().toISOString().split("T")[0]}.csv`;
	downloadBlob("\uFEFF" + csv, filename, "text/csv;charset=utf-8");
}

export function exportMembersToExcel(members) {
	const ws = XLSX.utils.json_to_sheet(prepareData(members, MEMBER_HEADERS));
	const wb = XLSX.utils.book_new();
	XLSX.utils.book_append_sheet(wb, ws, "Anggota");
	XLSX.writeFile(wb, `anggota_${new Date().toISOString().split("T")[0]}.xlsx`);
}

const LOAN_HEADERS = [
	{ key: "member", label: "Anggota" },
	{ key: "principal", label: "Jumlah Pinjaman", getValue: (item) => item.principal?.toLocaleString("id-ID") },
	{ key: "rate", label: "Bunga (%)" },
	{ key: "tenor", label: "Tenor (bulan)" },
	{ key: "paidAmount", label: "Sudah Dibayar", getValue: (item) => (item.paidAmount || 0).toLocaleString("id-ID") },
	{ key: "remainingAmount", label: "Sisa Pinjaman", getValue: (item) => (item.remainingAmount || 0).toLocaleString("id-ID") },
	{
		key: "status",
		label: "Status",
		getValue: (item) => {
			const statusMap = {
				pending: "Menunggu",
				active: "Aktif",
				completed: "Lunas",
				overdue: "Terlambat",
				rejected: "Ditolak",
			};
			return statusMap[item.status] || item.status;
		},
	},
	{ key: "startDate", label: "Tanggal Mulai" },
	{ key: "dueDate", label: "Jatuh Tempo" },
];

export function exportLoansToCSV(loans) {
	const csv = arrayToCSV(loans, LOAN_HEADERS);
	const filename = `pinjaman_${new Date().toISOString().split("T")[0]}.csv`;
	downloadBlob("\uFEFF" + csv, filename, "text/csv;charset=utf-8");
}

export function exportLoansToExcel(loans) {
	const ws = XLSX.utils.json_to_sheet(prepareData(loans, LOAN_HEADERS));
	const wb = XLSX.utils.book_new();
	XLSX.utils.book_append_sheet(wb, ws, "Pinjaman");
	XLSX.writeFile(wb, `pinjaman_${new Date().toISOString().split("T")[0]}.xlsx`);
}

const SAVINGS_HEADERS = [
	{ key: "member", label: "Anggota" },
	{ key: "amount", label: "Jumlah", getValue: (item) => item.amount?.toLocaleString("id-ID") },
	{
		key: "type",
		label: "Jenis",
		getValue: (item) => {
			const typeMap = {
				deposit: "Setoran",
				withdrawal: "Penarikan",
				interest: "Bunga",
			};
			return typeMap[item.type] || item.type;
		},
	},
	{ key: "description", label: "Keterangan" },
	{ key: "date", label: "Tanggal" },
];

export function exportSavingsToCSV(savings) {
	const csv = arrayToCSV(savings, SAVINGS_HEADERS);
	const filename = `simpanan_${new Date().toISOString().split("T")[0]}.csv`;
	downloadBlob("\uFEFF" + csv, filename, "text/csv;charset=utf-8");
}

export function exportSavingsToExcel(savings) {
	const ws = XLSX.utils.json_to_sheet(prepareData(savings, SAVINGS_HEADERS));
	const wb = XLSX.utils.book_new();
	XLSX.utils.book_append_sheet(wb, ws, "Simpanan");
	XLSX.writeFile(wb, `simpanan_${new Date().toISOString().split("T")[0]}.xlsx`);
}

const FINANCE_HEADERS = [
	{ key: "date", label: "Tanggal" },
	{
		key: "type",
		label: "Jenis",
		getValue: (item) => {
			const typeMap = {
				income: "Pemasukan",
				expense: "Pengeluaran",
			};
			return typeMap[item.type] || item.type;
		},
	},
	{ key: "description", label: "Keterangan" },
	{ key: "amount", label: "Jumlah", getValue: (item) => (item.amount || 0).toLocaleString("id-ID") },
];

export function exportFinanceToCSV(transactions) {
	const csv = arrayToCSV(transactions, FINANCE_HEADERS);
	const filename = `keuangan_${new Date().toISOString().split("T")[0]}.csv`;
	downloadBlob("\uFEFF" + csv, filename, "text/csv;charset=utf-8");
}

export function exportFinanceToExcel(transactions) {
	const ws = XLSX.utils.json_to_sheet(prepareData(transactions, FINANCE_HEADERS));
	const wb = XLSX.utils.book_new();
	XLSX.utils.book_append_sheet(wb, ws, "Keuangan");
	XLSX.writeFile(wb, `keuangan_${new Date().toISOString().split("T")[0]}.xlsx`);
}

const SALES_HEADERS = [
	{ key: "invoice", label: "Invoice" },
	{ key: "date", label: "Tanggal" },
	{ key: "customer", label: "Pelanggan" },
	{ key: "items", label: "Jumlah Item" },
	{ key: "subtotal", label: "Subtotal", getValue: (item) => (item.subtotal || 0).toLocaleString("id-ID") },
	{ key: "tax", label: "Pajak", getValue: (item) => (item.tax || 0).toLocaleString("id-ID") },
	{ key: "total", label: "Total", getValue: (item) => (item.total || 0).toLocaleString("id-ID") },
	{ key: "payment", label: "Metode Bayar" },
	{
		key: "status",
		label: "Status",
		getValue: (item) => {
			const statusMap = {
				completed: "Selesai",
				pending: "Menunggu",
				cancelled: "Dibatalkan",
			};
			return statusMap[item.status] || item.status;
		},
	},
];

export function exportSalesToCSV(sales) {
	const csv = arrayToCSV(sales, SALES_HEADERS);
	const filename = `penjualan_${new Date().toISOString().split("T")[0]}.csv`;
	downloadBlob("\uFEFF" + csv, filename, "text/csv;charset=utf-8");
}

export function exportSalesToExcel(sales) {
	const ws = XLSX.utils.json_to_sheet(prepareData(sales, SALES_HEADERS));
	const wb = XLSX.utils.book_new();
	XLSX.utils.book_append_sheet(wb, ws, "Penjualan");
	XLSX.writeFile(wb, `penjualan_${new Date().toISOString().split("T")[0]}.xlsx`);
}

const INVENTORY_HEADERS = [
	{ key: "code", label: "Kode" },
	{ key: "name", label: "Nama Produk" },
	{ key: "category", label: "Kategori" },
	{ key: "stock", label: "Stok" },
	{ key: "unit", label: "Unit" },
	{ key: "minStock", label: "Stok Minimal" },
	{ key: "location", label: "Lokasi" },
];

export function exportInventoryToCSV(inventory) {
	const csv = arrayToCSV(inventory, INVENTORY_HEADERS);
	const filename = `inventaris_${new Date().toISOString().split("T")[0]}.csv`;
	downloadBlob("\uFEFF" + csv, filename, "text/csv;charset=utf-8");
}

export function exportInventoryToExcel(inventory) {
	const ws = XLSX.utils.json_to_sheet(prepareData(inventory, INVENTORY_HEADERS));
	const wb = XLSX.utils.book_new();
	XLSX.utils.book_append_sheet(wb, ws, "Inventaris");
	XLSX.writeFile(wb, `inventaris_${new Date().toISOString().split("T")[0]}.xlsx`);
}
