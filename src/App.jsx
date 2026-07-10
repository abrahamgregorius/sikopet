/** @format */

import { Route, Routes } from "react-router-dom";

import Login from "./page/auth/Login";
import Dashboard from "./page/dashboard";
import Home from "./page/Home";
import ModuleManagerPage from "./page/dashboard/ModuleManagerPage";
import KaryawanPage from "./page/dashboard/KaryawanPage";
import GenericModulePage from "./page/dashboard/GenericModulePage";
import KeanggotaanPage from "./page/keanggotaan";
import SimpananPage from "./page/simpanan";
import PinjamanPage from "./page/pinjaman";
import KeuanganPage from "./page/keuangan";
import KasirPage from "./page/kasir";

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
        element: <KasirPage />,
        path: "/dashboard/kasir",
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
