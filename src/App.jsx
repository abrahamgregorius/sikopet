/** @format */

import { Route, Routes } from "react-router-dom";
import ProtectedRoute, { GuestRoute } from "./components/ProtectedRoute";

import Home from "./page/Home";
import Login from "./page/auth/Login";

import Dashboard from "./page/dashboard";
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
import Analitik from "./page/analitik";

const publicRoutes = [
	{
		path: "/",
		element: <Home />,
	},
	{
		path: "/login",
		element: (
			<GuestRoute>
				<Login />
			</GuestRoute>
		),
	},
];

const protectedRoutes = [
	{ path: "/dashboard", element: <Dashboard /> },
	{ path: "/dashboard/analitik", element: <Analitik /> },
	{ path: "/dashboard/modules", element: <ModuleManagerPage /> },
	{ path: "/dashboard/keanggotaan", element: <KeanggotaanPage /> },
	{ path: "/dashboard/simpanan", element: <SimpananPage /> },
	{ path: "/dashboard/pinjaman", element: <PinjamanPage /> },
	{ path: "/dashboard/keuangan", element: <KeuanganPage /> },
	{ path: "/dashboard/karyawan", element: <KaryawanPage /> },
	{ path: "/dashboard/kasir", element: <KasirPage /> },
	{ path: "/dashboard/pengadaan", element: <PengadaanPage /> },
	{ path: "/dashboard/penjualan", element: <PenjualanPage /> },
	//{ path: "/dashboard/gudang", element: <GudangPage /> },
	{ path: "/dashboard/pemasok", element: <PemasokPage /> },
	{ path: "/dashboard/pelanggan", element: <PelangganPage /> },
	{ path: "/dashboard/inventaris", element: <InventarisPage /> },
	{ path: "/dashboard/:module", element: <GenericModulePage /> },
];

export default function App() {
	return (
		<Routes>
			{publicRoutes.map(({ path, element }) => (
				<Route key={path} path={path} element={element} />
			))}

			{protectedRoutes.map(({ path, element }) => (
				<Route
					key={path}
					path={path}
					element={<ProtectedRoute>{element}</ProtectedRoute>}
				/>
			))}
		</Routes>
	);
}
