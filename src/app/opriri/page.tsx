"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { getUserWithRole } from "@/lib/getUser";
import { Wrench, Calendar, Clock } from "lucide-react";

type Oprire = {
  id: number;
  stop_date: string;
  stop_time: string;
  shift: string;
  machine: string;
  operator_name: string;
  reason: string;
  details: string;
  photo_name?: string; // 🔥 FIX IMPORTANT
};

export default function OpririPage() {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [opriri, setOpriri] = useState<Oprire[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [data, setData] = useState("");
  const [ora, setOra] = useState("");
  const [schimb, setSchimb] = useState("Schimb 1");
  const [masina, setMasina] = useState("");
  const [operator, setOperator] = useState("");
  const [motiv, setMotiv] = useState("");
  const [detalii, setDetalii] = useState("");

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
        setLoading(false);
        return;
      }

      setUser(result.user);
      setRole(result.role);

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

    let photo_name: string | null = null;

    if (selectedFile) {
      const fileName = `${Date.now()}-${selectedFile.name}`;

      const { error } = await supabase.storage
        .from("poze")
        .upload(fileName, selectedFile);

      if (error) {
        setMesaj("Eroare upload poză");
        return;
      }

      photo_name = fileName;
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
        photo_name,
      },
    ]);

    setMesaj("Salvat ✔️");

    setData("");
    setOra("");
    setMasina("");
    setOperator("");
    setMotiv("");
    setDetalii("");
    setSelectedFile(null);

    await fetchOpriri();
  };

  const handleDelete = async (id: number) => {
    await supabase.from("assembly_stops").delete().eq("id", id);
    await fetchOpriri();
  };

  if (loading) return <p style={{ padding: "30px" }}>Se încarcă...</p>;

  if (!user) {
    return (
      <div style={{ padding: "40px" }}>
        <h1>Nu ești logat</h1>
      </div>
    );
  }

  return (
  <div className="container">
    <h1 style={{ marginBottom: "20px" }}>Opriri</h1>

    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "20px",
      }}
    >
      {/* 🔥 FORMULAR */}
      {role !== "supervisor" && (
        <div className="card">
          <h3>Adaugă oprire</h3>

          <div style={{ display: "grid", gap: "10px" }}>
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

            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  setSelectedFile(e.target.files[0]);
                }
              }}
            />

            <button
              onClick={handleSave}
              style={{
                background: "#22c55e",
                marginTop: "10px",
              }}
            >
              Adaugă oprire
            </button>

            {mesaj && <p>{mesaj}</p>}
          </div>
        </div>
      )}

      {/* 🔥 LISTA */}
      <div className="card">
        <h3>Opriri existente</h3>

        {opriri.length === 0 ? (
          <p>Nu există opriri</p>
        ) : (
          opriri.map((o) => (
            <div
              key={o.id}
              style={{
                marginBottom: "15px",
                padding: "15px",
                background: "#0f172a",
                borderRadius: "10px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                  <p style={{ margin: 0, fontWeight: 600 }}>{o.machine}</p>
                  <p style={{ margin: "5px 0", color: "#94a3b8" }}>{o.reason}</p>

                  <p style={{ fontSize: "12px", color: "#64748b" }}>
                    {o.stop_date} • {o.stop_time}
                  </p>

                  {o.details && <p>{o.details}</p>}

                  {o.photo_name && (
                    <img
                      src={
                        supabase.storage
                          .from("poze")
                          .getPublicUrl(o.photo_name).data.publicUrl
                      }
                      style={{
                        width: "150px",
                        marginTop: "10px",
                        borderRadius: "8px",
                      }}
                    />
                  )}
                </div>

                {role === "admin" && (
                  <button
                    onClick={() => handleDelete(o.id)}
                    style={{ background: "#dc2626" }}
                  >
                    Șterge
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  </div>
);
}