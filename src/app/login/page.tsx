"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [parola, setParola] = useState("");
  const [eroare, setEroare] = useState("");

  const handleLogin = async () => {
    setEroare("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: parola,
    });

    if (error) {
      setEroare(error.message);
      return;
    }

    window.location.href = "/dashboard";
  };

  return (
    <div style={{ padding: "40px", maxWidth: "400px", margin: "auto" }}>
      <h1>Login</h1>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ width: "100%", marginBottom: "10px", padding: "10px" }}
      />

      <input
        type="password"
        placeholder="Parolă"
        value={parola}
        onChange={(e) => setParola(e.target.value)}
        style={{ width: "100%", marginBottom: "10px", padding: "10px" }}
      />

      {eroare && <p style={{ color: "red" }}>{eroare}</p>}

      <button onClick={handleLogin} style={{ width: "100%", padding: "10px" }}>
        Login
      </button>
    </div>
  );
}