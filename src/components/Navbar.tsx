"use client";

import { supabase } from "@/lib/supabase";

export default function Navbar({ email }: { email?: string }) {
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <div
      style={{
        background: "#020617",
        padding: "15px 30px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "1px solid #1e293b",
      }}
    >
      <div style={{ fontWeight: 700, fontSize: "18px" }}>
        🏭 Opriri Production
      </div>

      <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
        <span style={{ color: "#94a3b8" }}>{email}</span>

        <button
          onClick={handleLogout}
          style={{ background: "#dc2626", color: "white" }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}