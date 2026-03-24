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
      setEmail(result.user.email);
      setRole(result.role);
    }
  };

  init();
}, []);

  // 🔥 AICI ERA PROBLEMA
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <div style={navContainer}>
      <div style={left}>
        <h2 style={logo}>QC Stop Tracker</h2>

        <div style={links}>
          <Link href="/">Acasă</Link>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/opriri">Opriri</Link>
          {role === "admin" && <Link href="/admin">Admin</Link>}
        </div>
      </div>

      <div style={right}>
        {email && <span style={emailStyle}>{email}</span>}

        <button onClick={handleLogout} style={logoutBtn}>
          Logout
        </button>
      </div>
    </div>
  );
}

const navContainer = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "15px 30px",
  backgroundColor: "#e2e8f0",
};

const left = {
  display: "flex",
  alignItems: "center",
  gap: "30px",
};

const logo = {
  margin: 0,
};

const links = {
  display: "flex",
  gap: "20px",
};

const right = {
  display: "flex",
  alignItems: "center",
  gap: "15px",
};

const emailStyle = {
  backgroundColor: "#cbd5f5",
  padding: "6px 12px",
  borderRadius: "20px",
};

const logoutBtn = {
  padding: "8px 14px",
  backgroundColor: "#0f172a",
  color: "white",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
};