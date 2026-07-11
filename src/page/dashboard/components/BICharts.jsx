/** @format */

import {
	LineChart as ReLineChart,
	Line,
	BarChart as ReBarChart,
	Bar,
	PieChart as RePieChart,
	Pie,
	Cell,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from "recharts";

const COLORS = {
	primary: "#398eb3",
	primaryLight: "#67B2D4",
	teal: "#4CC9B0",
	success: "#22C55E",
	warning: "#F59E0B",
	danger: "#EF4444",
	info: "#3B82F6",
	muted: "#94A3B8",
	grid: "#E8EEF2",
	bg: "#F7FAFC",
};

const CHART_COLORS = [
	"#398eb3",
	"#4CC9B0",
	"#67B2D4",
	"#22C55E",
	"#F59E0B",
	"#EF4444",
	"#3B82F6",
	"#8B5CF6",
];

const tooltipStyle = {
	backgroundColor: "#fff",
	border: "1px solid #E5E7EB",
	borderRadius: "12px",
	boxShadow: "0 8px 24px -8px rgba(15,23,42,0.08)",
	fontSize: "12px",
	color: "#0F172A",
};

function CustomTooltip({ active, payload, label, formatter }) {
	if (!active || !payload?.length) return null;
	return (
		<div style={tooltipStyle} className="p-3">
			{label && (
				<p className="font-semibold text-[13px] mb-1.5 text-[#0F172A]">
					{label}
				</p>
			)}
			{payload.map((entry, i) => (
				<p key={i} className="text-[12px] text-[#475569]" style={{ color: entry.color }}>
					{entry.name}:{" "}
					<span className="font-semibold">
						{formatter ? formatter(entry.value, entry.name) : entry.value.toLocaleString("id-ID")}
					</span>
				</p>
			))}
		</div>
	);
}

export function BIDonutChart({ data, dataKey, nameKey, colors, title }) {
	const COLORS_CHART = colors || CHART_COLORS;
	const total = data.reduce((sum, d) => sum + (d[dataKey] || 0), 0);

	return (
		<div className="relative">
			<ResponsiveContainer width="100%" height={200}>
				<RePieChart>
					<Pie
						data={data}
						dataKey={dataKey}
						nameKey={nameKey}
						cx="50%"
						cy="50%"
						innerRadius={55}
						outerRadius={80}
						paddingAngle={3}
						strokeWidth={0}
					>
						{data.map((_, i) => (
							<Cell key={i} fill={COLORS_CHART[i % COLORS_CHART.length]} />
						))}
					</Pie>
					<Tooltip
						content={<CustomTooltip />}
						formatter={(val) => [val.toLocaleString("id-ID"), ""]}
					/>
				</RePieChart>
			</ResponsiveContainer>
			<div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none" style={{ top: "10px" }}>
				<span className="font-display font-extrabold text-[20px] text-[#0F172A]">
					{total.toLocaleString("id-ID")}
				</span>
				<span className="text-[10px] text-[#94A3B8] font-medium">
					{title || "Total"}
				</span>
			</div>
			<div className="mt-2 space-y-1">
				{data.map((d, i) => (
					<div key={i} className="flex items-center justify-between text-[11.5px]">
						<div className="flex items-center gap-1.5">
							<span
								className="w-2 h-2 rounded-sm flex-shrink-0"
								style={{
									backgroundColor: COLORS_CHART[i % COLORS_CHART.length],
								}}
							/>
							<span className="text-[#475569]">{d[nameKey]}</span>
						</div>
						<span className="font-semibold text-[#0F172A]">
							{d[dataKey]?.toLocaleString("id-ID")}
						</span>
					</div>
				))}
			</div>
		</div>
	);
}

export function BILineChart({ data, lines, xKey, height = 200 }) {
	return (
		<ResponsiveContainer width="100%" height={height}>
			<ReLineChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
				<defs>
					{lines.map((line, i) => (
						<linearGradient key={i} id={`grad-${i}`} x1="0" y1="0" x2="0" y2="1">
							<stop offset="5%" stopColor={line.color || CHART_COLORS[i]} stopOpacity={0.2} />
							<stop offset="95%" stopColor={line.color || CHART_COLORS[i]} stopOpacity={0} />
						</linearGradient>
					))}
				</defs>
				<CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} vertical={false} />
				<XAxis
					dataKey={xKey}
					tick={{ fontSize: 11, fill: "#94A3B8" }}
					axisLine={false}
					tickLine={false}
				/>
				<YAxis
					tick={{ fontSize: 11, fill: "#94A3B8" }}
					axisLine={false}
					tickLine={false}
					tickFormatter={(v) =>
						v >= 1000000
							? `${(v / 1000000).toFixed(0)} jt`
							: v >= 1000
								? `${(v / 1000).toFixed(0)} rb`
								: v
					}
				/>
				<Tooltip content={<CustomTooltip />} />
				{lines.length > 1 && <Legend wrapperStyle={{ fontSize: 12, color: "#475569" }} />}
				{lines.map((line, i) => (
					<Line
						key={i}
						type="monotone"
						dataKey={line.dataKey}
						name={line.name}
						stroke={line.color || CHART_COLORS[i]}
						strokeWidth={2.5}
						dot={{ r: 3, fill: line.color || CHART_COLORS[i], strokeWidth: 0 }}
						activeDot={{ r: 5, strokeWidth: 0 }}
					/>
				))}
			</ReLineChart>
		</ResponsiveContainer>
	);
}

export function BIBarChart({ data, bars, xKey, height = 200, stacked = false }) {
	return (
		<ResponsiveContainer width="100%" height={height}>
			<ReBarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
				<CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} vertical={false} />
				<XAxis
					dataKey={xKey}
					tick={{ fontSize: 11, fill: "#94A3B8" }}
					axisLine={false}
					tickLine={false}
				/>
				<YAxis
					tick={{ fontSize: 11, fill: "#94A3B8" }}
					axisLine={false}
					tickLine={false}
					tickFormatter={(v) =>
						v >= 1000000
							? `${(v / 1000000).toFixed(0)} jt`
							: v >= 1000
								? `${(v / 1000).toFixed(0)} rb`
								: v
					}
				/>
				<Tooltip content={<CustomTooltip />} />
				{bars.length > 1 && !stacked && (
					<Legend wrapperStyle={{ fontSize: 12, color: "#475569" }} />
				)}
				{bars.map((bar, i) => (
					<Bar
						key={i}
						dataKey={bar.dataKey}
						name={bar.name}
						fill={bar.color || CHART_COLORS[i]}
						stackId={stacked ? "stack" : undefined}
						radius={stacked ? (i === bars.length - 1 ? [6, 6, 0, 0] : [0, 0, 0, 0]) : [6, 6, 0, 0]}
						maxBarSize={40}
					/>
				))}
			</ReBarChart>
		</ResponsiveContainer>
	);
}

export { CHART_COLORS, COLORS };
