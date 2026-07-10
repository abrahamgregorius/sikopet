/** @format */

import { Link, useLocation } from "react-router-dom";

const STATIC_BREADCRUMBS = {
    "/dashboard": [{ label: "Dasbor", path: "/dashboard" }],
    "/dashboard/modules": [
        { label: "Dasbor", path: "/dashboard" },
        { label: "Kelola Modul", path: "/dashboard/modules" },
    ],
};

function capitalizeWords(str) {
    return str.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

export default function Breadcrumb() {
    const location = useLocation();

    let crumbs = STATIC_BREADCRUMBS[location.pathname];

    if (!crumbs) {
        if (location.pathname.startsWith('/dashboard/')) {
            const module = location.pathname.replace('/dashboard/', '');
            crumbs = [
                { label: "Dasbor", path: "/dashboard" },
                { label: capitalizeWords(module), path: location.pathname },
            ];
        } else {
            crumbs = [{ label: "Dasbor", path: "/dashboard" }];
        }
    }

    return (
        <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-2 text-[13px]">
                {crumbs.map((crumb, index) => (
                    <li key={crumb.path} className="flex items-center gap-2">
                        {index > 0 && (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" className="shrink-0">
                                <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        )}
                        {index === crumbs.length - 1 ? (
                            <span className="font-semibold text-[#0F172A]">{crumb.label}</span>
                        ) : (
                            <Link to={crumb.path} className="text-[#6B7280] hover:text-[#0F172A] transition-colors">
                                {crumb.label}
                            </Link>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
}
