/** @format */

import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
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

const publicRoutes = [
  { element: <Home />, path: "/" },
  { element: <Login />, path: "/login" },
];

const protectedRoutes = [
  { element: <Dashboard />, path: "/dashboard" },
  { element: <ModuleManagerPage />, path: "/dashboard/modules" },
  { element: <KeanggotaanPage />, path: "/dashboard/keanggotaan" },
  { element: <SimpananPage />, path: "/dashboard/simpanan" },
  { element: <PinjamanPage />, path: "/dashboard/pinjaman" },
  { element: <KeuanganPage />, path: "/dashboard/keuangan" },
  { element: <KaryawanPage />, path: "/dashboard/karyawan" },
  { element: <KasirPage />, path: "/dashboard/kasir" },
  { element: <PengadaanPage />, path: "/dashboard/pengadaan" },
  { element: <PenjualanPage />, path: "/dashboard/penjualan" },
  { element: <GudangPage />, path: "/dashboard/gudang" },
  { element: <PemasokPage />, path: "/dashboard/pemasok" },
  { element: <PelangganPage />, path: "/dashboard/pelanggan" },
  { element: <InventarisPage />, path: "/dashboard/inventaris" },
  { element: <GenericModulePage />, path: "/dashboard/:module" },
];

export default function App() {
  return (
    <Routes>
      {publicRoutes.map((r) => (
        <Route key={r.path} element={r.element} path={r.path} />
      ))}
      <Route
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
        path="/dashboard"
      />
      <Route
        element={
          <ProtectedRoute>
            <ModuleManagerPage />
          </ProtectedRoute>
        }
        path="/dashboard/modules"
      />
      <Route
        element={
          <ProtectedRoute>
            <KeanggotaanPage />
          </ProtectedRoute>
        }
        path="/dashboard/keanggotaan"
      />
      <Route
        element={
          <ProtectedRoute>
            <SimpananPage />
          </ProtectedRoute>
        }
        path="/dashboard/simpanan"
      />
      <Route
        element={
          <ProtectedRoute>
            <PinjamanPage />
          </ProtectedRoute>
        }
        path="/dashboard/pinjaman"
      />
      <Route
        element={
          <ProtectedRoute>
            <KeuanganPage />
          </ProtectedRoute>
        }
        path="/dashboard/keuangan"
      />
      <Route
        element={
          <ProtectedRoute>
            <KaryawanPage />
          </ProtectedRoute>
        }
        path="/dashboard/karyawan"
      />
      <Route
        element={
          <ProtectedRoute>
            <KasirPage />
          </ProtectedRoute>
        }
        path="/dashboard/kasir"
      />
      <Route
        element={
          <ProtectedRoute>
            <PengadaanPage />
          </ProtectedRoute>
        }
        path="/dashboard/pengadaan"
      />
      <Route
        element={
          <ProtectedRoute>
            <PenjualanPage />
          </ProtectedRoute>
        }
        path="/dashboard/penjualan"
      />
      <Route
        element={
          <ProtectedRoute>
            <GudangPage />
          </ProtectedRoute>
        }
        path="/dashboard/gudang"
      />
      <Route
        element={
          <ProtectedRoute>
            <PemasokPage />
          </ProtectedRoute>
        }
        path="/dashboard/pemasok"
      />
      <Route
        element={
          <ProtectedRoute>
            <PelangganPage />
          </ProtectedRoute>
        }
        path="/dashboard/pelanggan"
      />
      <Route
        element={
          <ProtectedRoute>
            <InventarisPage />
          </ProtectedRoute>
        }
        path="/dashboard/inventaris"
      />
      <Route
        element={
          <ProtectedRoute>
            <GenericModulePage />
          </ProtectedRoute>
        }
        path="/dashboard/:module"
      />
    </Routes>
  );
}
