"use client";

export const dynamic = "force-dynamic";

import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function RegisterPage() {
  const router = useRouter();
  const params = useSearchParams();
  const inviteCode = params.get("invite");

  const [email, setEmail] = useState("");
  const [parola, setParola] = useState("");
  const [confirmareParola, setConfirmareParola] = useState("");
  const [mesaj, setMesaj] = useState("");
  const [eroare, setEroare] = useState("");

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

    // 🔥 validări
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

    // 🔥 salvare profil
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

    // 🔥 ștergem invitația
    await supabase.from("invites").delete().eq("code", inviteCode);

    setMesaj("Cont creat cu succes. Te poți loga.");

    setEmail("");
    setParola("");
    setConfirmareParola("");
  };

  return (
    <div style={pageWrapper}>
      <div style={cardStyle}>
        <h1 style={title}>Creare cont</h1>

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={input}
        />

        <input
          type="password"
          placeholder="Parolă"
          value={parola}
          onChange={(e) => setParola(e.target.value)}
          style={input}
        />

        <input
          type="password"
          placeholder="Confirmă parola"
          value={confirmareParola}
          onChange={(e) => setConfirmareParola(e.target.value)}
          style={input}
        />

        {eroare && <p style={error}>{eroare}</p>}
        {mesaj && <p style={success}>{mesaj}</p>}

        <button onClick={handleRegister} style={button}>
          Creează cont
        </button>

        <Link href="/login">Înapoi la login</Link>
      </div>
    </div>
  );
}

/* 🎨 STYLES */

const pageWrapper = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "#0f172a",
};

const cardStyle = {
  background: "#1e293b",
  padding: "40px",
  borderRadius: "16px",
  display: "flex",
  flexDirection: "column" as const,
  gap: "15px",
  width: "320px",
};

const title = {
  color: "white",
  textAlign: "center" as const,
};

const input = {
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #334155",
};

const button = {
  padding: "12px",
  background: "#22c55e",
  border: "none",
  borderRadius: "8px",
  color: "white",
  cursor: "pointer",
};

const error = {
  color: "#dc2626",
};

const success = {
  color: "#16a34a",
};