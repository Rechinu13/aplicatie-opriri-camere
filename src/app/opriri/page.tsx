"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { getUserWithRole } from "@/lib/getUser";
import { Wrench, User, Calendar, Clock } from "lucide-react";

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
  const [userRole, setUserRole] = useState<string | null>(null);
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
    const result = await getUserWithRole();

    if (!result) {
      setUser(null);
      setLoading(false);
      return;
    }

    setUser(result.user);
    setUserRole(result.role);

    await fetchOpriri();
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
    <h1 style={{ marginBottom: "20px" }}>Opriri</h1>

    {/* 🧾 FORMULAR */}
    <div className="card">
      <h3>Adaugă oprire</h3>

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

    {/* 📋 LISTA */}
    <div className="card" style={{ marginTop: "20px" }}>
      <h3>Opriri existente</h3>

      {opriri.length === 0 ? (
        <p>Nu există opriri</p>
      ) : (
        opriri.map((o) => (
          <div
            key={o.id}
            style={{
              padding: "10px",
              borderBottom: "1px solid #e2e8f0",
            }}
          >
           <div style={{ display: "flex", justifyContent: "space-between" }}>
  <div>
    <p style={{ margin: 0, fontWeight: 600 }}>
      <Wrench size={16} style={{ marginRight: "6px" }} />
      {o.machine}
    </p>

    <p style={{ margin: "4px 0", color: "#475569" }}>
      {o.reason}
    </p>

    <p style={{ margin: 0, fontSize: "12px", color: "#64748b" }}>
      <Calendar size={12} /> {o.stop_date} &nbsp;
      <Clock size={12} /> {o.stop_time}
    </p>
  </div>

  <div style={{
    background: "#fee2e2",
    color: "#991b1b",
    padding: "6px 10px",
    borderRadius: "999px",
    fontSize: "12px",
    height: "fit-content"
  }}>
    STOP
  </div>
</div>
);
}