"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { exportOpririToExcel } from "@/lib/exportExcel";


type Oprire = {
  id: number;
  stop_date: string;
  stop_time: string;
  shift: string;
  machine: string;
  operator_name: string;
  reason: string;
  details: string;
  photo_name: string;
};

export default function DashboardPage() {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [opriri, setOpriri] = useState<Oprire[]>([]);

  useEffect(() => {
  const init = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    // 👉 dacă NU e logat → îl trimitem la login
    if (!user) {
      window.location.href = "/login";
      return;
    }

    // 👉 încercăm să luăm profilul
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    let currentRole = profile?.role;

    // 👉 dacă nu există profil → îl creăm automat
    if (!currentRole) {
      await supabase.from("profiles").insert([
        {
          id: user.id,
          email: user.email,
          role: "operator",
        },
      ]);

      currentRole = "operator";
    }

    setRole(currentRole);

    // 👉 aducem opririle
    const { data, error } = await supabase
      .from("assembly_stops")
      .select("*")
      .order("id", { ascending: false });

    if (!error) {
      setOpriri(data || []);
    }

    setLoading(false);
  };

  init();
}, []);

  if (loading) {
    return <p style={{ padding: "30px", fontFamily: "Arial, sans-serif" }}>Se încarcă...</p>;
  }

  if (role !== "operator" && role !== "supervisor" && role !== "admin") {
    return (
      <div style={pageContainer}>
        <div style={heroCard}>
          <h1 style={titleStyle}>Acces interzis</h1>
          <p style={subtitleStyle}>Trebuie să fii autentificat pentru a accesa dashboard-ul.</p>
        </div>
      </div>
    );
  }

  const totalOpriri = opriri.length;
  const opririCuPoza = opriri.filter((oprire) => oprire.photo_name).length;

  const schimburiCount: Record<string, number> = {};
  const motiveCount: Record<string, number> = {};
  const masiniCount: Record<string, number> = {};

  opriri.forEach((oprire) => {
    schimburiCount[oprire.shift] = (schimburiCount[oprire.shift] || 0) + 1;
    motiveCount[oprire.reason] = (motiveCount[oprire.reason] || 0) + 1;
    masiniCount[oprire.machine] = (masiniCount[oprire.machine] || 0) + 1;
  });

  const topSchimb =
    Object.keys(schimburiCount).length > 0
      ? Object.entries(schimburiCount).sort((a, b) => b[1] - a[1])[0][0]
      : "Niciunul";

  const topMotive = Object.entries(motiveCount).sort((a, b) => b[1] - a[1]);
  const topMasini = Object.entries(masiniCount).sort((a, b) => b[1] - a[1]);

  return (
    <div style={pageContainer}>
      <div style={heroCard}>
        <div>
          <h1 style={titleStyle}>Dashboard</h1>
          <p style={subtitleStyle}>
            Rezumatul opririlor introduse în aplicație, cu statistici rapide și export Excel.
          </p>
        </div>

        <button onClick={() => exportOpririToExcel(opriri)} style={exportButtonStyle}>
          Export Excel
        </button>
      </div>

      <div style={statsGrid}>
        <div style={statCard}>
          <p style={statLabel}>Total opriri</p>
          <p style={statValue}>{totalOpriri}</p>
        </div>

        <div style={statCard}>
          <p style={statLabel}>Opriri cu poză</p>
          <p style={statValue}>{opririCuPoza}</p>
        </div>

        <div style={statCard}>
          <p style={statLabel}>Cel mai afectat schimb</p>
          <p style={statValue}>{topSchimb}</p>
        </div>
      </div>

      <div style={contentGrid}>
        <div style={panelCard}>
          <h2 style={sectionTitle}>Top motive oprire</h2>

          {topMotive.length === 0 ? (
            <p style={emptyText}>Nu există opriri introduse momentan.</p>
          ) : (
            <div style={listWrapper}>
              {topMotive.map(([motiv, count], index) => (
                <div key={motiv} style={listItem}>
                  <div>
                    <p style={itemTitle}>
                      {index + 1}. {motiv}
                    </p>
                    <p style={itemSubtitle}>Motiv raportat în producție</p>
                  </div>
                  <span style={countBadge}>{count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={panelCard}>
          <h2 style={sectionTitle}>Top mașini afectate</h2>

          {topMasini.length === 0 ? (
            <p style={emptyText}>Nu există opriri introduse momentan.</p>
          ) : (
            <div style={listWrapper}>
              {topMasini.map(([masina, count], index) => (
                <div key={masina} style={listItem}>
                  <div>
                    <p style={itemTitle}>
                      {index + 1}. {masina}
                    </p>
                    <p style={itemSubtitle}>Mașină cu opriri înregistrate</p>
                  </div>
                  <span style={countBadge}>{count}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const pageContainer = {
  fontFamily: "Arial, sans-serif",
  maxWidth: "1100px",
  margin: "40px auto",
  padding: "0 20px",
};

const heroCard = {
  background: "linear-gradient(135deg, #eff6ff 0%, #f5f3ff 100%)",
  border: "1px solid #e5e7eb",
  borderRadius: "24px",
  padding: "28px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "20px",
  flexWrap: "wrap" as const,
};

const titleStyle = {
  margin: 0,
  fontSize: "34px",
  color: "#0f172a",
};

const subtitleStyle = {
  marginTop: "10px",
  marginBottom: 0,
  color: "#475569",
  fontSize: "16px",
  lineHeight: 1.6,
  maxWidth: "700px",
};

const exportButtonStyle = {
  padding: "12px 18px",
  backgroundColor: "#16a34a",
  color: "white",
  border: "none",
  borderRadius: "12px",
  cursor: "pointer",
  fontWeight: 700,
  boxShadow: "0 8px 18px rgba(22,163,74,0.25)",
};

const statsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "20px",
  marginTop: "28px",
};

const statCard = {
  border: "1px solid #e5e7eb",
  borderRadius: "20px",
  padding: "24px",
  backgroundColor: "#ffffff",
  boxShadow: "0 8px 20px rgba(0,0,0,0.04)",
};

const statLabel = {
  margin: 0,
  color: "#475569",
  fontSize: "15px",
};

const statValue = {
  margin: "12px 0 0 0",
  fontSize: "30px",
  fontWeight: 700,
  color: "#0f172a",
};

const contentGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
  gap: "20px",
  marginTop: "28px",
};

const panelCard = {
  border: "1px solid #e5e7eb",
  borderRadius: "20px",
  padding: "24px",
  backgroundColor: "#ffffff",
  boxShadow: "0 8px 20px rgba(0,0,0,0.04)",
};

const sectionTitle = {
  marginTop: 0,
  marginBottom: "18px",
  color: "#0f172a",
};

const listWrapper = {
  display: "flex",
  flexDirection: "column" as const,
  gap: "14px",
};

const listItem = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "16px",
  padding: "14px 16px",
  backgroundColor: "#f8fafc",
  border: "1px solid #e2e8f0",
  borderRadius: "16px",
};

const itemTitle = {
  margin: 0,
  color: "#0f172a",
  fontWeight: 700,
};

const itemSubtitle = {
  margin: "6px 0 0 0",
  color: "#64748b",
  fontSize: "14px",
};

const countBadge = {
  minWidth: "42px",
  height: "42px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "999px",
  backgroundColor: "#dbeafe",
  color: "#1d4ed8",
  fontWeight: 700,
};

const emptyText = {
  color: "#64748b",
  margin: 0,
};