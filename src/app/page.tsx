"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#0f172a",
      }}
    >
      <div
        style={{
          background: "#1e293b",
          padding: "40px",
          borderRadius: "16px",
          textAlign: "center",
          minWidth: "300px",
        }}
      >
        <h1 style={{ marginBottom: "30px" }}>QC Stop Tracker</h1>

        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <Link href="/login">
            <button style={{ width: "100%" }}>Login</button>
          </Link>

          <Link href="/register">
            <button
              style={{
                width: "100%",
                background: "#3b82f6",
              }}
            >
              Creează cont
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}