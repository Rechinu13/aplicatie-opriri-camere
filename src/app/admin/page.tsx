"use client";

import { useEffect, useState } from "react";
import { getUserWithRole } from "@/lib/getUser";

export default function AdminPage() {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const result = await getUserWithRole();

      if (!result) {
        setLoading(false);
        return;
      }

      setRole(result.role);
      setLoading(false);
    };

    init();
  }, []);

  if (loading) {
    return <p style={{ padding: "30px" }}>Se încarcă...</p>;
  }

  // 🔐 AICI ESTE BLOCAREA REALĂ
  if (role !== "admin") {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h1>Acces interzis</h1>
        <p>Doar adminul poate accesa această pagină.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "40px", maxWidth: "900px", margin: "auto" }}>
      <h1>Panou Admin</h1>

      <div
        style={{
          marginTop: "20px",
          border: "1px solid #ccc",
          borderRadius: "12px",
          padding: "20px",
        }}
      >
        <h2>Utilizatori</h2>

        <p>Aici vom gestiona utilizatorii (pasul următor 😉)</p>
      </div>
    </div>
  );
}