"use client";

import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { getUserWithRole } from "@/lib/getUser";

export default function Navbar() {
  const [email, setEmail] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      const result = await getUserWithRole();
      if (result) {
        setEmail(result.user.email ?? null);
        setRole(result.role);
      }
    };

    init();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <div style={nav}>
      <div style={logo}>QC Stop Tracker</div>

      <div style={links}>
        <Link href="/" style={link}>Home</Link>
        <Link href="/dashboard" style={link}>Dashboard</Link>
        <Link href="/opriri" style={link}>Opriri</Link>
        {role === "admin" && (
          <Link href="/admin" style={link}>Admin</Link>
        )}
      </div>

      <div style={right}>
        {email && <span style={badge}>{email}</span>}

        <button onClick={handleLogout} style={logout}>
          Logout
        </button>
      </div>
    </div>
  );
}

const nav = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "16px 30px",
  background: "#020617",
  borderBottom: "1px solid #1e293b",
};

const logo = {
  fontWeight: 700,
  fontSize: "18px",
  color: "#e2e8f0",
};

const links = {
  display: "flex",
  gap: "25px",
};

const link = {
  color: "#94a3b8",
  textDecoration: "none",
  fontWeight: 500,
};

const right = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
};

const badge = {
  background: "#1e293b",
  padding: "6px 12px",
  borderRadius: "999px",
  fontSize: "12px",
  color: "#cbd5f5",
};

const logout = {
  background: "#dc2626",
  color: "white",
  padding: "8px 14px",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
};