/** @format */

import { useState, useEffect } from "react";
import { Avatar, AvatarGroup, Badge } from "../../../components/ui";
import { db } from "../../../database/db";
import { useAuth } from "../../../contexts/AuthContext";

const GRADIENTS = [
  "bg-gradient-to-br from-[#398eb3] to-[#2F7698]",
  "bg-gradient-to-br from-[#4CC9B0] to-[#398eb3]",
  "bg-gradient-to-br from-[#67B2D4] to-[#398eb3]",
  "bg-gradient-to-br from-[#F59E0B] to-[#2F7698]",
  "bg-gradient-to-br from-[#8B5CF6] to-[#398eb3]",
];

function getInitials(name) {
  if (!name) return "US";
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function getGradient(name) {
  if (!name) return GRADIENTS[0];
  const idx = name.charCodeAt(0) % GRADIENTS.length;
  return GRADIENTS[idx];
}

export default function TeamList() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    db.users.toArray().then((data) => {
      setUsers(data.slice(0, 6));
    });
  }, []);

  const displayUsers = users.length > 0 ? users : (user ? [user] : []);

  return (
    <div id="tim-panel" className="rounded-3xl bg-white border border-[#D8E4EA] p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-display font-bold text-[#0F172A] text-[16px]">Anggota Tim</h3>
        {displayUsers.length > 0 && (
          <AvatarGroup
            avatars={displayUsers.map((u) => ({
              color: getGradient(u.name || u.email),
              initials: getInitials(u.name || u.email),
            }))}
            max={3}
          />
        )}
      </div>

      {displayUsers.length === 0 ? (
        <p className="text-[13px] text-[#94A3B8]">Belum ada data tim.</p>
      ) : (
        <ul className="space-y-4">
          {displayUsers.map((u, i) => {
            const roleLabel = {
              admin: "Administrator",
              operator: "Operator",
              ba: "Business Assistant",
              pmo: "PMO",
            }[u.role] || u.role || "Petugas";
            const isOnline = i === 0;

            return (
              <li key={u.id || i} className="flex items-center gap-3">
                <span className="relative shrink-0">
                  <Avatar size="md" color={getGradient(u.name || u.email)} initials={getInitials(u.name || u.email)} />
                  <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white ${isOnline ? "bg-[#22C55E]" : "bg-[#94A3B8]"}`}></span>
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-[13.5px] font-semibold text-[#0F172A] truncate">
                    {u.name || (u.email ? u.email.split("@")[0] : `Petugas ${i + 1}`)}
                  </p>
                  <p className="text-[12px] text-[#94A3B8]">{roleLabel}</p>
                </div>
                <Badge variant={isOnline ? "success" : "neutral"} className="!text-[10.5px] !px-2 !py-0.5">
                  {isOnline ? "Online" : "Offline"}
                </Badge>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
