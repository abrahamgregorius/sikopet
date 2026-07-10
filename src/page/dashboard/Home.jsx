import React, { useState, useEffect, useRef } from "react";

const formatShort = (num, isPrefix) => {
    if (num >= 1000000000) return (num / 1000000000).toFixed(1).replace(".0", "") + " M";
    if (num >= 1000000) return (num / 1000000).toFixed(1).replace(".0", "") + " Jt";
    if (num >= 1000) return (num / 1000).toFixed(0) + " Rb";
    return num.toLocaleString("id-ID");
};

const StatCounter = ({ end, decimals = 0, suffix = "", prefix = "", format = "full", refreshTrigger }) => {
    const [count, setCount] = useState(0);
    const [isSkel, setIsSkel] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const animate = () => {
            setIsSkel(false);
            const duration = 1200;
            const start = performance.now();

            const tick = (now) => {
                const progress = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                setCount(end * eased);
                if (progress < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
        };

        if (refreshTrigger) {
            setIsSkel(true);
            setTimeout(animate, 750);
            return;
        }

        const io = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    animate();
                    io.unobserve(el);
                }
            },
            { threshold: 0.3 }
        );

        io.observe(el);
        return () => io.disconnect();
    }, [end, refreshTrigger]);

    const displayValue = format === "short"
        ? formatShort(Math.round(count))
        : decimals
            ? count.toFixed(decimals)
            : Math.round(count).toLocaleString("id-ID");

    return (
        <p
            ref={ref}
            className={`stat-value font-display font-extrabold text-[24px] mt-3 ${isSkel ? 'skel text-transparent h-[28px]' : 'text-[#0F172A]'}`}
        >
            {!isSkel && `${prefix}${displayValue}${suffix}`}
        </p>
    );
};

