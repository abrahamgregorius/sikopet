/** @format */

export function formatCurrency(num, options = {}) {
	const { short = false, prefix = "Rp " } = options;
	if (num == null || isNaN(num)) return `${prefix}0`;

	if (short) {
		if (num >= 1000000000)
			return `${prefix}${(num / 1000000000).toFixed(1).replace(".0", "")} M`;
		if (num >= 1000000)
			return `${prefix}${(num / 1000000).toFixed(1).replace(".0", "")} Jt`;
		if (num >= 1000) return `${prefix}${(num / 1000).toFixed(0)} Rb`;
	}

	return `${prefix}${num.toLocaleString("id-ID")}`;
}

export function formatDate(date, options = {}) {
	const d = new Date(date);
	if (isNaN(d.getTime())) return "-";

	const { format = "short" } = options;
	if (format === "short") {
		return d.toLocaleDateString("id-ID", {
			day: "numeric",
			month: "short",
			year: "numeric",
		});
	}
	if (format === "month") {
		return d.toLocaleDateString("id-ID", { month: "short", year: "numeric" });
	}
	if (format === "day") {
		return d.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
	}
	return d.toLocaleDateString("id-ID");
}

export function getDateRange(range) {
	const end = new Date();
	end.setHours(23, 59, 59, 999);
	const start = new Date();
	start.setHours(0, 0, 0, 0);

	switch (range) {
		case "7d":
			start.setDate(start.getDate() - 6);
			break;
		case "30d":
			start.setDate(start.getDate() - 29);
			break;
		case "thisMonth":
			start.setDate(1);
			break;
		case "all":
			start.setFullYear(2020, 0, 1);
			break;
		default:
			start.setDate(start.getDate() - 6);
	}

	return { start, end };
}

export function filterByDateRange(items, dateField, start, end) {
	return items.filter((item) => {
		const d = new Date(item[dateField] || item.createdAt);
		return d >= start && d <= end;
	});
}
