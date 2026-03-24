"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Oprire = {
  id: number;
  stop_date: string;
  stop_time: string;
  shift: string;
  machine: string;
  operator_name: string;
  reason: string;
  details: string;
};

export default function OpririPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [data, setData] = useState("");
  const [ora, setOra] = useState("");
  const [schimb, setSchimb] = useState("Schimb 1");
  const [masina, setMasina] = useState("");
  const [operator, setOperator] = useState("");
  const [motiv, setMotiv] = useState("");
  const [detalii, setDetalii] = useState("");

  const [opriri, setOpriri] = useState<Oprire[]>([]);
  const [mesaj, setMesaj] = useState("");

  const fetchOpriri = async () => {
    const { data } = await supabase
      .from("assembly_stops")
      .select("*")
      .order("id", { ascending: false });

    setOpriri(data || []);
  };

  useEffect(() => {
    const init = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setUser(session?.user || null);

      if (session?.user) {
        await fetchOpriri();
      }

      setLoading(false);
    };

    init();
  }, []);

  const handleSave = async () => {
    if (!data || !ora || !masina || !operator || !motiv) {
      setMesaj("Completează toate câmpurile!");
      return;
    }

    await supabase.from("assembly_stops").insert([
      {
        stop_date: data,
        stop_time: ora,
        shift: schimb,
        machine: masina,
        operator_name: operator,
        reason: motiv,
        details: detalii,
      },
    ]);

    setMesaj("Salvat ✔️");

    setData("");
    setOra("");
    setMasina("");
    setOperator("");
    setMotiv("");
    setDetalii("");

    await fetchOpriri();
  };

  if (loading) return <p>Se încarcă...</p>;

  if (!user) {
    return (
      <div style={{ padding: "40px" }}>
        <h1>Nu ești logat</h1>
        <p>Mergi la login.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "40px", maxWidth: "900px", margin: "auto" }}>
      <h1>Opriri</h1>

      {/* FORMULAR */}
      <div style={{ marginBottom: "30px" }}>
        <input type="date" value={data} onChange={(e) => setData(e.target.value)} />
        <input type="time" value={ora} onChange={(e) => setOra(e.target.value)} />

        <select value={schimb} onChange={(e) => setSchimb(e.target.value)}>
          <option>Schimb 1</option>
          <option>Schimb 2</option>
          <option>Schimb 3</option>
        </select>

        <input placeholder="Mașină" value={masina} onChange={(e) => setMasina(e.target.value)} />
        <input placeholder="Operator" value={operator} onChange={(e) => setOperator(e.target.value)} />
        <input placeholder="Motiv" value={motiv} onChange={(e) => setMotiv(e.target.value)} />

        <textarea
          placeholder="Detalii"
          value={detalii}
          onChange={(e) => setDetalii(e.target.value)}
        />

        <button onClick={handleSave}>Adaugă</button>

        {mesaj && <p>{mesaj}</p>}
      </div>

      {/* LISTĂ */}
      {opriri.map((o) => (
        <div key={o.id} style={{ marginBottom: "10px", borderBottom: "1px solid #ccc" }}>
          <strong>{o.machine}</strong> — {o.reason}
        </div>
      ))}
    </div>
  );
}