"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useSearchParams } from "next/navigation";
export default function LoginPage() 
export const dynamic = "force-dynamic";{

  const router = useRouter();

  const [email, setEmail] = useState("");
  const [parola, setParola] = useState("");
  const [mesaj, setMesaj] = useState("");
  const [eroare, setEroare] = useState("");
  const [confirmareParola, setConfirmareParola] = useState("");
  const params = useSearchParams();
  const inviteCode = params.get("invite");
  const handleLogin = async () => {
    setMesaj("");
    setEroare("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: parola,
    });

    if (error) {
      setEroare("Email sau parolă incorectă.");
      return;
    }

    setMesaj("Autentificare reușită.");
    router.push("/dashboard");
  };
  const handleRegister = async () => {
  setEroare("");
  setMesaj("");

  // 🔥 verificare invitație
  if (!inviteCode) {
    setEroare("Acces doar pe bază de invitație.");
    return;
  }

  const { data: invite } = await supabase
    .from("invites")
    .select("*")
    .eq("code", inviteCode)
    .single();

  if (!invite) {
    setEroare("Invitație invalidă.");
    return;
  }

  // 🔥 validări normale
  if (!email || !parola || !confirmareParola) {
    setEroare("Completează toate câmpurile.");
    return;
  }

  if (parola !== confirmareParola) {
    setEroare("Parolele nu coincid.");
    return;
  }

  if (parola.length < 6) {
    setEroare("Parola trebuie să aibă minim 6 caractere.");
    return;
  }

  // 🔥 creare cont
  const { data, error } = await supabase.auth.signUp({
    email,
    password: parola,
  });

  if (error) {
    setEroare(error.message);
    return;
  }

  const userId = data.user?.id;

  if (!userId) {
    setEroare("Cont creat, dar nu s-a obținut ID-ul.");
    return;
  }

  // 🔥 profil
  const { error: profileError } = await supabase.from("profiles").insert([
    {
      id: userId,
      email: email,
      role: "operator",
    },
  ]);

  if (profileError) {
    setEroare("Cont creat, dar profilul nu a fost salvat.");
    return;
  }

  // 🔥 ștergem invitația (IMPORTANT)
  await supabase.from("invites").delete().eq("code", inviteCode);

  setMesaj("Cont creat cu succes. Te poți loga.");

  setEmail("");
  setParola("");
  setConfirmareParola("");
};
  return (
    <div style={pageWrapper}>
      <div style={cardStyle}>
        <div style={leftSide}>
          <p style={eyebrow}>QC Stop Tracker</p>
          <h1 style={title}>Autentificare</h1>
          <p style={subtitle}>
            Intră în aplicație pentru a introduce opriri, a verifica situația curentă
            și a exporta datele în Excel.
          </p>

          <div style={infoBox}>
            <p style={infoTitle}>Ce poți face după login</p>
            <ul style={listStyle}>
              <li>adaugi opriri noi</li>
              <li>vezi istoricul introducerilor</li>
              <li>analizezi datele în dashboard</li>
            </ul>
          </div>
        </div>

        <div style={rightSide}>
          <h2 style={formTitle}>Login</h2>

          <div style={fieldWrap}>
            <label style={labelStyle}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
              placeholder="exemplu@firma.com"
            />
          </div>

          <div style={fieldWrap}>
            <label style={labelStyle}>Parolă</label>
            <input
              type="password"
              value={parola}
              onChange={(e) => setParola(e.target.value)}
              style={inputStyle}
              placeholder="Introdu parola"
            />
          </div>
          <div style={fieldWrap}>
  <label style={labelStyle}>Confirmă parola</label>
  <input
    type="password"
    value={confirmareParola}
    onChange={(e) => setConfirmareParola(e.target.value)}
    style={inputStyle}
    placeholder="Confirmă parola"
  />
</div>
          {eroare && <p style={errorText}>{eroare}</p>}
          {mesaj && <p style={successText}>{mesaj}</p>}

          <button onClick={handleLogin} style={primaryButton}>
            Login
          </button>
          <button onClick={handleRegister} style={primaryButton}>
  Creează cont
</button>

          <p style={bottomText}>
            Nu ai cont?{" "}
          <Link href={`/login?invite=${inviteCode || ""}`}>
              Creează cont
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const pageWrapper = {
  minHeight: "calc(100vh - 90px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "40px 20px",
  background: "linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%)",
  fontFamily: "Arial, sans-serif",
};

const cardStyle = {
  width: "100%",
  maxWidth: "1100px",
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  backgroundColor: "#ffffff",
  border: "1px solid #e5e7eb",
  borderRadius: "28px",
  overflow: "hidden",
  boxShadow: "0 20px 50px rgba(15,23,42,0.08)",
};

const leftSide = {
  padding: "48px",
  background: "linear-gradient(135deg, #dbeafe 0%, #ede9fe 100%)",
};

const rightSide = {
  padding: "48px",
  display: "flex",
  flexDirection: "column" as const,
  justifyContent: "center",
};

const eyebrow = {
  margin: 0,
  color: "#1d4ed8",
  fontWeight: 700,
  letterSpacing: "0.5px",
};

const title = {
  marginTop: "14px",
  marginBottom: "14px",
  fontSize: "42px",
  color: "#0f172a",
};

const subtitle = {
  margin: 0,
  color: "#475569",
  fontSize: "17px",
  lineHeight: 1.7,
  maxWidth: "460px",
};

const infoBox = {
  marginTop: "28px",
  padding: "22px",
  backgroundColor: "rgba(255,255,255,0.7)",
  border: "1px solid rgba(255,255,255,0.6)",
  borderRadius: "20px",
};

const infoTitle = {
  marginTop: 0,
  marginBottom: "12px",
  color: "#0f172a",
  fontWeight: 700,
};

const listStyle = {
  margin: 0,
  paddingLeft: "18px",
  color: "#334155",
  lineHeight: 1.8,
};

const formTitle = {
  marginTop: 0,
  marginBottom: "24px",
  color: "#0f172a",
  fontSize: "28px",
};

const fieldWrap = {
  marginBottom: "18px",
};

const labelStyle = {
  display: "block",
  marginBottom: "8px",
  color: "#334155",
  fontWeight: 600,
};

const inputStyle = {
  width: "100%",
  padding: "13px 14px",
  borderRadius: "14px",
  border: "1px solid #cbd5e1",
  outline: "none",
  fontSize: "15px",
  backgroundColor: "#fff",
};

const primaryButton = {
  marginTop: "8px",
  width: "100%",
  padding: "14px 18px",
  backgroundColor: "#2563eb",
  color: "white",
  border: "none",
  cursor: "pointer",
  borderRadius: "14px",
  fontWeight: 700,
  fontSize: "15px",
  boxShadow: "0 10px 20px rgba(37,99,235,0.25)",
};

const errorText = {
  color: "#dc2626",
  fontWeight: 600,
  marginTop: "6px",
};

const successText = {
  color: "#16a34a",
  fontWeight: 600,
  marginTop: "6px",
};

const bottomText = {
  marginTop: "18px",
  color: "#475569",
};

const linkStyle = {
  color: "#2563eb",
  fontWeight: 700,
  textDecoration: "none",
};