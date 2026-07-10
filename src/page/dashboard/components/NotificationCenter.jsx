/** @format */

import { useDashboardData } from "../../../hooks/useDashboardData.jsx";

const ICONS = {
  info: (
    <path d="M12 9v4M12 17h.01M10.3 3.9L2 20h20L13.7 3.9a2 2 0 00-3.4 0z" strokeLinecap="round" strokeLinejoin="round" />
  ),
  warning: (
    <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" strokeLinecap="round" strokeLinejoin="round" />
  ),
  error: (
    <path d="M12 8v4M12 16h.01M10.3 3.9L2 20h20L13.7 3.9a2 2 0 00-3.4 0z" strokeLinecap="round" strokeLinejoin="round" />
  ),
  success: (
    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
  ),
};

const COLORS = {
  info: { bg: "bg-[#EAF6FB]", stroke: "#398eb3" },
  warning: { bg: "bg-[#F59E0B]/10", stroke: "#F59E0B" },
  error: { bg: "bg-[#EF4444]/10", stroke: "#EF4444" },
  success: { bg: "bg-[#22C55E]/10", stroke: "#22C55E" },
};

export default function NotificationCenter() {
  const { notifications, loading } = useDashboardData();

  if (loading) {
    return (
      <div className="lg:col-span-1 rounded-3xl bg-white border border-[#D8E4EA] p-6">
        <h3 className="font-display font-bold text-[#0F172A] text-[16px] mb-5">Pusat Notifikasi</h3>
        <div className="space-y-3.5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-3">
              <div className="w-8 h-8 rounded-full skel shrink-0"></div>
              <div className="flex-1 space-y-1">
                <div className="h-3 w-3/4 skel rounded"></div>
                <div className="h-2.5 w-20 skel rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="lg:col-span-1 rounded-3xl bg-white border border-[#D8E4EA] p-6">
        <h3 className="font-display font-bold text-[#0F172A] text-[16px] mb-5">Pusat Notifikasi</h3>
        <p className="text-[13px] text-[#94A3B8]">Tidak ada notifikasi baru.</p>
      </div>
    );
  }

  return (
    <div className="lg:col-span-1 rounded-3xl bg-white border border-[#D8E4EA] p-6">
      <h3 className="font-display font-bold text-[#0F172A] text-[16px] mb-5">Pusat Notifikasi</h3>
      <ul className="space-y-3.5">
        {notifications.map((n) => {
          const c = COLORS[n.type] || COLORS.info;
          return (
            <li key={n.id} className="flex gap-3">
              <span className={`w-8 h-8 shrink-0 rounded-full ${c.bg} grid place-items-center`}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c.stroke} strokeWidth="2">
                  {ICONS[n.type] || ICONS.info}
                </svg>
              </span>
              <div>
                <p className="text-[13px] text-[#0F172A]">
                  {n.title && <span className="font-semibold">{n.title}</span>}
                  {n.message && ` — ${n.message}`}
                </p>
                <p className="text-[11.5px] text-[#94A3B8] mt-0.5">{n.time}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
