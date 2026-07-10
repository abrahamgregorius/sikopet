/**
 * @typedef {Object} ModuleDefinition
 * @property {string} key - Unique identifier
 * @property {string} name - Display name
 * @property {string} description - Short description
 * @property {string} icon - Icon key for sidebar
 * @property {string} route - Route path
 * @property {'utama'|'operasional'|'tim'|'lainnya'} category - Navigation group
 * @property {number} order - Display order within category
 * @property {string[]} [dependencies] - Required module keys
 * @property {boolean} [comingSoon] - Not yet available
 * @property {string[]} [permissions] - Required roles
 */

export const MODULE_CATEGORIES = {
    UTAMA: "utama",
    OPERASIONAL: "operasional",
    TIM: "tim",
    LAINNYA: "lainnya",
};

export const SIDEBAR_ICONS = {
    dashboard: (
        <>
            <rect x="3" y="3" width="7" height="9" rx="2" />
            <rect x="14" y="3" width="7" height="5" rx="2" />
            <rect x="14" y="12" width="7" height="9" rx="2" />
            <rect x="3" y="16" width="7" height="5" rx="2" />
        </>
    ),
    chart: (
        <>
            <path
                d="M3 3v18h18M7 15l4-6 3 4 4-7"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </>
    ),
    users: (
        <>
            <path
                d="M17 20v-1a4 4 0 00-4-4H7a4 4 0 00-4 4v1M10 11a4 4 0 100-8 4 4 0 000 8z"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </>
    ),
    dollar: (
        <>
            <path
                d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </>
    ),
    briefcase: (
        <>
            <rect x="3" y="7" width="18" height="13" rx="2" />
            <path
                d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2"
                strokeLinecap="round"
            />
        </>
    ),
    circle: (
        <>
            <circle cx="12" cy="12" r="9" />
            <path d="M9 12h6M12 9v6" strokeLinecap="round" />
        </>
    ),
    layers: (
        <>
            <path
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </>
    ),
    people: (
        <>
            <circle cx="9" cy="8" r="3" />
            <path
                d="M2 20a7 7 0 0114 0M16 6a3 3 0 010 6M22 20a7 7 0 00-6-6.9"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </>
    ),
    check: (
        <>
            <rect x="4" y="4" width="16" height="16" rx="3" />
            <path
                d="M8 12l2.5 2.5L16 9"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </>
    ),
    gear: (
        <>
            <circle cx="12" cy="12" r="3" />
            <path
                d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06A1.65 1.65 0 004.6 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06A1.65 1.65 0 009 4.6a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </>
    ),
    package: (
        <>
            <path
                d="M16.5 9.4l-9-5.19M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </>
    ),
    warehouse: (
        <>
            <path
                d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M9 22V12h6v10"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </>
    ),
    shoppingCart: (
        <>
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path
                d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </>
    ),
    wallet: (
        <>
            <path
                d="M21 12V7H5a2 2 0 010-4h14v4M3 5v14a2 2 0 002 2h16v-5M18 12a1 1 0 100 2 1 1 0 000-2z"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </>
    ),
    fileText: (
        <>
            <path
                d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8L14 2z"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M14 2v6h6M16 13H8M16 17H8M10 9H8"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </>
    ),
    activity: (
        <>
            <path
                d="M22 12h-4l-3 9L9 3l-3 9H2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </>
    ),
    creditCard: (
        <>
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
            <path d="M1 10h22" strokeLinecap="round" />
        </>
    ),
    trendingUp: (
        <>
            <path
                d="M23 6l-9.5 9.5-5-5L1 18"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path d="M17 6h6v6" strokeLinecap="round" strokeLinejoin="round" />
        </>
    ),
    shoppingBag: (
        <>
            <path
                d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M3 6h18M16 10a4 4 0 01-8 0"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </>
    ),
    truck: (
        <>
            <path
                d="M1 3h15v13H1zM16 8h4l3 3v5h-7V8z"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <circle cx="5.5" cy="18.5" r="2.5" />
            <circle cx="18.5" cy="18.5" r="2.5" />
        </>
    ),
    userCheck: (
        <>
            <path
                d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <circle cx="9" cy="7" r="4" />
            <path
                d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </>
    ),
    calendar: (
        <>
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <path
                d="M16 2v4M8 2v4M3 10h18"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </>
    ),
    book: (
        <>
            <path
                d="M4 19.5A2.5 2.5 0 016.5 17H20"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </>
    ),
    bell: (
        <>
            <path
                d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </>
    ),
    userPlus: (
        <>
            <path
                d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <circle cx="9" cy="7" r="4" />
            <path
                d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </>
    ),
    settings: (
        <>
            <circle cx="12" cy="12" r="3" />
            <path
                d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06A1.65 1.65 0 004.6 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06A1.65 1.65 0 009 4.6a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </>
    ),
    layout: (
        <>
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <path
                d="M3 9h18M9 21V9"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </>
    ),
    menu: (
        <>
            <path
                d="M3 12h18M3 6h18M3 18h18"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </>
    ),
    plus: (
        <>
            <circle cx="12" cy="12" r="9" />
            <path d="M12 8v8M8 12h8" strokeLinecap="round" />
        </>
    ),
    shield: (
        <>
            <path
                d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </>
    ),
    database: (
        <>
            <ellipse cx="12" cy="5" rx="9" ry="3" />
            <path
                d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </>
    ),
    barChart: (
        <>
            <path
                d="M12 20V10M18 20V4M6 20v-4"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </>
    ),
};

