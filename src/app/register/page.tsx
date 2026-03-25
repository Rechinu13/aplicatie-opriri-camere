"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function RegisterPage() {
  const router = useRouter();

  const [inviteCode, setInviteCode] = useState<string | null>(null);

  const [email, setEmail] = useState("");
  const [parola, setParola] = useState("");
  const [confirmareParola, setConfirmareParola] = useState("");
  const [mesaj, setMesaj] = useState("");
  const [eroare, setEroare] = useState("");

  // 🔥 luăm invite din URL (client only)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("invite");
    setInviteCode(code);
  }, []);

  const handleRegister = async () => {
    setEroare("");
    setMesaj("");

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

    await supabase.from("profiles").insert([
      {
        id: userId,
        email: email,
        role: "operator",
      },
    ]);

    // 🔥 ștergem invitația
    await supabase.from("invites").delete().eq("code", inviteCode);

    setMesaj("Cont creat. Se face login automat...");

// 🔥 AUTO LOGIN
const { error: loginError } = await supabase.auth.signInWithPassword({
  email,
  password: parola,
});

if (loginError) {
  setEroare("Cont creat, dar loginul automat a eșuat.");
  return;
}

// 🔥 REDIRECT
router.push("/dashboard");

  return (
    <div style={wrapper}>
      <div style={card}>
        <h1>Creare cont</h1>

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Parolă"
          value={parola}
          onChange={(e) => setParola(e.target.value)}
        />

        <input
          type="password"
          placeholder="Confirmă parola"
          value={confirmareParola}
          onChange={(e) => setConfirmareParola(e.target.value)}
        />

        {eroare && <p style={{ color: "red" }}>{eroare}</p>}
        {mesaj && <p style={{ color: "green" }}>{mesaj}</p>}

        <button onClick={handleRegister}>Creează cont</button>

        <Link href="/login">Înapoi la login</Link>
      </div>
    </div>
  );
}

const wrapper = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const card = {
  display: "flex",
  flexDirection: "column" as const,
  gap: "10px",
  padding: "30px",
  border: "1px solid #ccc",
  borderRadius: "10px",
};