export default function Dashboard() {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [openNestedMenu, setOpenNestedMenu] = useState(null);
    const [openHelpAccordion, setOpenHelpAccordion] = useState(null);
    const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [isRangePopoverOpen, setIsRangePopoverOpen] = useState(false);
    const [activePerfTab, setActivePerfTab] = useState("Minggu Ini");
    const [perfValue, setPerfValue] = useState(82);
    const [searchQuery, setSearchQuery] = useState("");
    const [ctxMenu, setCtxMenu] = useState({ isOpen: false, x: 0, y: 0 });
    const [isFabMenuOpen, setIsFabMenuOpen] = useState(false);
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const ctxMenuRef = useRef(null);
    const profileMenuRef = useRef(null);
    const rangePopoverRef = useRef(null);
    const fabMenuRef = useRef(null);

    // Initial reveal animation effect
    useEffect(() => {
        const io = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.classList.add('in');
                    io.unobserve(e.target);
                }
            });
        }, { threshold: 0.1 });
        document.querySelectorAll('.reveal').forEach(el => io.observe(el));
        return () => io.disconnect();
    }, []);

    // Global click listener to close popovers
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ctxMenuRef.current && !ctxMenuRef.current.contains(event.target)) setCtxMenu(prev => ({ ...prev, isOpen: false }));
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target) && !event.target.closest('#profile-btn')) setIsProfileMenuOpen(false);
            if (rangePopoverRef.current && !rangePopoverRef.current.contains(event.target) && !event.target.closest('#range-btn')) setIsRangePopoverOpen(false);
            if (fabMenuRef.current && !fabMenuRef.current.contains(event.target) && !event.target.closest('#fab-btn')) setIsFabMenuOpen(false);
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Keydown for Modals
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                setIsTaskModalOpen(false);
                setIsNotifOpen(false);
                setIsMobileSidebarOpen(false);
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    const toggleNestedMenu = (menu) => {
        setOpenNestedMenu(openNestedMenu === menu ? null : menu);
    };

    const toggleHelpAccordion = (item) => {
        setOpenHelpAccordion(openHelpAccordion === item ? null : item);
    };

    const handlePerfTabClick = (tab, value) => {
        setActivePerfTab(tab);
        setPerfValue(value);
    };

    const handleCtxMenuClick = (e) => {
        e.stopPropagation();
        const rect = e.currentTarget.getBoundingClientRect();
        setCtxMenu({
            isOpen: true,
            y: rect.bottom + window.scrollY + 6,
            x: rect.right - 176 + window.scrollX
        });
    };

    const handleRefreshStats = (e) => {
        const svg = e.currentTarget.querySelector('svg');
        svg.style.animation = 'spin .6s linear';
        setRefreshTrigger(prev => prev + 1);
        setTimeout(() => { svg.style.animation = ''; }, 650);
    };

    const transactions = [
        { name: "Koperasi Sejahtera Bersama", type: "Simpanan", amount: "Rp 4.200.000", status: "Berhasil", date: "14 Jul 2026" },
        { name: "Koperasi Tani Makmur", type: "Pinjaman", amount: "Rp 12.500.000", status: "Tertunda", date: "14 Jul 2026" },
        { name: "Koperasi Nusa Bakti", type: "Penjualan POS", amount: "Rp 863.000", status: "Berhasil", date: "13 Jul 2026" },
        { name: "Koperasi Mitra Usaha", type: "Simpanan", amount: "Rp 1.750.000", status: "Gagal", date: "13 Jul 2026" },
        { name: "Koperasi Karya Bersama", type: "Pinjaman", amount: "Rp 6.000.000", status: "Berhasil", date: "12 Jul 2026" },
    ];

    const filteredTransactions = transactions.filter(tx => tx.name.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div className="text-[#0F172A] antialiased bg-[#F7FAFC] font-['Inter',sans-serif]">
            <style>{`
                html { scroll-behavior: smooth; }
                .font-display { font-family: "Hanken Grotesk", sans-serif; }
                ::selection { background: #67B2D4; color: #fff; }
                .focus-ring:focus-visible { outline: 2px solid #398eb3; outline-offset: 2px; border-radius: 8px; }

                /* Sidebar collapse */
                #sidebar { transition: width .32s cubic-bezier(.22,.61,.36,1); }
                #sidebar.collapsed { width: 84px; }
                #sidebar.collapsed .label,
                #sidebar.collapsed .group-label,
                #sidebar.collapsed .chev-nested { display: none; }
                #sidebar.collapsed .nav-item { justify-content: center; }
                #sidebar.collapsed .brand-text { display: none; }
                #app-shell { transition: margin-left .32s cubic-bezier(.22,.61,.36,1); }

                .nested-panel { max-height: 0; overflow: hidden; transition: max-height .35s ease; }
                .nested-open .nested-panel { max-height: 220px; }
                .nested-open .chev-nested { transform: rotate(180deg); }
                .chev-nested { transition: transform .3s ease; }

                /* Glass */
                .glass { background: rgba(255,255,255,0.7); backdrop-filter: blur(14px) saturate(160%); -webkit-backdrop-filter: blur(14px) saturate(160%); }

                /* Tooltip */
                [data-tip] { position: relative; }
                [data-tip]::after {
                    content: attr(data-tip); position: absolute; bottom: calc(100% + 8px); left: 50%; transform: translateX(-50%) translateY(4px);
                    background: #0F172A; color: #fff; font-size: 11.5px; font-weight: 500; padding: 5px 9px; border-radius: 8px; white-space: nowrap;
                    opacity: 0; pointer-events: none; transition: opacity .18s ease, transform .18s ease; z-index: 60;
                }
                [data-tip]:hover::after, [data-tip]:focus-visible::after { opacity: 1; transform: translateX(-50%) translateY(0); }

                /* Skeleton */
                .skel { background: linear-gradient(90deg, #EDF2F5 25%, #F7FAFC 37%, #EDF2F5 63%); background-size: 400% 100%; animation: skel 1.4s ease infinite; border-radius: 10px; }
                @keyframes skel { 0% { background-position: 100% 50%; } 100% { background-position: 0 50%; } }

                /* Modal / Drawer */
                .overlay { transition: opacity .25s ease; }
                .sheet-modal { transition: opacity .25s ease, transform .25s ease; }
                .drawer-panel { transition: transform .32s cubic-bezier(.22,.61,.36,1); }

                /* Circular progress */
                .ring { border-radius: 50%; background: conic-gradient(var(--ring-color,#398eb3) calc(var(--p,0)*1%), #E8EEF2 0); }
                .ring-inner { background: #fff; border-radius: 50%; }

                /* Fade/scale utility */
                .pop-enter { animation: popIn .18s cubic-bezier(.22,.61,.36,1); }
                @keyframes popIn { from { opacity: 0; transform: scale(.96) translateY(-4px); } to { opacity: 1; transform: scale(1) translateY(0); } }

                .reveal { opacity: 0; transform: translateY(14px); transition: opacity .6s ease, transform .6s ease; }
                .reveal.in { opacity: 1; transform: translateY(0); }
                @media (prefers-reduced-motion: reduce) {
                    * { animation-duration: .001ms !important; transition-duration: .001ms !important; }
                }

                tbody tr { transition: background-color .15s ease; }
                #sidebar-scroll::-webkit-scrollbar { width: 5px; }
                #sidebar-scroll::-webkit-scrollbar-thumb { background: #D8E4EA; border-radius: 10px; }
                @keyframes spin { from { transform: rotate(0); } to { transform: rotate(360deg); } }

                .shadow-soft { box-shadow: 0 1px 2px rgba(15,23,42,0.04), 0 8px 24px -8px rgba(15,23,42,0.08); }
                .shadow-lift { box-shadow: 0 4px 10px rgba(15,23,42,0.05), 0 20px 40px -16px rgba(15,23,42,0.16); }
                .shadow-glow { box-shadow: 0 0 0 1px rgba(57,142,179,0.10), 0 12px 32px -8px rgba(57,142,179,0.28); }
            `}</style>

            <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[200] focus:bg-white focus:px-4 focus:py-2 focus:rounded-lg shadow-lift">Lompat ke konten</a>

            <div className="flex min-h-screen">
                {/* ============ SIDEBAR ============ */}
                <aside id="sidebar" className={`hidden lg:flex flex-col shrink-0 bg-white border-r border-[#D8E4EA] sticky top-0 h-screen z-40 ${isSidebarCollapsed ? 'collapsed w-[84px]' : 'w-64'}`}>
                    <div className="h-[72px] flex items-center gap-2.5 px-5 border-b border-[#D8E4EA] shrink-0">
                        <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#398eb3] to-[#4CC9B0] grid place-items-center shrink-0">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                <circle cx="5" cy="12" r="2.2" fill="white" />
                                <circle cx="12" cy="6" r="2.2" fill="white" fillOpacity="0.85" />
                                <circle cx="19" cy="12" r="2.2" fill="white" />
                                <circle cx="12" cy="18" r="2.2" fill="white" fillOpacity="0.85" />
                                <path d="M5 12L12 6M12 6L19 12M19 12L12 18M12 18L5 12" stroke="white" strokeWidth="1.3" strokeOpacity="0.6" />
                            </svg>
                        </span>
                        <span className="brand-text font-display font-extrabold text-[18px] tracking-tight">SIKOPET</span>
                    </div>

                    <nav id="sidebar-scroll" className="flex-1 overflow-y-auto px-3.5 py-5 space-y-6" aria-label="Navigasi sisi">
                        <div>
                            <p className="group-label px-3 text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider mb-2">Utama</p>
                            <ul className="space-y-1">
                                <li>
                                    <a href="#main-content" className="nav-item relative flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-[14px] focus-ring text-[#0F172A] bg-[#F1F5F9]" data-tip="Dasbor">
                                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-full bg-[#398eb3]"></span>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="shrink-0"><rect x="3" y="3" width="7" height="9" rx="2" /><rect x="14" y="3" width="7" height="5" rx="2" /><rect x="14" y="12" width="7" height="9" rx="2" /><rect x="3" y="16" width="7" height="5" rx="2" /></svg>
                                        <span className="label">Dasbor</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="#analitik" className="nav-item flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-[14px] text-[#475569] hover:bg-[#F1F5F9] transition-colors focus-ring" data-tip="Analitik">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="shrink-0"><path d="M3 3v18h18M7 15l4-6 3 4 4-7" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                        <span className="label">Analitik</span>
                                    </a>
                                </li>
                            </ul>
                            <div className={`mt-3 px-3 space-y-2 ${isSidebarCollapsed ? 'hidden' : ''}`}>
                                <div className="rounded-xl bg-gradient-to-br from-[#EAF6FB] to-[#F1F5F9] border border-[#D8E4EA] p-3">
                                    <p className="text-[10px] font-semibold text-[#2F7698] uppercase tracking-wider mb-2">Ringkasan Dasbor</p>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <p className="text-[16px] font-bold text-[#0F172A]">428.5M</p>
                                            <p className="text-[9px] text-[#94A3B8]">Pendapatan Bulan Ini</p>
                                        </div>
                                        <div>
                                            <p className="text-[16px] font-bold text-[#0F172A]">2,318</p>
                                            <p className="text-[9px] text-[#94A3B8]">Anggota Aktif</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <p className="group-label px-3 text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider mb-2">Operasional</p>
                            <ul className="space-y-1">
                                <li>
                                    <a href="#anggota-panel" className="nav-item flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-[14px] text-[#475569] hover:bg-[#F1F5F9] transition-colors focus-ring" data-tip="Keanggotaan">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="shrink-0"><path d="M17 20v-1a4 4 0 00-4-4H7a4 4 0 00-4 4v1M10 11a4 4 0 100-8 4 4 0 000 8z" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                        <span className="label">Keanggotaan</span>
                                    </a>
                                </li>

                                <li className={`nested-group ${openNestedMenu === 'keuangan' ? 'nested-open' : ''}`}>
                                    <button onClick={() => toggleNestedMenu('keuangan')} className="nested-toggle w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-[14px] text-[#475569] hover:bg-[#F1F5F9] transition-colors focus-ring" aria-expanded={openNestedMenu === 'keuangan'} data-tip="Keuangan">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="shrink-0"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                        <span className="label flex-1 text-left">Keuangan</span>
                                        <svg className="chev-nested w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                    </button>
                                    <div className="nested-panel pl-[42px]">
                                        <ul className="space-y-0.5 py-1.5 border-l border-[#D8E4EA] ml-[3px]">
                                            <li><a href="#transaksi" data-tip="Jurnal Umum" className="label block px-3 py-2 text-[13.5px] text-[#475569] hover:text-[#2F7698] transition-colors focus-ring">Jurnal Umum</a></li>
                                            <li><a href="#transaksi" data-tip="Neraca" className="label block px-3 py-2 text-[13.5px] text-[#475569] hover:text-[#2F7698] transition-colors focus-ring">Neraca</a></li>
                                            <li><a href="#transaksi" data-tip="Laporan SHU" className="label block px-3 py-2 text-[13.5px] text-[#475569] hover:text-[#2F7698] transition-colors focus-ring">Laporan SHU</a></li>
                                        </ul>
                                    </div>
                                </li>

                                <li>
                                    <a href="#transaksi" className="nav-item flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-[14px] text-[#475569] hover:bg-[#F1F5F9] transition-colors focus-ring" data-tip="Kasir">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="shrink-0"><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" strokeLinecap="round" /></svg>
                                        <span className="label">Kasir</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="nav-item flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-[14px] text-[#475569] hover:bg-[#F1F5F9] transition-colors focus-ring" data-tip="Simpan Pinjam">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="shrink-0"><circle cx="12" cy="12" r="9" /><path d="M9 12h6M12 9v6" strokeLinecap="round" /></svg>
                                        <span className="label">Simpan Pinjam</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="#dokumen-panel" className="nav-item flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-[14px] text-[#475569] hover:bg-[#F1F5F9] transition-colors focus-ring" data-tip="Inventaris">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="shrink-0"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                        <span className="label">Inventaris</span>
                                    </a>
                                </li>
                            </ul>
                            <div className={`mt-3 px-3 space-y-2 ${isSidebarCollapsed ? 'hidden' : ''}`}>
                                <div className="rounded-xl bg-[#F1F5F9] border border-[#D8E4EA] p-3">
                                    <p className="text-[10px] font-semibold text-[#475569] uppercase tracking-wider mb-2">Keanggotaan</p>
                                    <div className="space-y-1.5">
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] text-[#94A3B8]">Total Anggota</span>
                                            <span className="text-[12px] font-bold text-[#0F172A]">2,318</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] text-[#94A3B8]">Baru Bulan Ini</span>
                                            <span className="text-[12px] font-bold text-[#22C55E]">+47</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="rounded-xl bg-[#F1F5F9] border border-[#D8E4EA] p-3">
                                    <p className="text-[10px] font-semibold text-[#475569] uppercase tracking-wider mb-2">Kasir</p>
                                    <div className="space-y-1.5">
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] text-[#94A3B8]">Transaksi Hari Ini</span>
                                            <span className="text-[12px] font-bold text-[#0F172A]">1,042</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] text-[#94A3B8]">Total Penjualan</span>
                                            <span className="text-[12px] font-bold text-[#398eb3]">Rp 12.8M</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="rounded-xl bg-[#F1F5F9] border border-[#D8E4EA] p-3">
                                    <p className="text-[10px] font-semibold text-[#475569] uppercase tracking-wider mb-2">Simpan Pinjam</p>
                                    <div className="space-y-1.5">
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] text-[#94A3B8]">Total Simpanan</span>
                                            <span className="text-[12px] font-bold text-[#0F172A]">Rp 8.4M</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] text-[#94A3B8]">Total Pinjaman</span>
                                            <span className="text-[12px] font-bold text-[#F59E0B]">Rp 3.2M</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="rounded-xl bg-[#F1F5F9] border border-[#D8E4EA] p-3">
                                    <p className="text-[10px] font-semibold text-[#475569] uppercase tracking-wider mb-2">Inventaris</p>
                                    <div className="space-y-1.5">
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] text-[#94A3B8]">Total Barang</span>
                                            <span className="text-[12px] font-bold text-[#0F172A]">156</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] text-[#94A3B8]">Perlu Diperiksa</span>
                                            <span className="text-[12px] font-bold text-[#EF4444]">8</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <p className="group-label px-3 text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider mb-2">Tim</p>
                            <ul className="space-y-1">
                                <li>
                                    <a href="#tim-panel" className="nav-item flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-[14px] text-[#475569] hover:bg-[#F1F5F9] transition-colors focus-ring" data-tip="Anggota Tim">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="shrink-0"><circle cx="9" cy="8" r="3" /><path d="M2 20a7 7 0 0114 0M16 6a3 3 0 010 6M22 20a7 7 0 00-6-6.9" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                        <span className="label">Anggota Tim</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="#tugas-panel" className="nav-item flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-[14px] text-[#475569] hover:bg-[#F1F5F9] transition-colors focus-ring" data-tip="Tugas">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="shrink-0"><rect x="4" y="4" width="16" height="16" rx="3" /><path d="M8 12l2.5 2.5L16 9" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                        <span className="label">Tugas</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="nav-item flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-[14px] text-[#475569] hover:bg-[#F1F5F9] transition-colors focus-ring" data-tip="Pengaturan">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="shrink-0"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06A1.65 1.65 0 004.6 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06A1.65 1.65 0 009 4.6a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                        <span className="label">Pengaturan</span>
                                    </a>
                                </li>
                            </ul>
                            <div className={`mt-3 px-3 space-y-2 ${isSidebarCollapsed ? 'hidden' : ''}`}>
                                <div className="rounded-xl bg-[#F1F5F9] border border-[#D8E4EA] p-3">
                                    <p className="text-[10px] font-semibold text-[#475569] uppercase tracking-wider mb-2">Anggota Tim</p>
                                    <div className="space-y-1.5">
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] text-[#94A3B8]">Total Tim</span>
                                            <span className="text-[12px] font-bold text-[#0F172A]">12</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] text-[#94A3B8]">Online</span>
                                            <span className="text-[12px] font-bold text-[#22C55E]">8</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="rounded-xl bg-[#F1F5F9] border border-[#D8E4EA] p-3">
                                    <p className="text-[10px] font-semibold text-[#475569] uppercase tracking-wider mb-2">Tugas</p>
                                    <div className="space-y-1.5">
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] text-[#94A3B8]">Aktif</span>
                                            <span className="text-[12px] font-bold text-[#0F172A]">24</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] text-[#94A3B8]">Selesai Bulan Ini</span>
                                            <span className="text-[12px] font-bold text-[#22C55E]">67</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </nav>

                    <div className="p-3.5 border-t border-[#D8E4EA] shrink-0">
                        <div className="label flex items-center gap-2.5 rounded-xl bg-[#EAF6FB] px-3.5 py-3">
                            <span className="relative w-2.5 h-2.5 shrink-0">
                                <span className="absolute inset-0 rounded-full bg-[#22C55E]"></span>
                                <span className="absolute inset-0 rounded-full bg-[#22C55E] animate-ping opacity-60"></span>
                            </span>
                            <div className="min-w-0">
                                <p className="text-[12px] font-semibold text-[#2F7698]">Sinkron Aktif</p>
                                <p className="text-[10.5px] text-[#2F7698]/70">Terakhir 2 menit lalu</p>
                            </div>
                        </div>
                        <button onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} data-tip={isSidebarCollapsed ? "Perluas sidebar" : "Ciutkan sidebar"} className="focus-ring mt-3 w-full flex items-center justify-center gap-2 py-2 rounded-xl text-[#94A3B8] hover:bg-[#F1F5F9] hover:text-[#0F172A] transition-colors" aria-label="Ciutkan atau perluas sidebar">
                            <svg style={{ transform: isSidebarCollapsed ? 'rotate(180deg)' : 'rotate(0)' }} className="transition-transform" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 19l-7-7 7-7M18 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            <span className="label text-[12.5px] font-medium">Ciutkan</span>
                        </button>
                    </div>
                </aside>

                {/* Mobile sidebar drawer */}
                <div onClick={() => setIsMobileSidebarOpen(false)} className={`overlay fixed inset-0 bg-[#0F172A]/40 z-40 lg:hidden ${isMobileSidebarOpen ? 'opacity-100 block' : 'opacity-0 hidden'}`}></div>
                <aside className={`drawer-panel fixed top-0 left-0 h-full w-72 bg-white z-50 lg:hidden flex flex-col ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <div className="h-[72px] flex items-center justify-between px-5 border-b border-[#D8E4EA]">
                        <span className="font-display font-extrabold text-[18px]">SIKOPET</span>
                        <button onClick={() => setIsMobileSidebarOpen(false)} className="focus-ring p-1.5" aria-label="Tutup menu"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" /></svg></button>
                    </div>
                    <nav className="flex-1 overflow-y-auto px-3.5 py-5 space-y-1 text-[14.5px] font-medium text-[#475569]">
                        <a href="#main-content" onClick={() => setIsMobileSidebarOpen(false)} className="block px-3 py-2.5 rounded-xl bg-[#EAF6FB] text-[#2F7698]">Dasbor</a>
                        <a href="#analitik" onClick={() => setIsMobileSidebarOpen(false)} className="block px-3 py-2.5 rounded-xl hover:bg-[#F1F5F9]">Analitik</a>
                        <a href="#anggota-panel" onClick={() => setIsMobileSidebarOpen(false)} className="block px-3 py-2.5 rounded-xl hover:bg-[#F1F5F9]">Keanggotaan</a>
                        <a href="#transaksi" onClick={() => setIsMobileSidebarOpen(false)} className="block px-3 py-2.5 rounded-xl hover:bg-[#F1F5F9]">Keuangan</a>
                        <a href="#dokumen-panel" onClick={() => setIsMobileSidebarOpen(false)} className="block px-3 py-2.5 rounded-xl hover:bg-[#F1F5F9]">Inventaris</a>
                        <a href="#tim-panel" onClick={() => setIsMobileSidebarOpen(false)} className="block px-3 py-2.5 rounded-xl hover:bg-[#F1F5F9]">Anggota Tim</a>
                        <a href="#tugas-panel" onClick={() => setIsMobileSidebarOpen(false)} className="block px-3 py-2.5 rounded-xl hover:bg-[#F1F5F9]">Tugas</a>
                    </nav>
                </aside>

                {/* ============ APP SHELL ============ */}
                <div id="app-shell" className="flex-1 min-w-0 flex flex-col">

                    {/* TOP NAV */}
                    <header className="sticky top-0 z-30 glass border-b border-[#D8E4EA]">
                        <div className="h-[72px] flex items-center gap-3 px-4 sm:px-6">
                            <button onClick={() => setIsMobileSidebarOpen(true)} className="focus-ring lg:hidden p-2 -ml-2 text-[#0F172A]" aria-label="Buka menu">
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" /></svg>
                            </button>

                            <div className="hidden sm:block text-[13px] text-[#94A3B8]" aria-label="Breadcrumb">
                                <ol className="flex items-center gap-1.5">
                                    <li>SIKOPET</li>
                                    <li aria-hidden="true">/</li>
                                    <li className="text-[#0F172A] font-medium">Dasbor</li>
                                    <li aria-hidden="true">/</li>
                                    <li>Ringkasan</li>
                                </ol>
                            </div>

                            <div className="flex-1 flex justify-center px-2">
                                <label className="relative w-full max-w-[420px]">
                                    <span className="sr-only">Cari</span>
                                    <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" strokeLinecap="round" /></svg>
                                    <input type="search" placeholder="Cari koperasi, anggota, transaksi…" className="focus-ring w-full pl-10 pr-4 py-2.5 rounded-full bg-[#F1F5F9] border border-transparent focus:border-[#67B2D4] focus:bg-white text-[13.5px] placeholder:text-[#94A3B8] transition-colors" />
                                </label>
                            </div>

                            <div className="flex items-center gap-1.5 sm:gap-2.5">
                                <button data-tip="Pesan" className="focus-ring relative p-2.5 rounded-full hover:bg-[#F1F5F9] transition-colors" aria-label="Pesan">
                                    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#4CC9B0]"></span>
                                </button>

                                <div className="relative">
                                    <button onClick={() => setIsNotifOpen(true)} data-tip="Notifikasi" className="focus-ring relative p-2.5 rounded-full hover:bg-[#F1F5F9] transition-colors" aria-label="Notifikasi" aria-haspopup="true">
                                        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9" strokeLinecap="round" strokeLinejoin="round" /><path d="M13.7 21a2 2 0 01-3.4 0" strokeLinecap="round" /></svg>
                                        <span className="absolute top-1.5 right-1.5 min-w-[15px] h-[15px] px-[3px] rounded-full bg-[#EF4444] text-white text-[9.5px] font-bold grid place-items-center">5</span>
                                    </button>
                                </div>

                                <div className="w-px h-6 bg-[#D8E4EA] mx-1 hidden sm:block"></div>

                                <div className="relative" ref={profileMenuRef}>
                                    <button id="profile-btn" onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} className="focus-ring flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-full hover:bg-[#F1F5F9] transition-colors" aria-haspopup="true" aria-expanded={isProfileMenuOpen}>
                                        <span className="w-9 h-9 rounded-full bg-gradient-to-br from-[#398eb3] to-[#2F7698] grid place-items-center text-white font-display font-bold text-[13px]">AS</span>
                                        <span className="hidden md:flex flex-col items-start leading-tight">
                                            <span className="text-[13px] font-semibold text-[#0F172A]">Andi Saputra</span>
                                            <span className="text-[11px] text-[#94A3B8]">Administrator</span>
                                        </span>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="hidden md:block text-[#94A3B8]"><path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                    </button>

                                    {isProfileMenuOpen && (
                                        <div className="pop-enter absolute right-0 top-[calc(100%+10px)] w-64 bg-white rounded-2xl border border-[#D8E4EA] shadow-lift p-2 z-50">
                                            <div className="px-3.5 py-3 border-b border-[#E8EEF2] mb-1.5">
                                                <p className="text-[13.5px] font-semibold text-[#0F172A]">Andi Saputra</p>
                                                <p className="text-[12px] text-[#94A3B8]">andi.saputra@SIKOPET.id</p>
                                            </div>
                                            <a href="#" className="focus-ring flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-[13.5px] text-[#475569] hover:bg-[#F1F5F9] transition-colors">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 3.5-7 8-7s8 3 8 7" strokeLinecap="round" /></svg>
                                                Profil Saya
                                            </a>
                                            <a href="#" className="focus-ring flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-[13.5px] text-[#475569] hover:bg-[#F1F5F9] transition-colors">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82" strokeLinecap="round" /></svg>
                                                Pengaturan Akun
                                            </a>
                                            <a href="#" className="focus-ring flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-[13.5px] text-[#475569] hover:bg-[#F1F5F9] transition-colors">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="9" /><path d="M9.5 9a2.5 2.5 0 015 0c0 1.5-2 2-2.5 3M12 17h.01" strokeLinecap="round" /></svg>
                                                Bantuan
                                            </a>
                                            <div className="h-px bg-[#E8EEF2] my-1.5"></div>
                                            <a href="#" className="focus-ring flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-[13.5px] text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                                Keluar
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* ============ MAIN CONTENT ============ */}
                    <div className="flex-1 flex">
                        <main id="main-content" className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-7 space-y-7">

                            {/* HERO HEADER */}
                            <section className="reveal in relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#398eb3] via-[#2F7698] to-[#0F172A] px-6 sm:px-8 py-8 sm:py-9">
                                <div className="absolute -top-16 -right-10 w-64 h-64 rounded-full bg-white/10 blur-3xl"></div>
                                <div className="absolute -bottom-20 left-1/3 w-72 h-72 rounded-full bg-[#4CC9B0]/20 blur-3xl"></div>
                                <div className="relative flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                                    <div>
                                        <p className="text-white/70 text-[13px] font-medium">Selasa, 14 Juli 2026 · 09:24 WIB</p>
                                        <h1 className="font-display font-extrabold text-white text-[26px] sm:text-[30px] tracking-tight mt-1.5">Selamat pagi, Andi 👋</h1>
                                        <p className="text-white/75 text-[14.5px] mt-2 max-w-[460px]">12 koperasi mengirim laporan baru minggu ini. Ada 4 persetujuan yang menunggu tinjauan Anda.</p>
                                    </div>
                                    <div className="flex flex-wrap gap-3">
                                        <button onClick={() => setIsTaskModalOpen(true)} className="focus-ring inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white text-[#2F7698] font-semibold text-[14px] shadow-lift hover:-translate-y-0.5 transition-all duration-300">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M12 5v14M5 12h14" strokeLinecap="round" /></svg>
                                            Tugas Baru
                                        </button>
                                        <button className="focus-ring inline-flex items-center gap-2 px-5 py-3 rounded-full border border-white/30 text-white font-semibold text-[14px] hover:bg-white/10 transition-all duration-300">
                                            Unduh Laporan
                                        </button>
                                    </div>
                                </div>
                            </section>

                            {/* QUICK ACTIONS */}
                            <section aria-label="Aksi cepat" className="reveal in grid grid-cols-2 sm:grid-cols-4 gap-4">
                                <button className="focus-ring group text-left rounded-2xl bg-white border border-[#D8E4EA] p-5 hover:shadow-soft hover:-translate-y-0.5 transition-all duration-300">
                                    <span className="w-10 h-10 rounded-xl bg-[#EAF6FB] grid place-items-center mb-3 group-hover:scale-110 transition-transform"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#398eb3" strokeWidth="1.8"><path d="M17 20v-1a4 4 0 00-4-4H7a4 4 0 00-4 4v1M10 11a4 4 0 100-8 4 4 0 000 8zM19 8v6M22 11h-6" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
                                    <p className="font-semibold text-[#0F172A] text-[13.5px]">Tambah Anggota</p>
                                </button>
                                <button className="focus-ring group text-left rounded-2xl bg-white border border-[#D8E4EA] p-5 hover:shadow-soft hover:-translate-y-0.5 transition-all duration-300">
                                    <span className="w-10 h-10 rounded-xl bg-[#EAF6FB] grid place-items-center mb-3 group-hover:scale-110 transition-transform"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#398eb3" strokeWidth="1.8"><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" strokeLinecap="round" /></svg></span>
                                    <p className="font-semibold text-[#0F172A] text-[13.5px]">Catat Transaksi</p>
                                </button>
                                <button onClick={() => setIsTaskModalOpen(true)} className="focus-ring group text-left rounded-2xl bg-white border border-[#D8E4EA] p-5 hover:shadow-soft hover:-translate-y-0.5 transition-all duration-300">
                                    <span className="w-10 h-10 rounded-xl bg-[#EAF6FB] grid place-items-center mb-3 group-hover:scale-110 transition-transform"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#398eb3" strokeWidth="1.8"><path d="M17 1l4 4-4 4M3 11V9a4 4 0 014-4h14M7 23l-4-4 4-4M21 13v2a4 4 0 01-4 4H3" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
                                    <p className="font-semibold text-[#0F172A] text-[13.5px]">Proses Pinjaman</p>
                                </button>
                                <button className="focus-ring group text-left rounded-2xl bg-white border border-[#D8E4EA] p-5 hover:shadow-soft hover:-translate-y-0.5 transition-all duration-300">
                                    <span className="w-10 h-10 rounded-xl bg-[#EAF6FB] grid place-items-center mb-3 group-hover:scale-110 transition-transform"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#398eb3" strokeWidth="1.8"><path d="M9 17V9M13 17v-4M17 17V6M4 4h16v16H4z" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
                                    <p className="font-semibold text-[#0F172A] text-[13.5px]">Buat Laporan</p>
                                </button>
                            </section>

                            {/* STAT CARDS */}
                            <section aria-label="Statistik ringkasan" className="reveal in">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="font-display font-bold text-[#0F172A] text-[17px]">Ringkasan Kinerja</h2>
                                    <button onClick={handleRefreshStats} data-tip="Muat ulang" className="focus-ring p-2 rounded-full hover:bg-[#F1F5F9] text-[#94A3B8] hover:text-[#0F172A] transition-colors" aria-label="Muat ulang statistik">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 12a8 8 0 0114-5.3M20 12a8 8 0 01-14 5.3M4 4v5h5M20 20v-5h-5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                    </button>
                                </div>
                                <div id="stats-grid" className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div className="stat-card rounded-2xl bg-white border border-[#D8E4EA] p-5 hover:shadow-soft transition-shadow duration-300">
                                        <div className="flex items-start justify-between">
                                            <span className="w-10 h-10 rounded-xl bg-[#EAF6FB] grid place-items-center"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#398eb3" strokeWidth="1.8"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
                                            <span className="inline-flex items-center gap-1 text-[11.5px] font-semibold text-[#22C55E] bg-[#22C55E]/10 px-2 py-1 rounded-full">
                                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12l5-5 4 4 5-5" strokeLinecap="round" strokeLinejoin="round" /></svg>+12.4%
                                            </span>
                                        </div>
                                        <StatCounter end={428500000} prefix="Rp " format="short" refreshTrigger={refreshTrigger} />
                                        <p className="text-[13px] text-[#94A3B8] mt-1">Pendapatan Bulan Ini</p>
                                    </div>

                                    <div className="stat-card rounded-2xl bg-white border border-[#D8E4EA] p-5 hover:shadow-soft transition-shadow duration-300">
                                        <div className="flex items-start justify-between">
                                            <span className="w-10 h-10 rounded-xl bg-[#EAF6FB] grid place-items-center"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#398eb3" strokeWidth="1.8"><path d="M17 20v-1a4 4 0 00-4-4H7a4 4 0 00-4 4v1M10 11a4 4 0 100-8 4 4 0 000 8z" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
                                            <span className="inline-flex items-center gap-1 text-[11.5px] font-semibold text-[#22C55E] bg-[#22C55E]/10 px-2 py-1 rounded-full">
                                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12l5-5 4 4 5-5" strokeLinecap="round" strokeLinejoin="round" /></svg>+3.1%
                                            </span>
                                        </div>
                                        <StatCounter end={2318} refreshTrigger={refreshTrigger} />
                                        <p className="text-[13px] text-[#94A3B8] mt-1">Anggota Aktif</p>
                                    </div>

                                    <div className="stat-card rounded-2xl bg-white border border-[#D8E4EA] p-5 hover:shadow-soft transition-shadow duration-300">
                                        <div className="flex items-start justify-between">
                                            <span className="w-10 h-10 rounded-xl bg-[#EAF6FB] grid place-items-center"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#398eb3" strokeWidth="1.8"><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" strokeLinecap="round" /></svg></span>
                                            <span className="inline-flex items-center gap-1 text-[11.5px] font-semibold text-[#EF4444] bg-[#EF4444]/10 px-2 py-1 rounded-full">
                                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12l5 5 4-4 5 5" strokeLinecap="round" strokeLinejoin="round" /></svg>-1.8%
                                            </span>
                                        </div>
                                        <StatCounter end={1042} refreshTrigger={refreshTrigger} />
                                        <p className="text-[13px] text-[#94A3B8] mt-1">Transaksi Hari Ini</p>
                                    </div>

                                    <div className="stat-card rounded-2xl bg-white border border-[#D8E4EA] p-5 hover:shadow-soft transition-shadow duration-300">
                                        <div className="flex items-start justify-between">
                                            <span className="w-10 h-10 rounded-xl bg-[#EAF6FB] grid place-items-center"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#398eb3" strokeWidth="1.8"><path d="M4 12a8 8 0 0114-5.3M20 12a8 8 0 01-14 5.3M4 4v5h5M20 20v-5h-5" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
                                            <span className="popover-trigger relative">
                                                <button data-tip="Info" className="focus-ring text-[#94A3B8] hover:text-[#0F172A]" aria-label="Info sinkronisasi"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9" /><path d="M12 8h.01M11 12h1v4h1" strokeLinecap="round" /></svg></button>
                                            </span>
                                        </div>
                                        <StatCounter end={99.8} decimals={1} suffix="%" refreshTrigger={refreshTrigger} />
                                        <p className="text-[13px] text-[#94A3B8] mt-1">Sinkronisasi Berhasil</p>
                                    </div>
                                </div>
                            </section>

                            {/* ANALYTICS: line chart + circular performance */}
                            <section id="analitik" aria-label="Analitik" className="reveal in grid lg:grid-cols-3 gap-5">
                                <div className="lg:col-span-2 rounded-3xl bg-white border border-[#D8E4EA] p-6">
                                    <div className="flex flex-wrap items-center justify-between gap-3 mb-1">
                                        <div>
                                            <h3 className="font-display font-bold text-[#0F172A] text-[16px]">Tren Transaksi</h3>
                                            <p className="text-[12.5px] text-[#94A3B8] mt-0.5">Volume transaksi harian, 7 hari terakhir</p>
                                        </div>
                                        <div className="relative" ref={rangePopoverRef}>
                                            <button id="range-btn" onClick={() => setIsRangePopoverOpen(!isRangePopoverOpen)} className="focus-ring inline-flex items-center gap-2 px-3.5 py-2 rounded-full border border-[#D8E4EA] text-[12.5px] font-semibold text-[#475569] hover:bg-[#F1F5F9] transition-colors">
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M8 3v4M16 3v4M3 10h18" strokeLinecap="round" /></svg>
                                                7 Hari Terakhir
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                            </button>
                                            {isRangePopoverOpen && (
                                                <div className="pop-enter absolute right-0 top-[calc(100%+8px)] w-60 bg-white rounded-2xl border border-[#D8E4EA] shadow-lift p-4 z-40">
                                                    <p className="text-[11.5px] font-bold text-[#94A3B8] uppercase tracking-wide mb-2.5">Pilih Rentang</p>
                                                    <div className="grid grid-cols-7 gap-1 text-center text-[11px] text-[#94A3B8] mb-1.5">
                                                        <span>M</span><span>S</span><span>S</span><span>R</span><span>K</span><span>J</span><span>S</span>
                                                    </div>
                                                    <div className="grid grid-cols-7 gap-1 text-center text-[12px]">
                                                        <span className="py-1.5 rounded-lg text-[#94A3B8]">30</span><span className="py-1.5 rounded-lg">1</span><span className="py-1.5 rounded-lg">2</span><span className="py-1.5 rounded-lg">3</span><span className="py-1.5 rounded-lg">4</span><span className="py-1.5 rounded-lg">5</span><span className="py-1.5 rounded-lg">6</span>
                                                        <span className="py-1.5 rounded-lg">7</span><span className="py-1.5 rounded-lg bg-[#EAF6FB] text-[#2F7698] font-semibold">8</span><span className="py-1.5 rounded-lg bg-[#398eb3] text-white font-semibold">9</span><span className="py-1.5 rounded-lg bg-[#EAF6FB] text-[#2F7698] font-semibold">10</span><span className="py-1.5 rounded-lg">11</span><span className="py-1.5 rounded-lg">12</span><span className="py-1.5 rounded-lg">13</span>
                                                        <span className="py-1.5 rounded-lg">14</span><span className="py-1.5 rounded-lg font-semibold text-[#2F7698] border border-[#67B2D4]">15</span><span className="py-1.5 rounded-lg">16</span><span className="py-1.5 rounded-lg">17</span><span className="py-1.5 rounded-lg">18</span><span className="py-1.5 rounded-lg">19</span><span className="py-1.5 rounded-lg">20</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <svg viewBox="0 0 560 200" className="w-full h-[200px] mt-4" role="img" aria-label="Grafik tren transaksi tujuh hari terakhir">
                                        <defs>
                                            <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#398eb3" stopOpacity="0.22" />
                                                <stop offset="100%" stopColor="#398eb3" stopOpacity="0" />
                                            </linearGradient>
                                        </defs>
                                        <g stroke="#E8EEF2" strokeWidth="1">
                                            <line x1="0" y1="20" x2="560" y2="20" />
                                            <line x1="0" y1="65" x2="560" y2="65" />
                                            <line x1="0" y1="110" x2="560" y2="110" />
                                            <line x1="0" y1="155" x2="560" y2="155" />
                                        </g>
                                        <path d="M0,150 L80,120 L160,135 L240,80 L320,95 L400,50 L480,65 L560,30 L560,180 L0,180 Z" fill="url(#areaFill)" />
                                        <path d="M0,150 L80,120 L160,135 L240,80 L320,95 L400,50 L480,65 L560,30" fill="none" stroke="#398eb3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                        <g fill="#398eb3">
                                            <circle cx="0" cy="150" r="3.5" /><circle cx="80" cy="120" r="3.5" /><circle cx="160" cy="135" r="3.5" /><circle cx="240" cy="80" r="3.5" />
                                            <circle cx="320" cy="95" r="3.5" /><circle cx="400" cy="50" r="3.5" /><circle cx="480" cy="65" r="3.5" />
                                            <circle cx="560" cy="30" r="4.5" fill="#2F7698" />
                                        </g>
                                    </svg>
                                    <div className="flex justify-between mt-1 text-[11px] text-[#94A3B8] font-medium px-0.5">
                                        <span>Sen</span><span>Sel</span><span>Rab</span><span>Kam</span><span>Jum</span><span>Sab</span><span>Ming</span>
                                    </div>
                                </div>

                                <div className="rounded-3xl bg-white border border-[#D8E4EA] p-6 flex flex-col">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-display font-bold text-[#0F172A] text-[16px]">Performa Target</h3>
                                    </div>
                                    <div role="tablist" className="inline-flex bg-[#F1F5F9] rounded-full p-1 mb-5 self-start">
                                        <button role="tab" aria-selected={activePerfTab === "Minggu Ini"} onClick={() => handlePerfTabClick("Minggu Ini", 82)} className={`focus-ring px-3.5 py-1.5 rounded-full text-[12.5px] font-semibold transition-colors ${activePerfTab === 'Minggu Ini' ? 'bg-white shadow-soft text-[#0F172A]' : 'text-[#475569]'}`}>Minggu Ini</button>
                                        <button role="tab" aria-selected={activePerfTab === "Bulan Ini"} onClick={() => handlePerfTabClick("Bulan Ini", 67)} className={`focus-ring px-3.5 py-1.5 rounded-full text-[12.5px] font-semibold transition-colors ${activePerfTab === 'Bulan Ini' ? 'bg-white shadow-soft text-[#0F172A]' : 'text-[#475569]'}`}>Bulan Ini</button>
                                    </div>
                                    <div className="flex-1 flex flex-col items-center justify-center">
                                        <div className="ring w-36 h-36 grid place-items-center" style={{ '--p': perfValue, '--ring-color': '#398eb3' }}>
                                            <div className="ring-inner w-[104px] h-[104px] grid place-items-center flex-col">
                                                <span className="font-display font-extrabold text-[#0F172A] text-[26px]">{perfValue}%</span>
                                                <span className="text-[11px] text-[#94A3B8] -mt-0.5">dari target</span>
                                            </div>
                                        </div>
                                        <p className="text-[12.5px] text-[#475569] text-center mt-4 max-w-[190px]">Target penyerapan simpanan anggota kuartal ini</p>
                                    </div>
                                </div>
                            </section>

                            {/* ANALYTICS ROW 2: bar chart + progress overview */}
                            <section className="reveal in grid lg:grid-cols-2 gap-5">
                                <div className="rounded-3xl bg-white border border-[#D8E4EA] p-6">
                                    <h3 className="font-display font-bold text-[#0F172A] text-[16px] mb-5">Penggunaan Modul</h3>
                                    <div className="flex items-end justify-between gap-3 h-[150px]">
                                        <div className="flex-1 flex flex-col items-center gap-2">
                                            <span className="text-[11px] font-semibold text-[#94A3B8]">92%</span>
                                            <div className="w-full rounded-t-lg bg-[#398eb3]" style={{ height: '92%' }}></div>
                                            <span className="text-[11px] text-[#94A3B8] font-medium">Kasir</span>
                                        </div>
                                        <div className="flex-1 flex flex-col items-center gap-2">
                                            <span className="text-[11px] font-semibold text-[#94A3B8]">78%</span>
                                            <div className="w-full rounded-t-lg bg-[#67B2D4]" style={{ height: '78%' }}></div>
                                            <span className="text-[11px] text-[#94A3B8] font-medium">Anggota</span>
                                        </div>
                                        <div className="flex-1 flex flex-col items-center gap-2">
                                            <span className="text-[11px] font-semibold text-[#94A3B8]">64%</span>
                                            <div className="w-full rounded-t-lg bg-[#4CC9B0]" style={{ height: '64%' }}></div>
                                            <span className="text-[11px] text-[#94A3B8] font-medium">Simpan Pinjam</span>
                                        </div>
                                        <div className="flex-1 flex flex-col items-center gap-2">
                                            <span className="text-[11px] font-semibold text-[#94A3B8]">51%</span>
                                            <div className="w-full rounded-t-lg bg-[#EAF6FB] border border-[#67B2D4]" style={{ height: '51%' }}></div>
                                            <span className="text-[11px] text-[#94A3B8] font-medium">Inventaris</span>
                                        </div>
                                        <div className="flex-1 flex flex-col items-center gap-2">
                                            <span className="text-[11px] font-semibold text-[#94A3B8]">37%</span>
                                            <div className="w-full rounded-t-lg bg-[#F1F5F9] border border-[#D8E4EA]" style={{ height: '37%' }}></div>
                                            <span className="text-[11px] text-[#94A3B8] font-medium">Laporan</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-3xl bg-white border border-[#D8E4EA] p-6">
                                    <h3 className="font-display font-bold text-[#0F172A] text-[16px] mb-5">Ikhtisar Progres</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <div className="flex justify-between text-[13px] mb-1.5"><span className="font-medium text-[#475569]">Migrasi Data Koperasi Baru</span><span className="font-semibold text-[#0F172A]">76%</span></div>
                                            <div className="h-2 rounded-full bg-[#F1F5F9] overflow-hidden"><div className="h-full rounded-full bg-[#398eb3]" style={{ width: '76%' }}></div></div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between text-[13px] mb-1.5"><span className="font-medium text-[#475569]">Pelatihan Pengurus Baru</span><span className="font-semibold text-[#0F172A]">54%</span></div>
                                            <div className="h-2 rounded-full bg-[#F1F5F9] overflow-hidden"><div className="h-full rounded-full bg-[#4CC9B0]" style={{ width: '54%' }}></div></div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between text-[13px] mb-1.5"><span className="font-medium text-[#475569]">Verifikasi Dokumen RAT</span><span className="font-semibold text-[#0F172A]">91%</span></div>
                                            <div className="h-2 rounded-full bg-[#F1F5F9] overflow-hidden"><div className="h-full rounded-full bg-[#22C55E]" style={{ width: '91%' }}></div></div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between text-[13px] mb-1.5"><span className="font-medium text-[#475569]">Audit Keuangan Triwulan</span><span className="font-semibold text-[#0F172A]">32%</span></div>
                                            <div className="h-2 rounded-full bg-[#F1F5F9] overflow-hidden"><div className="h-full rounded-full bg-[#F59E0B]" style={{ width: '32%' }}></div></div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* DATA TABLE */}
                            <section id="transaksi" aria-label="Transaksi terbaru" className="reveal in rounded-3xl bg-white border border-[#D8E4EA] overflow-hidden">
                                <div className="p-6 pb-4">
                                    <div className="flex flex-wrap items-center justify-between gap-3">
                                        <div>
                                            <h3 className="font-display font-bold text-[#0F172A] text-[16px]">Transaksi Terbaru</h3>
                                            <p className="text-[12.5px] text-[#94A3B8] mt-0.5">Aktivitas keuangan dari seluruh unit koperasi</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <label className="relative">
                                                <span className="sr-only">Cari transaksi</span>
                                                <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" strokeLinecap="round" /></svg>
                                                <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} type="search" placeholder="Cari…" className="focus-ring pl-9 pr-3 py-2 rounded-full bg-[#F1F5F9] border border-transparent focus:bg-white focus:border-[#67B2D4] text-[13px] w-40 sm:w-52 transition-colors" />
                                            </label>
                                            <button onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)} className="focus-ring inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-[#D8E4EA] text-[13px] font-semibold text-[#475569] hover:bg-[#F1F5F9] transition-colors" aria-expanded={isFilterPanelOpen}>
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 6h16M7 12h10M10 18h4" strokeLinecap="round" /></svg>
                                                Filter
                                                <svg style={{ transform: isFilterPanelOpen ? 'rotate(180deg)' : 'rotate(0)' }} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="transition-transform"><path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                            </button>
                                        </div>
                                    </div>

                                    <div className={`nested-panel ${isFilterPanelOpen ? 'nested-open' : ''}`}>
                                        <div className="flex flex-wrap gap-2 pt-4">
                                            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F1F5F9] text-[12.5px] font-medium text-[#475569] cursor-pointer"><input type="checkbox" className="accent-[#398eb3]" defaultChecked /> Berhasil</label>
                                            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F1F5F9] text-[12.5px] font-medium text-[#475569] cursor-pointer"><input type="checkbox" className="accent-[#398eb3]" defaultChecked /> Tertunda</label>
                                            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F1F5F9] text-[12.5px] font-medium text-[#475569] cursor-pointer"><input type="checkbox" className="accent-[#398eb3]" defaultChecked /> Gagal</label>
                                            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F1F5F9] text-[12.5px] font-medium text-[#475569] cursor-pointer">Jenis: Semua ▾</label>
                                        </div>
                                    </div>
                                </div>

                                <div className="overflow-x-auto">
                                    {filteredTransactions.length > 0 ? (
                                        <table className="w-full text-left">
                                            <thead>
                                                <tr className="border-y border-[#D8E4EA] bg-[#F1F5F9]/60">
                                                    <th scope="col" className="px-6 py-3 text-[11.5px] font-bold text-[#94A3B8] uppercase tracking-wide">Koperasi</th>
                                                    <th scope="col" className="px-6 py-3 text-[11.5px] font-bold text-[#94A3B8] uppercase tracking-wide">Jenis</th>
                                                    <th scope="col" className="px-6 py-3 text-[11.5px] font-bold text-[#94A3B8] uppercase tracking-wide">Jumlah</th>
                                                    <th scope="col" className="px-6 py-3 text-[11.5px] font-bold text-[#94A3B8] uppercase tracking-wide">Status</th>
                                                    <th scope="col" className="px-6 py-3 text-[11.5px] font-bold text-[#94A3B8] uppercase tracking-wide">Tanggal</th>
                                                    <th scope="col" className="px-6 py-3 text-[11.5px] font-bold text-[#94A3B8] uppercase tracking-wide text-right">Aksi</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-[#E8EEF2]">
                                                {filteredTransactions.map((tx, idx) => (
                                                    <tr key={idx} className="hover:bg-[#F1F5F9]/50">
                                                        <td className="px-6 py-3.5 text-[13.5px] font-semibold text-[#0F172A]">{tx.name}</td>
                                                        <td className="px-6 py-3.5 text-[13.5px] text-[#475569]">{tx.type}</td>
                                                        <td className="px-6 py-3.5 text-[13.5px] font-semibold text-[#0F172A]">{tx.amount}</td>
                                                        <td className="px-6 py-3.5">
                                                            <span className={`inline-flex items-center gap-1.5 text-[12px] font-semibold px-2.5 py-1 rounded-full ${tx.status === 'Berhasil' ? 'text-[#22C55E] bg-[#22C55E]/10' : tx.status === 'Tertunda' ? 'text-[#F59E0B] bg-[#F59E0B]/10' : 'text-[#EF4444] bg-[#EF4444]/10'}`}>
                                                                <span className={`w-1.5 h-1.5 rounded-full ${tx.status === 'Berhasil' ? 'bg-[#22C55E]' : tx.status === 'Tertunda' ? 'bg-[#F59E0B]' : 'bg-[#EF4444]'}`}></span>{tx.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-3.5 text-[13px] text-[#94A3B8]">{tx.date}</td>
                                                        <td className="px-6 py-3.5 text-right relative">
                                                            <button onClick={handleCtxMenuClick} className="focus-ring p-1.5 rounded-lg hover:bg-[#F1F5F9] text-[#94A3B8]" aria-label="Menu aksi"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="5" r="1.4" /><circle cx="12" cy="12" r="1.4" /><circle cx="12" cy="19" r="1.4" /></svg></button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                                            <span className="w-14 h-14 rounded-2xl bg-[#F1F5F9] grid place-items-center mb-4">
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="1.6"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" strokeLinecap="round" /></svg>
                                            </span>
                                            <p className="font-semibold text-[#0F172A] text-[14.5px]">Tidak ada transaksi ditemukan</p>
                                            <p className="text-[13px] text-[#94A3B8] mt-1 max-w-[280px]">Coba ubah kata kunci pencarian atau atur ulang filter Anda.</p>
                                        </div>
                                    )}
                                </div>

                                {filteredTransactions.length > 0 && (
                                    <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-t border-[#D8E4EA]">
                                        <p className="text-[12.5px] text-[#94A3B8]">Menampilkan 1–{filteredTransactions.length} dari 248 transaksi</p>
                                        <nav className="flex items-center gap-1" aria-label="Pagination">
                                            <button className="focus-ring w-8 h-8 rounded-lg text-[#94A3B8] hover:bg-[#F1F5F9]" aria-label="Sebelumnya">‹</button>
                                            <button className="focus-ring w-8 h-8 rounded-lg bg-[#398eb3] text-white font-semibold text-[13px]">1</button>
                                            <button className="focus-ring w-8 h-8 rounded-lg text-[#475569] hover:bg-[#F1F5F9] font-semibold text-[13px]">2</button>
                                            <button className="focus-ring w-8 h-8 rounded-lg text-[#475569] hover:bg-[#F1F5F9] font-semibold text-[13px]">3</button>
                                            <span className="px-1 text-[#94A3B8]">…</span>
                                            <button className="focus-ring w-8 h-8 rounded-lg text-[#475569] hover:bg-[#F1F5F9] font-semibold text-[13px]">50</button>
                                            <button className="focus-ring w-8 h-8 rounded-lg text-[#94A3B8] hover:bg-[#F1F5F9]" aria-label="Berikutnya">›</button>
                                        </nav>
                                    </div>
                                )}
                            </section>

                            {/* THREE COL: activity / tasks / team */}
                            <section className="reveal in grid lg:grid-cols-3 gap-5">
                                <div className="rounded-3xl bg-white border border-[#D8E4EA] p-6">
                                    <h3 className="font-display font-bold text-[#0F172A] text-[16px] mb-5">Aktivitas Terbaru</h3>
                                    <ol className="relative border-l border-[#D8E4EA] ml-2 space-y-6">
                                        <li className="pl-5 relative">
                                            <span className="absolute -left-[7px] top-0.5 w-3 h-3 rounded-full bg-[#22C55E] border-2 border-white ring-1 ring-[#22C55E]"></span>
                                            <p className="text-[13.5px] text-[#0F172A]"><span className="font-semibold">Koperasi Sejahtera Bersama</span> menyelesaikan tutup buku bulanan.</p>
                                            <p className="text-[12px] text-[#94A3B8] mt-0.5">12 menit lalu</p>
                                        </li>
                                        <li className="pl-5 relative">
                                            <span className="absolute -left-[7px] top-0.5 w-3 h-3 rounded-full bg-[#398eb3] border-2 border-white ring-1 ring-[#398eb3]"></span>
                                            <p className="text-[13.5px] text-[#0F172A]"><span className="font-semibold">Rina Wulandari</span> menyetujui 3 pengajuan pinjaman baru.</p>
                                            <p className="text-[12px] text-[#94A3B8] mt-0.5">48 menit lalu</p>
                                        </li>
                                        <li className="pl-5 relative">
                                            <span className="absolute -left-[7px] top-0.5 w-3 h-3 rounded-full bg-[#F59E0B] border-2 border-white ring-1 ring-[#F59E0B]"></span>
                                            <p className="text-[13.5px] text-[#0F172A]"><span className="font-semibold">Koperasi Tani Makmur</span> mengalami keterlambatan sinkronisasi.</p>
                                            <p className="text-[12px] text-[#94A3B8] mt-0.5">2 jam lalu</p>
                                        </li>
                                        <li className="pl-5 relative">
                                            <span className="absolute -left-[7px] top-0.5 w-3 h-3 rounded-full bg-[#4CC9B0] border-2 border-white ring-1 ring-[#4CC9B0]"></span>
                                            <p className="text-[13.5px] text-[#0F172A]"><span className="font-semibold">42 anggota baru</span> terdaftar minggu ini di seluruh unit.</p>
                                            <p className="text-[12px] text-[#94A3B8] mt-0.5">5 jam lalu</p>
                                        </li>
                                    </ol>
                                </div>

                                <div id="tugas-panel" className="rounded-3xl bg-white border border-[#D8E4EA] p-6">
                                    <div className="flex items-center justify-between mb-5">
                                        <h3 className="font-display font-bold text-[#0F172A] text-[16px]">Tugas Saya</h3>
                                        <button onClick={() => setIsTaskModalOpen(true)} data-tip="Tambah tugas" className="focus-ring w-7 h-7 rounded-lg grid place-items-center bg-[#EAF6FB] text-[#2F7698] hover:bg-[#398eb3] hover:text-white transition-colors"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M12 5v14M5 12h14" strokeLinecap="round" /></svg></button>
                                    </div>
                                    <ul className="space-y-3">
                                        <li className="flex items-start gap-3">
                                            <input type="checkbox" className="mt-1 w-4 h-4 rounded accent-[#398eb3] focus-ring" />
                                            <div className="flex-1">
                                                <p className="text-[13.5px] font-medium text-[#0F172A]">Tinjau pengajuan pinjaman Koperasi Tani Makmur</p>
                                                <span className="inline-block mt-1 text-[11px] font-semibold text-[#EF4444] bg-[#EF4444]/10 px-2 py-0.5 rounded-full">Hari ini</span>
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <input type="checkbox" className="mt-1 w-4 h-4 rounded accent-[#398eb3] focus-ring" />
                                            <div className="flex-1">
                                                <p className="text-[13.5px] font-medium text-[#0F172A]">Validasi laporan SHU triwulan 3 unit</p>
                                                <span className="inline-block mt-1 text-[11px] font-semibold text-[#F59E0B] bg-[#F59E0B]/10 px-2 py-0.5 rounded-full">Besok</span>
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <input type="checkbox" defaultChecked className="mt-1 w-4 h-4 rounded accent-[#398eb3] focus-ring" />
                                            <div className="flex-1">
                                                <p className="text-[13.5px] font-medium text-[#94A3B8] line-through">Perbarui data kontak pengurus koperasi</p>
                                                <span className="inline-block mt-1 text-[11px] font-semibold text-[#22C55E] bg-[#22C55E]/10 px-2 py-0.5 rounded-full">Selesai</span>
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <input type="checkbox" className="mt-1 w-4 h-4 rounded accent-[#398eb3] focus-ring" />
                                            <div className="flex-1">
                                                <p className="text-[13.5px] font-medium text-[#0F172A]">Jadwalkan pelatihan kasir baru</p>
                                                <span className="inline-block mt-1 text-[11px] font-semibold text-[#94A3B8] bg-[#F1F5F9] px-2 py-0.5 rounded-full">18 Jul</span>
                                            </div>
                                        </li>
                                    </ul>
                                </div>

                                <div id="tim-panel" className="rounded-3xl bg-white border border-[#D8E4EA] p-6">
                                    <div className="flex items-center justify-between mb-5">
                                        <h3 className="font-display font-bold text-[#0F172A] text-[16px]">Anggota Tim</h3>
                                        <div className="flex -space-x-2.5">
                                            <span className="w-7 h-7 rounded-full bg-[#67B2D4] border-2 border-white"></span>
                                            <span className="w-7 h-7 rounded-full bg-[#4CC9B0] border-2 border-white"></span>
                                            <span className="w-7 h-7 rounded-full bg-[#2F7698] border-2 border-white"></span>
                                            <span className="w-7 h-7 rounded-full bg-[#0F172A] border-2 border-white grid place-items-center text-[9px] text-white font-bold">+6</span>
                                        </div>
                                    </div>
                                    <ul className="space-y-4">
                                        <li className="flex items-center gap-3">
                                            <span className="relative shrink-0">
                                                <span className="w-9 h-9 rounded-full bg-gradient-to-br from-[#398eb3] to-[#2F7698] grid place-items-center text-white font-display font-bold text-[12px]">RW</span>
                                                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#22C55E] border-2 border-white"></span>
                                            </span>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[13.5px] font-semibold text-[#0F172A] truncate">Rina Wulandari</p>
                                                <p className="text-[12px] text-[#94A3B8]">Ketua Koperasi</p>
                                            </div>
                                            <span className="text-[10.5px] font-semibold text-[#22C55E] bg-[#22C55E]/10 px-2 py-0.5 rounded-full">Online</span>
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <span className="relative shrink-0">
                                                <span className="w-9 h-9 rounded-full bg-gradient-to-br from-[#4CC9B0] to-[#398eb3] grid place-items-center text-white font-display font-bold text-[12px]">BS</span>
                                                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#94A3B8] border-2 border-white"></span>
                                            </span>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[13.5px] font-semibold text-[#0F172A] truncate">Bambang Sutrisno</p>
                                                <p className="text-[12px] text-[#94A3B8]">Bendahara</p>
                                            </div>
                                            <span className="text-[10.5px] font-semibold text-[#94A3B8] bg-[#F1F5F9] px-2 py-0.5 rounded-full">Offline</span>
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <span className="relative shrink-0">
                                                <span className="w-9 h-9 rounded-full bg-gradient-to-br from-[#67B2D4] to-[#398eb3] grid place-items-center text-white font-display font-bold text-[12px]">MA</span>
                                                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#22C55E] border-2 border-white"></span>
                                            </span>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[13.5px] font-semibold text-[#0F172A] truncate">Made Ayu Kartika</p>
                                                <p className="text-[12px] text-[#94A3B8]">Auditor Internal</p>
                                            </div>
                                            <span className="text-[10.5px] font-semibold text-[#22C55E] bg-[#22C55E]/10 px-2 py-0.5 rounded-full">Online</span>
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <span className="relative shrink-0">
                                                <span className="w-9 h-9 rounded-full bg-gradient-to-br from-[#F59E0B] to-[#2F7698] grid place-items-center text-white font-display font-bold text-[12px]">HP</span>
                                                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#F59E0B] border-2 border-white"></span>
                                            </span>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[13.5px] font-semibold text-[#0F172A] truncate">Hendra Pratama</p>
                                                <p className="text-[12px] text-[#94A3B8]">Petugas Gudang</p>
                                            </div>
                                            <span className="text-[10.5px] font-semibold text-[#F59E0B] bg-[#F59E0B]/10 px-2 py-0.5 rounded-full">Sibuk</span>
                                        </li>
                                    </ul>
                                </div>
                            </section>

                            {/* FILES + CALENDAR + NOTIFICATION CENTER */}
                            <section className="reveal in grid lg:grid-cols-3 gap-5">
                                <div id="dokumen-panel" className="lg:col-span-1 rounded-3xl bg-white border border-[#D8E4EA] p-6">
                                    <h3 className="font-display font-bold text-[#0F172A] text-[16px] mb-5">Dokumen Terbaru</h3>
                                    <ul className="space-y-3">
                                        <li className="flex items-center gap-3">
                                            <span className="w-10 h-10 rounded-xl bg-[#EAF6FB] grid place-items-center shrink-0"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#398eb3" strokeWidth="1.8"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><path d="M14 2v6h6" strokeLinejoin="round" /></svg></span>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[13.5px] font-semibold text-[#0F172A] truncate">Laporan RAT 2025.pdf</p>
                                                <p className="text-[11.5px] text-[#94A3B8]">2.4 MB · 2 hari lalu</p>
                                            </div>
                                            <button data-tip="Unduh" className="focus-ring p-1.5 rounded-lg hover:bg-[#F1F5F9] text-[#94A3B8] shrink-0"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 3v12M7 10l5 5 5-5M5 21h14" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <span className="w-10 h-10 rounded-xl bg-[#4CC9B0]/15 grid place-items-center shrink-0"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2F7698" strokeWidth="1.8"><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 9h18M9 4v16" strokeLinecap="round" /></svg></span>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[13.5px] font-semibold text-[#0F172A] truncate">Neraca Q2 2026.xlsx</p>
                                                <p className="text-[11.5px] text-[#94A3B8]">860 KB · 4 hari lalu</p>
                                            </div>
                                            <button data-tip="Unduh" className="focus-ring p-1.5 rounded-lg hover:bg-[#F1F5F9] text-[#94A3B8] shrink-0"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 3v12M7 10l5 5 5-5M5 21h14" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <span className="w-10 h-10 rounded-xl bg-[#F59E0B]/15 grid place-items-center shrink-0"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="1.8"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><path d="M14 2v6h6" strokeLinejoin="round" /></svg></span>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[13.5px] font-semibold text-[#0F172A] truncate">Kebijakan Simpan Pinjam.docx</p>
                                                <p className="text-[11.5px] text-[#94A3B8]">410 KB · 1 minggu lalu</p>
                                            </div>
                                            <button data-tip="Unduh" className="focus-ring p-1.5 rounded-lg hover:bg-[#F1F5F9] text-[#94A3B8] shrink-0"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 3v12M7 10l5 5 5-5M5 21h14" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
                                        </li>
                                    </ul>
                                </div>

                                <div className="lg:col-span-1 rounded-3xl bg-white border border-[#D8E4EA] p-6">
                                    <div className="flex items-center justify-between mb-5">
                                        <h3 className="font-display font-bold text-[#0F172A] text-[16px]">Kalender</h3>
                                        <div className="flex items-center gap-1">
                                            <button className="focus-ring w-7 h-7 rounded-lg hover:bg-[#F1F5F9] text-[#94A3B8] grid place-items-center" aria-label="Bulan sebelumnya">‹</button>
                                            <span className="text-[12.5px] font-semibold text-[#0F172A] px-1">Jul 2026</span>
                                            <button className="focus-ring w-7 h-7 rounded-lg hover:bg-[#F1F5F9] text-[#94A3B8] grid place-items-center" aria-label="Bulan berikutnya">›</button>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-7 gap-1 text-center text-[11px] text-[#94A3B8] font-medium mb-1.5">
                                        <span>M</span><span>S</span><span>S</span><span>R</span><span>K</span><span>J</span><span>S</span>
                                    </div>
                                    <div className="grid grid-cols-7 gap-1 text-center text-[12px]">
                                        <span className="py-2 rounded-lg text-[#94A3B8]/60">28</span><span className="py-2 rounded-lg text-[#94A3B8]/60">29</span><span className="py-2 rounded-lg text-[#94A3B8]/60">30</span><span className="py-2 rounded-lg">1</span><span className="py-2 rounded-lg">2</span><span className="py-2 rounded-lg">3</span><span className="py-2 rounded-lg">4</span>
                                        <span className="py-2 rounded-lg">5</span><span className="py-2 rounded-lg">6</span><span className="py-2 rounded-lg relative">7<span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#4CC9B0]"></span></span><span className="py-2 rounded-lg">8</span><span className="py-2 rounded-lg">9</span><span className="py-2 rounded-lg">10</span><span className="py-2 rounded-lg">11</span>
                                        <span className="py-2 rounded-lg">12</span><span className="py-2 rounded-lg">13</span><span className="py-2 rounded-lg font-bold bg-[#398eb3] text-white">14</span><span className="py-2 rounded-lg relative">15<span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#398eb3]"></span></span><span className="py-2 rounded-lg">16</span><span className="py-2 rounded-lg">17</span><span className="py-2 rounded-lg">18</span>
                                        <span className="py-2 rounded-lg">19</span><span className="py-2 rounded-lg">20</span><span className="py-2 rounded-lg">21</span><span className="py-2 rounded-lg">22</span><span className="py-2 rounded-lg">23</span><span className="py-2 rounded-lg">24</span><span className="py-2 rounded-lg">25</span>
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-[#E8EEF2] space-y-2.5">
                                        <div className="flex items-center gap-2.5">
                                            <span className="w-1.5 h-8 rounded-full bg-[#398eb3]"></span>
                                            <div><p className="text-[12.5px] font-semibold text-[#0F172A]">Rapat Anggota Tahunan</p><p className="text-[11px] text-[#94A3B8]">Hari ini, 14:00 WIB</p></div>
                                        </div>
                                        <div className="flex items-center gap-2.5">
                                            <span className="w-1.5 h-8 rounded-full bg-[#4CC9B0]"></span>
                                            <div><p className="text-[12.5px] font-semibold text-[#0F172A]">Audit Triwulan</p><p className="text-[11px] text-[#94A3B8]">15 Jul, 09:00 WIB</p></div>
                                        </div>
                                    </div>
                                </div>

                                <div className="lg:col-span-1 rounded-3xl bg-white border border-[#D8E4EA] p-6">
                                    <h3 className="font-display font-bold text-[#0F172A] text-[16px] mb-5">Pusat Notifikasi Sistem</h3>
                                    <ul className="space-y-3.5">
                                        <li className="flex gap-3">
                                            <span className="w-8 h-8 shrink-0 rounded-full bg-[#EF4444]/10 grid place-items-center"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2"><path d="M12 9v4M12 17h.01M10.3 3.9L2 20h20L13.7 3.9a2 2 0 00-3.4 0z" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
                                            <div>
                                                <p className="text-[13px] text-[#0F172A]"><span className="font-semibold">Sinkronisasi gagal</span> di Koperasi Tani Makmur</p>
                                                <p className="text-[11.5px] text-[#94A3B8] mt-0.5">10 menit lalu</p>
                                            </div>
                                        </li>
                                        <li className="flex gap-3">
                                            <span className="w-8 h-8 shrink-0 rounded-full bg-[#F59E0B]/10 grid place-items-center"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
                                            <div>
                                                <p className="text-[13px] text-[#0F172A]"><span className="font-semibold">Stok menipis</span> — 3 produk perlu direstock</p>
                                                <p className="text-[11.5px] text-[#94A3B8] mt-0.5">1 jam lalu</p>
                                            </div>
                                        </li>
                                        <li className="flex gap-3">
                                            <span className="w-8 h-8 shrink-0 rounded-full bg-[#22C55E]/10 grid place-items-center"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
                                            <div>
                                                <p className="text-[13px] text-[#0F172A]"><span className="font-semibold">Pembaruan sistem</span> versi 4.2 berhasil diterapkan</p>
                                                <p className="text-[11.5px] text-[#94A3B8] mt-0.5">3 jam lalu</p>
                                            </div>
                                        </li>
                                        <li className="flex gap-3">
                                            <span className="w-8 h-8 shrink-0 rounded-full bg-[#EAF6FB] grid place-items-center"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#398eb3" strokeWidth="2"><path d="M17 20v-1a4 4 0 00-4-4H7a4 4 0 00-4 4v1M10 11a4 4 0 100-8 4 4 0 000 8z" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
                                            <div>
                                                <p className="text-[13px] text-[#0F172A]"><span className="font-semibold">2 koperasi baru</span> menyelesaikan pendaftaran</p>
                                                <p className="text-[11.5px] text-[#94A3B8] mt-0.5">Kemarin</p>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </section>

                            {/* ANGGOTA PANEL ANCHOR (referenced by sidebar) */}
                            <section id="anggota-panel" className="reveal in rounded-3xl bg-gradient-to-br from-[#EAF6FB] to-white border border-[#D8E4EA] p-6 sm:p-7">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                    <div>
                                        <h3 className="font-display font-bold text-[#0F172A] text-[17px]">Distribusi Anggota per Provinsi</h3>
                                        <p className="text-[13px] text-[#475569] mt-1">Ringkasan jangkauan koperasi yang terhubung dengan SIKOPET</p>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-[12px] font-semibold text-[#2F7698] bg-white px-3 py-1.5 rounded-full border border-[#67B2D4]/40">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]"></span> Data langsung
                                    </div>
                                </div>
                                <div className="grid sm:grid-cols-3 gap-4 mt-6">
                                    <div className="rounded-2xl bg-white/70 border border-white p-4">
                                        <p className="text-[12px] text-[#94A3B8] font-medium">Jawa Tengah</p>
                                        <p className="font-display font-bold text-[#0F172A] text-[19px] mt-1">612 anggota</p>
                                        <div className="h-1.5 rounded-full bg-[#F1F5F9] mt-2 overflow-hidden"><div className="h-full bg-[#398eb3] rounded-full" style={{ width: '88%' }}></div></div>
                                    </div>
                                    <div className="rounded-2xl bg-white/70 border border-white p-4">
                                        <p className="text-[12px] text-[#94A3B8] font-medium">Sulawesi Selatan</p>
                                        <p className="font-display font-bold text-[#0F172A] text-[19px] mt-1">438 anggota</p>
                                        <div className="h-1.5 rounded-full bg-[#F1F5F9] mt-2 overflow-hidden"><div className="h-full bg-[#4CC9B0] rounded-full" style={{ width: '63%' }}></div></div>
                                    </div>
                                    <div className="rounded-2xl bg-white/70 border border-white p-4">
                                        <p className="text-[12px] text-[#94A3B8] font-medium">Bali</p>
                                        <p className="font-display font-bold text-[#0F172A] text-[19px] mt-1">305 anggota</p>
                                        <div className="h-1.5 rounded-full bg-[#F1F5F9] mt-2 overflow-hidden"><div className="h-full bg-[#67B2D4] rounded-full" style={{ width: '44%' }}></div></div>
                                    </div>
                                </div>
                            </section>

                        </main>

                        {/* ============ RIGHT UTILITY PANEL ============ */}
                        <aside className="hidden xl:flex flex-col w-[300px] shrink-0 border-l border-[#D8E4EA] px-5 py-7 space-y-6 sticky top-[72px] h-[calc(100vh-72px)] overflow-y-auto">

                            <div className="rounded-3xl bg-white border border-[#D8E4EA] p-5">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="font-display font-bold text-[#0F172A] text-[14.5px]">Peta Sinkronisasi</h3>
                                    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#22C55E] bg-[#22C55E]/10 px-2 py-0.5 rounded-full"><span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]"></span>Aktif</span>
                                </div>
                                <svg viewBox="0 0 240 150" className="w-full h-auto" role="img" aria-label="Peta status sinkronisasi provinsi">
                                    <g opacity="0.15" fill="#398eb3">
                                        <ellipse cx="35" cy="80" rx="24" ry="9" />
                                        <ellipse cx="85" cy="92" rx="34" ry="11" />
                                        <ellipse cx="140" cy="75" rx="19" ry="8" />
                                        <ellipse cx="170" cy="98" rx="38" ry="13" />
                                        <ellipse cx="215" cy="85" rx="22" ry="9" />
                                    </g>
                                    <g stroke="#67B2D4" strokeWidth="1.2" fill="none" opacity="0.7">
                                        <path d="M40 74 C 60 55, 80 55, 95 70" strokeDasharray="4 4" />
                                        <path d="M95 70 C 115 60, 130 60, 150 73" strokeDasharray="4 4" />
                                        <path d="M150 73 C 175 60, 195 60, 213 78" strokeDasharray="4 4" />
                                    </g>
                                    <circle cx="40" cy="74" r="4" fill="#398eb3" />
                                    <circle cx="95" cy="70" r="5" fill="#2F7698" />
                                    <circle cx="150" cy="73" r="4" fill="#398eb3" />
                                    <circle cx="213" cy="78" r="6" fill="#4CC9B0" />
                                </svg>
                                <div className="grid grid-cols-2 gap-2.5 mt-3">
                                    <div className="rounded-xl bg-[#F1F5F9] px-3 py-2">
                                        <p className="text-[10.5px] text-[#94A3B8]">Provinsi Aktif</p>
                                        <p className="text-[14px] font-bold text-[#0F172A]">34</p>
                                    </div>
                                    <div className="rounded-xl bg-[#F1F5F9] px-3 py-2">
                                        <p className="text-[10.5px] text-[#94A3B8]">Sedang Sync</p>
                                        <p className="text-[14px] font-bold text-[#0F172A]">6</p>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-3xl bg-white border border-[#D8E4EA] p-5">
                                <h3 className="font-display font-bold text-[#0F172A] text-[14.5px] mb-4">Penyimpanan</h3>
                                <div className="flex items-center gap-4">
                                    <div className="ring w-16 h-16 shrink-0 grid place-items-center" style={{ '--p': 64, '--ring-color': '#4CC9B0' }}>
                                        <div className="ring-inner w-11 h-11 grid place-items-center">
                                            <span className="text-[12px] font-bold text-[#0F172A]">64%</span>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-[13px] font-semibold text-[#0F172A]">32 GB / 50 GB</p>
                                        <p className="text-[11.5px] text-[#94A3B8] mt-0.5">Dokumen & lampiran</p>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-3xl bg-white border border-[#D8E4EA] p-5">
                                <h3 className="font-display font-bold text-[#0F172A] text-[14.5px] mb-4">Bantuan Cepat</h3>
                                <div className="space-y-2" id="help-accordion">
                                    <div className={`acc-item border border-[#D8E4EA] rounded-xl overflow-hidden ${openHelpAccordion === 'sync' ? 'nested-open' : ''}`}>
                                        <button onClick={() => toggleHelpAccordion('sync')} className="acc-trigger w-full flex items-center justify-between px-3.5 py-2.5 text-left focus-ring" aria-expanded={openHelpAccordion === 'sync'}>
                                            <span className="text-[12.5px] font-semibold text-[#0F172A]">Cara sinkron manual?</span>
                                            <svg className="chev-nested w-3.5 h-3.5 text-[#94A3B8] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                        </button>
                                        <div className="nested-panel px-3.5">
                                            <p className="text-[12px] text-[#475569] pb-3">Tekan ikon sinkron di pojok kanan bawah aplikasi kasir untuk memaksa sinkronisasi segera.</p>
                                        </div>
                                    </div>
                                    <div className={`acc-item border border-[#D8E4EA] rounded-xl overflow-hidden ${openHelpAccordion === 'reset' ? 'nested-open' : ''}`}>
                                        <button onClick={() => toggleHelpAccordion('reset')} className="acc-trigger w-full flex items-center justify-between px-3.5 py-2.5 text-left focus-ring" aria-expanded={openHelpAccordion === 'reset'}>
                                            <span className="text-[12.5px] font-semibold text-[#0F172A]">Reset kata sandi anggota tim</span>
                                            <svg className="chev-nested w-3.5 h-3.5 text-[#94A3B8] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                        </button>
                                        <div className="nested-panel px-3.5">
                                            <p className="text-[12px] text-[#475569] pb-3">Buka Pengaturan Akun → Anggota Tim, lalu pilih "Kirim tautan reset" pada pengguna terkait.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </div>

            {/* ============ FAB ============ */}
            <div className="fixed bottom-6 right-6 z-40" ref={fabMenuRef}>
                {isFabMenuOpen && (
                    <div id="fab-menu" className="pop-enter absolute bottom-[calc(100%+12px)] right-0 w-56 bg-white rounded-2xl border border-[#D8E4EA] shadow-lift p-2">
                        <button className="focus-ring w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-[13.5px] font-medium text-[#475569] hover:bg-[#F1F5F9] transition-colors"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="7" width="18" height="13" rx="2" /></svg>Transaksi Baru</button>
                        <button onClick={() => { setIsTaskModalOpen(true); setIsFabMenuOpen(false); }} className="focus-ring w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-[13.5px] font-medium text-[#475569] hover:bg-[#F1F5F9] transition-colors"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="4" y="4" width="16" height="16" rx="3" /><path d="M8 12l2.5 2.5L16 9" strokeLinecap="round" /></svg>Tugas Baru</button>
                        <button className="focus-ring w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-[13.5px] font-medium text-[#475569] hover:bg-[#F1F5F9] transition-colors"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17 20v-1a4 4 0 00-4-4H7a4 4 0 00-4 4v1M10 11a4 4 0 100-8 4 4 0 000 8z" strokeLinecap="round" strokeLinejoin="round" /></svg>Anggota Baru</button>
                    </div>
                )}
                <button id="fab-btn" onClick={() => setIsFabMenuOpen(!isFabMenuOpen)} className="focus-ring w-14 h-14 rounded-full bg-gradient-to-br from-[#398eb3] to-[#2F7698] text-white shadow-glow grid place-items-center hover:scale-105 transition-transform duration-300" aria-label="Aksi cepat" aria-haspopup="true">
                    <svg id="fab-icon" style={{ transform: isFabMenuOpen ? 'rotate(45deg)' : 'rotate(0)' }} width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="transition-transform duration-300"><path d="M12 5v14M5 12h14" strokeLinecap="round" /></svg>
                </button>
            </div>

            {/* ============ NOTIFICATION DRAWER ============ */}
            <div onClick={() => setIsNotifOpen(false)} className={`overlay fixed inset-0 bg-[#0F172A]/30 z-50 ${isNotifOpen ? 'opacity-100 block' : 'opacity-0 hidden'}`}></div>
            <div className={`drawer-panel fixed top-0 right-0 h-full w-full max-w-[380px] bg-white z-[60] flex flex-col shadow-lift ${isNotifOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex items-center justify-between px-6 h-[72px] border-b border-[#D8E4EA] shrink-0">
                    <h3 className="font-display font-bold text-[#0F172A] text-[16px]">Notifikasi</h3>
                    <button onClick={() => setIsNotifOpen(false)} className="focus-ring p-1.5 rounded-lg hover:bg-[#F1F5F9]" aria-label="Tutup notifikasi"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" /></svg></button>
                </div>
                <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
                    <div className="flex gap-3 p-3 rounded-2xl bg-[#EAF6FB]/60">
                        <span className="w-9 h-9 shrink-0 rounded-full bg-[#398eb3] grid place-items-center"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M17 20v-1a4 4 0 00-4-4H7a4 4 0 00-4 4v1M10 11a4 4 0 100-8 4 4 0 000 8z" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
                        <div><p className="text-[13px] text-[#0F172A]"><span className="font-semibold">Anggota baru</span> mendaftar di Koperasi Sejahtera Bersama</p><p className="text-[11.5px] text-[#94A3B8] mt-1">5 menit lalu</p></div>
                    </div>
                    <div className="flex gap-3 p-3 rounded-2xl hover:bg-[#F1F5F9] transition-colors">
                        <span className="w-9 h-9 shrink-0 rounded-full bg-[#EF4444]/10 grid place-items-center"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2"><path d="M12 9v4M12 17h.01" strokeLinecap="round" /></svg></span>
                        <div><p className="text-[13px] text-[#0F172A]"><span className="font-semibold">Sinkronisasi gagal</span> di Koperasi Tani Makmur</p><p className="text-[11.5px] text-[#94A3B8] mt-1">10 menit lalu</p></div>
                    </div>
                    <div className="flex gap-3 p-3 rounded-2xl hover:bg-[#F1F5F9] transition-colors">
                        <span className="w-9 h-9 shrink-0 rounded-full bg-[#F59E0B]/10 grid place-items-center"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2"><path d="M12 9v4M12 17h.01" strokeLinecap="round" /></svg></span>
                        <div><p className="text-[13px] text-[#0F172A]"><span className="font-semibold">Stok menipis</span> di unit usaha Koperasi Nusa Bakti</p><p className="text-[11.5px] text-[#94A3B8] mt-1">1 jam lalu</p></div>
                    </div>
                    <div className="flex gap-3 p-3 rounded-2xl hover:bg-[#F1F5F9] transition-colors">
                        <span className="w-9 h-9 shrink-0 rounded-full bg-[#22C55E]/10 grid place-items-center"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
                        <div><p className="text-[13px] text-[#0F172A]"><span className="font-semibold">Persetujuan pinjaman</span> selesai diproses</p><p className="text-[11.5px] text-[#94A3B8] mt-1">3 jam lalu</p></div>
                    </div>
                    <div className="flex gap-3 p-3 rounded-2xl hover:bg-[#F1F5F9] transition-colors">
                        <span className="w-9 h-9 shrink-0 rounded-full bg-[#EAF6FB] grid place-items-center"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#398eb3" strokeWidth="2"><rect x="4" y="4" width="16" height="16" rx="3" /></svg></span>
                        <div><p className="text-[13px] text-[#0F172A]"><span className="font-semibold">Laporan RAT</span> siap diunduh</p><p className="text-[11.5px] text-[#94A3B8] mt-1">Kemarin</p></div>
                    </div>
                </div>
            </div>

            {/* ============ CONTEXT MENU (row actions) ============ */}
            {ctxMenu.isOpen && (
                <div ref={ctxMenuRef} style={{ top: ctxMenu.y, left: ctxMenu.x }} className="pop-enter fixed w-44 bg-white rounded-xl border border-[#D8E4EA] shadow-lift p-1.5 z-[70]">
                    <button className="focus-ring w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] text-[#475569] hover:bg-[#F1F5F9] transition-colors"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" /><circle cx="12" cy="12" r="3" /></svg>Lihat Detail</button>
                    <button className="focus-ring w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] text-[#475569] hover:bg-[#F1F5F9] transition-colors"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.1 2.1 0 013 3L12 15l-4 1 1-4z" /></svg>Edit</button>
                    <div className="h-px bg-[#E8EEF2] my-1"></div>
                    <button className="focus-ring w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z" strokeLinecap="round" strokeLinejoin="round" /></svg>Hapus</button>
                </div>
            )}

            {/* ============ TASK MODAL ============ */}
            <div onClick={() => setIsTaskModalOpen(false)} className={`overlay fixed inset-0 bg-[#0F172A]/40 z-[80] ${isTaskModalOpen ? 'opacity-100 block' : 'opacity-0 hidden'}`}></div>
            <div className={`sheet-modal fixed inset-0 z-[90] grid place-items-center px-4 ${isTaskModalOpen ? 'opacity-100 block' : 'opacity-0 hidden pointer-events-none'}`} role="dialog" aria-modal="true" aria-labelledby="task-modal-title">
                <div className={`w-full max-w-[440px] bg-white rounded-3xl shadow-lift p-6 sm:p-7 transition-transform ${isTaskModalOpen ? 'scale-100' : 'scale-95'}`}>
                    <div className="flex items-center justify-between mb-5">
                        <h3 id="task-modal-title" className="font-display font-bold text-[#0F172A] text-[18px]">Tugas Baru</h3>
                        <button onClick={() => setIsTaskModalOpen(false)} className="focus-ring p-1.5 rounded-lg hover:bg-[#F1F5F9] text-[#94A3B8]" aria-label="Tutup"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" /></svg></button>
                    </div>
                    <form onSubmit={(e) => { e.preventDefault(); setIsTaskModalOpen(false); }} className="space-y-4">
                        <div>
                            <label htmlFor="task-title" className="block text-[12.5px] font-semibold text-[#475569] mb-1.5">Judul Tugas</label>
                            <input id="task-title" type="text" required placeholder="cth. Tinjau laporan keuangan Q3" className="focus-ring w-full px-3.5 py-2.5 rounded-xl border border-[#D8E4EA] text-[13.5px] focus:border-[#67B2D4] transition-colors" />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label htmlFor="task-due" className="block text-[12.5px] font-semibold text-[#475569] mb-1.5">Tenggat</label>
                                <input id="task-due" type="date" className="focus-ring w-full px-3.5 py-2.5 rounded-xl border border-[#D8E4EA] text-[13.5px] focus:border-[#67B2D4] transition-colors" />
                            </div>
                            <div>
                                <label htmlFor="task-assignee" className="block text-[12.5px] font-semibold text-[#475569] mb-1.5">Ditugaskan ke</label>
                                <select id="task-assignee" className="focus-ring w-full px-3.5 py-2.5 rounded-xl border border-[#D8E4EA] text-[13.5px] focus:border-[#67B2D4] transition-colors">
                                    <option>Andi Saputra</option>
                                    <option>Rina Wulandari</option>
                                    <option>Bambang Sutrisno</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex gap-3 pt-2">
                            <button type="button" onClick={() => setIsTaskModalOpen(false)} className="focus-ring flex-1 py-2.5 rounded-full border border-[#D8E4EA] font-semibold text-[13.5px] text-[#475569] hover:bg-[#F1F5F9] transition-colors">Batal</button>
                            <button type="submit" className="focus-ring flex-1 py-2.5 rounded-full bg-[#398eb3] text-white font-semibold text-[13.5px] hover:bg-[#2F7698] transition-colors">Simpan Tugas</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}