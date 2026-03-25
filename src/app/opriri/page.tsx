"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { getUserWithRole } from "@/lib/getUser";

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

    let photo_name = null;

    if (selectedFile) {
      const fileName = `${Date.now()}-${selectedFile.name}`;

      const { error } = await supabase.storage
        .from("poze")
        .upload(fileName, selectedFile);

      if (error) {
        setMesaj(error.message);
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
        photo_name: photo_name,
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

  if (loading) return <p className="container">Se încarcă...</p>;
  if (!user) return <p className="container">Nu ești logat</p>;
  const th = {
  padding: "10px",
  borderBottom: "1px solid #1e293b",
};

const td = {
  padding: "10px",
  borderBottom: "1px solid #1e293b",
};

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
        {/* FORMULAR */}
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

              <button onClick={handleSave}>Adaugă oprire</button>

              {mesaj && <p>{mesaj}</p>}
            </div>
          </div>
        )}
       

{/* TABEL */}
<div className="card">
  <h3>Opriri existente</h3>

  {opriri.length === 0 ? (
    <p>Nu există opriri</p>
  ) : (
    <table
      style={{
        width: "100%",
        marginTop: "15px",
        borderCollapse: "collapse",
      }}
    >
      <thead>
        <tr style={{ textAlign: "left", color: "#94a3b8" }}>
          <th style={th}>Data</th>
          <th style={th}>Ora</th>
          <th style={th}>Mașină</th>
          <th style={th}>Motiv</th>
          <th style={th}>Operator</th>
          <th style={th}>Poză</th>
          {role === "admin" && <th style={th}>Acțiuni</th>}
        </tr>
      </thead>

      <tbody>
        {opriri.map((o) => (
          <tr
            key={o.id}
            style={{ transition: "0.2s" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "#020617")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
          >
            <td style={td}>{o.stop_date}</td>
            <td style={td}>{o.stop_time}</td>
            <td style={td}>{o.machine}</td>
            <td style={td}>{o.reason}</td>
            <td style={td}>{o.operator_name}</td>

            <td style={td}>
              {o.photo_name ? (
                <img
                  src={
                    supabase.storage
                      .from("poze")
                      .getPublicUrl(o.photo_name).data.publicUrl
                  }
                  style={{
                    width: "60px",
                    borderRadius: "6px",
                    border: "1px solid #1e293b",
                  }}
                />
              ) : (
                "-"
              )}
            </td>

            {role === "admin" && (
              <td style={td}>
                <button
                  onClick={() => handleDelete(o.id)}
                  style={{
                    background: "#dc2626",
                    padding: "6px 10px",
                    borderRadius: "6px",
                  }}
                >
                  Șterge
                </button>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  )}
</div>
    </div>
  );
}