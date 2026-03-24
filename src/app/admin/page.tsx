"use client";

import { useEffect, useState } from "react";
import { getCurrentUserRole } from "@/lib/authHelpers";

export default function AdminPage() {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRole = async () => {
      const currentRole = await getCurrentUserRole();
      setRole(currentRole);
      setLoading(false);
    };

    loadRole();
  }, []);

  if (loading) {
    return <p>Se încarcă...</p>;
  

  if (role !== "admin") {
    return (
      <div
  style={{
    fontFamily: "Arial, sans-serif",
    maxWidth: "1100px",
    margin: "40px auto",
    padding: "0 20px",
  }}
>
        <h1>Acces interzis</h1>
        <p>Doar adminul poate accesa această pagină.</p>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "Arial", maxWidth: "900px" }}>
      <h1>Panou Admin</h1>
      <p>Aici vor fi administrate conturile utilizatorilor și setările aplicației.</p>

      <div
        style={{
          marginTop: "20px",
          border: "1px solid #ccc",
          borderRadius: "10px",
          padding: "20px",
        }}
      >
        <h2>Utilizatori</h2>

        <div style={{ marginTop: "15px", display: "flex", flexDirection: "column", gap: "10px" }}>
          <div style={{ border: "1px solid #ddd", padding: "12px", borderRadius: "8px" }}>
            <p><strong>Nume:</strong> Cosmin</p>
            <p><strong>Rol:</strong> admin</p>
            <p><strong>Status:</strong> activ</p>
          </div>

          <div style={{ border: "1px solid #ddd", padding: "12px", borderRadius: "8px" }}>
            <p><strong>Nume:</strong> Operator 1</p>
            <p><strong>Rol:</strong> operator</p>
            <p><strong>Status:</strong> activ</p>
          </div>

          <div style={{ border: "1px solid #ddd", padding: "12px", borderRadius: "8px" }}>
            <p><strong>Nume:</strong> Supervisor 1</p>
            <p><strong>Rol:</strong> supervisor</p>
            <p><strong>Status:</strong> activ</p>
          </div>
        </div>
      </div>
    </div>
  );
}