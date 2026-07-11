/** @format */

import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getAccessToken, isSessionValid, getSession } from "../lib/auth";
import { isOnline } from "../lib/offline";
import { pullAllModules, startAutoSync, stopAutoSync } from "../lib/syncService";

function authMiddleware() {
  const session = getSession();
  const user = session?.user;
  if (!session?.accessToken || !user) return false;
  if (!isSessionValid()) return false;
  return true;
}

export function GuestRoute({ children }) {
  const { loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7FAFC]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-[#398EB3] border-t-transparent rounded-full animate-spin" />
          <p className="text-[14px] text-[#94A3B8]">Memuat...</p>
        </div>
      </div>
    );
  }

  if (authMiddleware()) {
    const from = location.state?.from?.pathname || "/dashboard";
    return <Navigate to={from} replace />;
  }

  return children;
}

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading, online } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7FAFC]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-[#398EB3] border-t-transparent rounded-full animate-spin" />
          <p className="text-[14px] text-[#94A3B8]">Memuat...</p>
        </div>
      </div>
    );
  }

  if (!authMiddleware()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  useEffect(() => {
    if (!online) return;
    if (!isSessionValid()) return;
    const token = getAccessToken();
    if (!token) return;
    startAutoSync(30000);
    pullAllModules(token).catch((e) =>
      console.warn("[ProtectedRoute] Initial sync failed:", e.message)
    );
  }, [online]);

  useEffect(() => {
    if (!online && isAuthenticated) {
      stopAutoSync();
    } else if (online && isAuthenticated) {
      startAutoSync(30000);
    }
  }, [online, isAuthenticated]);

	if (!online) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-[#F7FAFC] p-6">
				<div className="text-center max-w-sm">
					<div className="w-16 h-16 mx-auto mb-5 rounded-lg bg-[#FEE2E2] flex items-center justify-center">
						<svg
							width="28"
							height="28"
							viewBox="0 0 24 24"
							fill="none"
							stroke="#EF4444"
							strokeWidth="2"
						>
							<path
								d="M1 1l22 22M16.72 11.06A10.94 10.94 0 0119 12.55M5 12.55a10.94 10.94 0 015.17-2.39M10.71 5.05A16 16 0 0122.58 9M1.42 9a15.91 15.91 0 014.7-2.88M8.53 16.11a6 6 0 016.95 0M12 20h.01"
								strokeLinecap="round"
							/>
						</svg>
					</div>
					<h2 className="font-display font-bold text-[20px] text-[#0F172A] mb-2">
						Offline
					</h2>
					<p className="text-[14px] text-[#64748B] mb-5">
						Anda sudah logged in, tetapi fitur offline read-only sedang dalam
						pengembangan. Silakan hubungkan ke internet untuk akses penuh.
					</p>
					<p className="text-[12px] text-[#94A3B8]">
						Anda tetap bisa mengakses data lokal yang sudah tersimpan di
						perangkat.
					</p>
				</div>
			</div>
		);
	}

	return children;
}
