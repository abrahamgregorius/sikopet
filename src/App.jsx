/** @format */

import { Route, Routes } from "react-router-dom";

import Login from "./page/auth/Login";
import Dashboard from "./page/dashboard";
import Home from "./page/Home";
import ModuleManagerPage from "./page/dashboard/ModuleManagerPage";
import KaryawanPage from "./page/dashboard/KaryawanPage";
import GenericModulePage from "./page/dashboard/GenericModulePage";
import InventarisPage from "./page/dashboard/InventarisPage";
import KeanggotaanPage from "./page/keanggotaan";
import SimpananPage from "./page/simpanan";
import PinjamanPage from "./page/pinjaman";
import KeuanganPage from "./page/keuangan";
import KasirPage from "./page/kasir";
import PengadaanPage from "./page/pengadaan";
import PenjualanPage from "./page/penjualan";
import GudangPage from "./page/gudang";
import PemasokPage from "./page/pemasok";
import PelangganPage from "./page/pelanggan";

const routes = [
    {
        element: <Home />,
        path: "/",
    },
    {
        element: <Login />,
        path: "/login",
    },
    {
        element: <Dashboard />,
        path: "/dashboard",
    },
    {
        element: <ModuleManagerPage />,
        path: "/dashboard/modules",
    },
    {
        element: <KeanggotaanPage />,
        path: "/dashboard/keanggotaan",
    },
    {
        element: <SimpananPage />,
        path: "/dashboard/simpanan",
    },
    {
        element: <PinjamanPage />,
        path: "/dashboard/pinjaman",
    },
    {
        element: <KeuanganPage />,
        path: "/dashboard/keuangan",
    },
    {
        element: <KaryawanPage />,
        path: "/dashboard/karyawan",
    },
    {
        element: <KasirPage />,
        path: "/dashboard/kasir",
    },
    {
        element: <PengadaanPage />,
        path: "/dashboard/pengadaan",
    },
    {
        element: <PenjualanPage />,
        path: "/dashboard/penjualan",
    },
    {
        element: <GudangPage />,
        path: "/dashboard/gudang",
    },
    {
        element: <PemasokPage />,
        path: "/dashboard/pemasok",
    },
    {
        element: <PelangganPage />,
        path: "/dashboard/pelanggan",
    },
    {
        element: <InventarisPage />,
        path: "/dashboard/inventaris",
    },
    {
        element: <GenericModulePage />,
        path: "/dashboard/:module",
    },
];

export default function App() {
    return (
        <Routes>
            {routes.map((r) => {
                return <Route element={r.element} path={r.path}></Route>;
            })}
        </Routes>
    );
}