/**
 * @type {ModuleDefinition[]}
 */
export const MODULE_REGISTRY = [
    {
        key: "dashboard",
        name: "Dasbor",
        description: "Ringkasan statistik dan aktivitas utama",
        icon: "dashboard",
        route: "/dashboard",
        category: MODULE_CATEGORIES.UTAMA,
        order: 1,
    },
    {
        key: "analytics",
        name: "Analitik",
        description: "Grafik dan tren performa",
        icon: "chart",
        route: "/dashboard/analitik",
        category: MODULE_CATEGORIES.UTAMA,
        order: 2,
    },
    {
        key: "members",
        name: "Keanggotaan",
        description: "Kelola data anggota合作社",
        icon: "users",
        route: "/dashboard/keanggotaan",
        category: MODULE_CATEGORIES.OPERASIONAL,
        order: 1,
    },
    {
        key: "savings",
        name: "Simpanan",
        description: "Kelola simpanan anggota",
        icon: "wallet",
        route: "/dashboard/simpanan",
        category: MODULE_CATEGORIES.OPERASIONAL,
        order: 2,
        dependencies: ["members"],
    },
    {
        key: "loans",
        name: "Pinjaman",
        description: "Kelola pinjaman dan kredit",
        icon: "creditCard",
        route: "/dashboard/pinjaman",
        category: MODULE_CATEGORIES.OPERASIONAL,
        order: 3,
        dependencies: ["members"],
    },
    {
        key: "finance",
        name: "Keuangan",
        description: "Jurnal, neraca, dan laporan SHU",
        icon: "dollar",
        route: "/dashboard/keuangan",
        category: MODULE_CATEGORIES.OPERASIONAL,
        order: 4,
        nested: [
            { key: "journal", label: "Jurnal Umum", route: "/dashboard/keuangan/jurnal" },
            { key: "balance", label: "Neraca", route: "/dashboard/keuangan/neraca" },
            { key: "shu", label: "Laporan SHU", route: "/dashboard/keuangan/shu" },
        ],
    },
    {
        key: "cashier",
        name: "Kasir",
        description: "Transaksi POS dan kasir",
        icon: "shoppingCart",
        route: "/dashboard/kasir",
        category: MODULE_CATEGORIES.OPERASIONAL,
        order: 5,
    },
    {
        key: "products",
        name: "Produk",
        description: "Kelola katalog produk",
        icon: "package",
        route: "/dashboard/produk",
        category: MODULE_CATEGORIES.OPERASIONAL,
        order: 6,
    },
    {
        key: "inventory",
        name: "Inventaris",
        description: "Stok gudang dan logistik",
        icon: "layers",
        route: "/dashboard/inventaris",
        category: MODULE_CATEGORIES.OPERASIONAL,
        order: 7,
        dependencies: ["products"],
    },
    {
        key: "procurement",
        name: "Pengadaan",
        description: "Kelola pengadaan barang",
        icon: "truck",
        route: "/dashboard/pengadaan",
        category: MODULE_CATEGORIES.OPERASIONAL,
        order: 8,
        comingSoon: true,
    },
    {
        key: "sales",
        name: "Penjualan",
        description: "Riwayat dan statistik penjualan",
        icon: "trendingUp",
        route: "/dashboard/penjualan",
        category: MODULE_CATEGORIES.OPERASIONAL,
        order: 9,
        comingSoon: true,
    },
    {
        key: "warehouse",
        name: "Gudang",
        description: "Manajemen pergudangan",
        icon: "warehouse",
        route: "/dashboard/gudang",
        category: MODULE_CATEGORIES.OPERASIONAL,
        order: 10,
        comingSoon: true,
    },
    {
        key: "suppliers",
        name: "Pemasok",
        description: "Kelola data pemasok",
        icon: "truck",
        route: "/dashboard/pemasok",
        category: MODULE_CATEGORIES.OPERASIONAL,
        order: 11,
        comingSoon: true,
    },
    {
        key: "customers",
        name: "Pelanggan",
        description: "Kelola data pelanggan",
        icon: "userCheck",
        route: "/dashboard/pelanggan",
        category: MODULE_CATEGORIES.OPERASIONAL,
        order: 12,
        comingSoon: true,
    },
    {
        key: "employees",
        name: "Karyawan",
        description: "Kelola data karyawan",
        icon: "people",
        route: "/dashboard/karyawan",
        category: MODULE_CATEGORIES.TIM,
        order: 1,
    },
    {
        key: "attendance",
        name: "Absensi",
        description: "Rekam absensi karyawan",
        icon: "calendar",
        route: "/dashboard/absensi",
        category: MODULE_CATEGORIES.TIM,
        order: 2,
        dependencies: ["employees"],
        comingSoon: true,
    },
    {
        key: "tasks",
        name: "Tugas",
        description: "Kelola tugas dan todo",
        icon: "check",
        route: "/dashboard/tugas",
        category: MODULE_CATEGORIES.TIM,
        order: 3,
    },
    {
        key: "accounting",
        name: "Akuntansi",
        description: "Modul akuntansi lengkap",
        icon: "book",
        route: "/dashboard/akuntansi",
        category: MODULE_CATEGORIES.LAINNYA,
        order: 1,
        comingSoon: true,
    },
    {
        key: "reports",
        name: "Laporan",
        description: "Berbagai laporan keuangan",
        icon: "barChart",
        route: "/dashboard/laporan",
        category: MODULE_CATEGORIES.LAINNYA,
        order: 2,
    },
    {
        key: "notifications",
        name: "Notifikasi",
        description: "Pengaturan notifikasi",
        icon: "bell",
        route: "/dashboard/notifikasi",
        category: MODULE_CATEGORIES.LAINNYA,
        order: 3,
    },
    {
        key: "activityLog",
        name: "Log Aktivitas",
        description: "Riwayat aktivitas sistem",
        icon: "activity",
        route: "/dashboard/log-aktivitas",
        category: MODULE_CATEGORIES.LAINNYA,
        order: 4,
    },
    {
        key: "settings",
        name: "Pengaturan",
        description: "Pengaturan aplikasi",
        icon: "settings",
        route: "/dashboard/pengaturan",
        category: MODULE_CATEGORIES.LAINNYA,
        order: 5,
    },
    {
        key: "moduleManager",
        name: "Add Module",
        description: "Kelola modul aplikasi",
        icon: "plus",
        route: "/dashboard/modules",
        category: MODULE_CATEGORIES.LAINNYA,
        order: 6,
    },
];

export function getModuleByKey(key) {
    return MODULE_REGISTRY.find((m) => m.key === key);
}

export function getModulesByCategory(category) {
    return MODULE_REGISTRY.filter((m) => m.category === category).sort(
        (a, b) => a.order - b.order,
    );
}

export function getCategories() {
    return Object.values(MODULE_CATEGORIES);
}
