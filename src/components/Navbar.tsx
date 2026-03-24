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
      <div style={logo}>QC Tracker</div>

      <div style={links}>
        <Link href="/">Home</Link>
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/opriri">Opriri</Link>
        {role === "admin" && <Link href="/admin">Admin</Link>}
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
  background: "#0f172a",
  color: "white",
};

const logo = {
  fontWeight: 700,
  fontSize: "18px",
};

const links = {
  display: "flex",
  gap: "20px",
};

const right = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
};

const badge = {
  background: "#1e293b",
  padding: "6px 12px",
  borderRadius: "999px",
  fontSize: "12px",
};

const logout = {
  background: "#ef4444",
};