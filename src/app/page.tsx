"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function HomePage() {
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user?.email) {
        setUserEmail(user.email);
      } else {
        setUserEmail("");
      }
    };

    getUser();
  }, []);

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        maxWidth: "1100px",
        margin: "40px auto",
        padding: "0 20px",
      }}
    >
      <section
        style={{
          background: "linear-gradient(135deg, #eff6ff 0%, #f5f3ff 100%)",
          border: "1px solid #e5e7eb",
          borderRadius: "24px",
          padding: "50px 40px",
          textAlign: "center",
          boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
        }}
      >
        <h1
          style={{
            fontSize: "42px",
            marginBottom: "15px",
            color: "#0f172a",
          }}
        >
          QC Stop Tracker
        </h1>

        <p
          style={{
            fontSize: "18px",
            color: "#475569",
            maxWidth: "760px",
            margin: "0 auto",
            lineHeight: 1.6,
          }}
        >
          Aplicație web pentru înregistrarea opririlor mașinilor de asamblare
          cauzate de probleme ale camerelor de detecție, cu evidență clară,
          dashboard și export Excel.
        </p>

        <div
          style={{
            marginTop: "30px",
            display: "flex",
            justifyContent: "center",
            gap: "15px",
            flexWrap: "wrap",
          }}
        >
          {userEmail ? (
            <Link href="/dashboard" style={primaryButton}>
              Mergi la Dashboard
            </Link>
          ) : (
            <>
              <Link href="/login" style={primaryButton}>
                Login
              </Link>
              <Link href="/register" style={secondaryButton}>
                Creează cont
              </Link>
            </>
          )}
        </div>
      </section>

      <section
        style={{
          marginTop: "35px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "20px",
        }}
      >
        <div style={cardStyle}>
          <h3 style={cardTitle}>Operator</h3>
          <p style={cardText}>
            Introduce opririle, completează motivul, schimbul, ora, operatorul
            și poate atașa poză pentru fiecare caz.
          </p>
        </div>

        <div style={cardStyle}>
          <h3 style={cardTitle}>Supervisor</h3>
          <p style={cardText}>
            Urmărește situația generală, top motive, top mașini și distribuția
            opririlor pe schimburi.
          </p>
        </div>

        <div style={cardStyle}>
          <h3 style={cardTitle}>Admin</h3>
          <p style={cardText}>
            Controlează accesul, rolurile utilizatorilor și gestionează
            funcționalitățile aplicației.
          </p>
        </div>
      </section>

      <section
        style={{
          marginTop: "35px",
          backgroundColor: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: "20px",
          padding: "30px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.04)",
        }}
      >
        <h2 style={{ color: "#0f172a", marginTop: 0 }}>Ce poate face aplicația</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "18px",
            marginTop: "20px",
          }}
        >
          <div style={featureBox}>
            <strong>Înregistrare rapidă</strong>
            <p style={featureText}>Salvare opriri cu dată, oră, schimb, operator și motiv.</p>
          </div>

          <div style={featureBox}>
            <strong>Poze atașate</strong>
            <p style={featureText}>Poți păstra referința pozei pentru fiecare problemă introdusă.</p>
          </div>

          <div style={featureBox}>
            <strong>Dashboard clar</strong>
            <p style={featureText}>Vezi rapid totaluri, top motive și schimburile afectate.</p>
          </div>

          <div style={featureBox}>
            <strong>Export Excel</strong>
            <p style={featureText}>Generezi rapoarte pentru analiză și trimitere către superiori.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

const primaryButton = {
  textDecoration: "none",
  backgroundColor: "#2563eb",
  color: "white",
  padding: "12px 20px",
  borderRadius: "12px",
  fontWeight: 700,
};

const secondaryButton = {
  textDecoration: "none",
  backgroundColor: "#ffffff",
  color: "#2563eb",
  padding: "12px 20px",
  borderRadius: "12px",
  fontWeight: 700,
  border: "1px solid #bfdbfe",
};

const cardStyle = {
  backgroundColor: "#ffffff",
  border: "1px solid #e5e7eb",
  borderRadius: "20px",
  padding: "24px",
  boxShadow: "0 8px 20px rgba(0,0,0,0.04)",
};

const cardTitle = {
  marginTop: 0,
  marginBottom: "10px",
  color: "#0f172a",
};

const cardText = {
  color: "#475569",
  lineHeight: 1.6,
  margin: 0,
};

const featureBox = {
  backgroundColor: "#f8fafc",
  border: "1px solid #e2e8f0",
  borderRadius: "16px",
  padding: "18px",
};

const featureText = {
  color: "#475569",
  marginBottom: 0,
  lineHeight: 1.5,
};