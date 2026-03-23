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
  photo_name: string;
};

export default function OpririPage() {
  const [data, setData] = useState("");
  const [ora, setOra] = useState("");
  const [schimb, setSchimb] = useState("Schimb 1");
  const [masina, setMasina] = useState("");
  const [operator, setOperator] = useState("");
  const [motiv, setMotiv] = useState("");
  const [detalii, setDetalii] = useState("");
  const [pozaNume, setPozaNume] = useState("");
  const [opriri, setOpriri] = useState<Oprire[]>([]);
  const [eroare, setEroare] = useState("");
  const [mesaj, setMesaj] = useState("");
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchOpriri = async () => {
    const { data, error } = await supabase
      .from("assembly_stops")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      setEroare("Eroare la încărcarea opririlor.");
      return;
    }

    setOpriri(data || []);
  };

  useEffect(() => {
  const init = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const user = session?.user;

    // 👉 dacă NU e logat
    if (!user) {
      window.location.href = "/login";
      return;
    }

    // 👉 luăm profilul
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    let role = profile?.role;

    // 👉 dacă nu există profil → îl creăm
    if (!role) {
      await supabase.from("profiles").insert([
        {
          id: user.id,
          email: user.email,
          role: "operator",
        },
      ]);

      role = "operator";
    }

    setUserRole(role);

    await fetchOpriri();

    setLoading(false);
  };

  init();
}, []);

  const handleSave = async () => {
    if (!data || !ora || !schimb || !masina || !operator || !motiv) {
      setEroare("Te rog completează toate câmpurile obligatorii.");
      setMesaj("");
      return;
    }

    setEroare("");
    setMesaj("");

    const { error } = await supabase.from("assembly_stops").insert([
      {
        stop_date: data,
        stop_time: ora,
        shift: schimb,
        machine: masina,
        operator_name: operator,
        reason: motiv,
        details: detalii,
        photo_name: pozaNume,
      },
    ]);

    if (error) {
      setEroare("Nu s-a putut salva oprirea în baza de date.");
      return;
    }

    setMesaj("Oprirea a fost salvată cu succes.");
    setData("");
    setOra("");
    setSchimb("Schimb 1");
    setMasina("");
    setOperator("");
    setMotiv("");
    setDetalii("");
    setPozaNume("");

    await fetchOpriri();
  };

  const handleDelete = async (id: number) => {
    const { error } = await supabase.from("assembly_stops").delete().eq("id", id);

    if (error) {
      setEroare("Nu s-a putut șterge oprirea.");
      return;
    }

    await fetchOpriri();
  };

  if (loading) {
    return (
      <div style={pageContainer}>
        <p>Se încarcă...</p>
      </div>
    );
  }

  if (userRole !== "operator" && userRole !== "supervisor" && userRole !== "admin") {
    return (
      <div style={pageContainer}>
        <div style={heroCard}>
          <h1 style={titleStyle}>Acces interzis</h1>
          <p style={subtitleStyle}>
            Trebuie să fii autentificat pentru a accesa această pagină.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={pageContainer}>
      <div style={heroCard}>
        <div>
          <h1 style={titleStyle}>Înregistrare oprire</h1>
          <p style={subtitleStyle}>
            Completează opririle mașinilor de asamblare și păstrează istoricul
            problemelor raportate.
          </p>
        </div>

        <div style={infoBadge}>Total înregistrări: {opriri.length}</div>
      </div>

      <div style={contentGrid}>
        <div style={formCard}>
          <h2 style={sectionTitle}>Adaugă o oprire nouă</h2>

          <div style={formGrid}>
            <div>
              <label style={labelStyle}>Data</label>
              <input
                type="date"
                value={data}
                onChange={(e) => setData(e.target.value)}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Ora</label>
              <input
                type="time"
                value={ora}
                onChange={(e) => setOra(e.target.value)}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Schimb</label>
              <select
                value={schimb}
                onChange={(e) => setSchimb(e.target.value)}
                style={inputStyle}
              >
                <option>Schimb 1</option>
                <option>Schimb 2</option>
                <option>Schimb 3</option>
              </select>
            </div>

            <div>
              <label style={labelStyle}>Mașină</label>
              <input
                type="text"
                placeholder="Ex: ASM-01"
                value={masina}
                onChange={(e) => setMasina(e.target.value)}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Operator</label>
              <input
                type="text"
                placeholder="Numele operatorului"
                value={operator}
                onChange={(e) => setOperator(e.target.value)}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Motiv</label>
              <input
                type="text"
                placeholder="Ex: Camera nefuncțională"
                value={motiv}
                onChange={(e) => setMotiv(e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>

          <div style={{ marginTop: "18px" }}>
            <label style={labelStyle}>Detalii</label>
            <textarea
              placeholder="Descriere mai detaliată"
              value={detalii}
              onChange={(e) => setDetalii(e.target.value)}
              style={textareaStyle}
            />
          </div>

          <div style={{ marginTop: "18px" }}>
            <label style={labelStyle}>Poză</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setPozaNume(file.name);
                } else {
                  setPozaNume("");
                }
              }}
              style={fileInputStyle}
            />

            {pozaNume && (
              <p style={selectedFileText}>
                Poză selectată: <strong>{pozaNume}</strong>
              </p>
            )}
          </div>

          {eroare && <p style={errorText}>{eroare}</p>}
          {mesaj && <p style={successText}>{mesaj}</p>}

          <button onClick={handleSave} style={primaryButton}>
            Adaugă oprire
          </button>
        </div>

        <div style={listCard}>
          <h2 style={sectionTitle}>Opriri introduse</h2>

          {opriri.length === 0 ? (
            <p style={emptyText}>Nu există opriri introduse momentan.</p>
          ) : (
            <div style={listWrapper}>
              {opriri.map((oprire) => (
                <div key={oprire.id} style={entryCard}>
                  <div style={entryHeader}>
                    <div>
                      <h3 style={entryTitle}>{oprire.machine}</h3>
                      <p style={entrySubtitle}>
                        {oprire.stop_date} • {oprire.stop_time} • {oprire.shift}
                      </p>
                    </div>

                    <span style={reasonBadge}>{oprire.reason}</span>
                  </div>

                  <div style={detailsGrid}>
                    <div>
                      <p style={fieldLabel}>Operator</p>
                      <p style={fieldValue}>{oprire.operator_name}</p>
                    </div>

                    <div>
                      <p style={fieldLabel}>Poză</p>
                      <p style={fieldValue}>{oprire.photo_name || "Fără poză"}</p>
                    </div>
                  </div>

                  <div style={{ marginTop: "14px" }}>
                    <p style={fieldLabel}>Detalii</p>
                    <p style={detailsText}>
                      {oprire.details || "Fără detalii suplimentare."}
                    </p>
                  </div>

                  {userRole === "admin" && (
                    <button
                      onClick={() => handleDelete(oprire.id)}
                      style={deleteButton}
                    >
                      Șterge
                    </button>
                  )}
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
  maxWidth: "1200px",
  margin: "40px auto",
  padding: "0 20px",
};

const heroCard = {
  background: "linear-gradient(135deg, #ecfeff 0%, #eef2ff 100%)",
  border: "1px solid #dbeafe",
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
  maxWidth: "720px",
};

const infoBadge = {
  backgroundColor: "#dcfce7",
  color: "#166534",
  padding: "10px 16px",
  borderRadius: "999px",
  fontWeight: 700,
};

const contentGrid = {
  display: "grid",
  gridTemplateColumns: "1.1fr 0.9fr",
  gap: "22px",
  marginTop: "28px",
};

const formCard = {
  border: "1px solid #e5e7eb",
  borderRadius: "22px",
  padding: "24px",
  backgroundColor: "#ffffff",
  boxShadow: "0 8px 20px rgba(0,0,0,0.04)",
};

const listCard = {
  border: "1px solid #e5e7eb",
  borderRadius: "22px",
  padding: "24px",
  backgroundColor: "#ffffff",
  boxShadow: "0 8px 20px rgba(0,0,0,0.04)",
};

const sectionTitle = {
  marginTop: 0,
  marginBottom: "18px",
  color: "#0f172a",
};

const formGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: "16px",
};

const labelStyle = {
  display: "block",
  marginBottom: "6px",
  color: "#334155",
  fontWeight: 600,
};

const inputStyle = {
  width: "100%",
  padding: "11px 12px",
  borderRadius: "12px",
  border: "1px solid #cbd5e1",
  outline: "none",
  fontSize: "14px",
  backgroundColor: "#fff",
};

const textareaStyle = {
  width: "100%",
  padding: "12px",
  borderRadius: "12px",
  border: "1px solid #cbd5e1",
  outline: "none",
  fontSize: "14px",
  minHeight: "120px",
  resize: "vertical" as const,
  backgroundColor: "#fff",
};

const fileInputStyle = {
  width: "100%",
  padding: "10px",
  borderRadius: "12px",
  border: "1px solid #cbd5e1",
  backgroundColor: "#fff",
};

const selectedFileText = {
  marginTop: "10px",
  color: "#475569",
};

const primaryButton = {
  marginTop: "18px",
  width: "100%",
  padding: "14px 18px",
  backgroundColor: "#0f766e",
  color: "white",
  border: "none",
  cursor: "pointer",
  borderRadius: "12px",
  fontWeight: 700,
  fontSize: "15px",
  boxShadow: "0 8px 18px rgba(15,118,110,0.25)",
};

const errorText = {
  marginTop: "14px",
  color: "#dc2626",
  fontWeight: 600,
};

const successText = {
  marginTop: "14px",
  color: "#16a34a",
  fontWeight: 600,
};

const listWrapper = {
  display: "flex",
  flexDirection: "column" as const,
  gap: "16px",
  maxHeight: "900px",
  overflowY: "auto" as const,
  paddingRight: "4px",
};

const entryCard = {
  border: "1px solid #e2e8f0",
  borderRadius: "18px",
  padding: "18px",
  backgroundColor: "#f8fafc",
};

const entryHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "12px",
  flexWrap: "wrap" as const,
};

const entryTitle = {
  margin: 0,
  color: "#0f172a",
  fontSize: "18px",
};

const entrySubtitle = {
  margin: "6px 0 0 0",
  color: "#64748b",
  fontSize: "14px",
};

const reasonBadge = {
  backgroundColor: "#ede9fe",
  color: "#6d28d9",
  padding: "8px 12px",
  borderRadius: "999px",
  fontWeight: 700,
  fontSize: "13px",
};

const detailsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: "14px",
  marginTop: "16px",
};

const fieldLabel = {
  margin: 0,
  color: "#64748b",
  fontSize: "13px",
  fontWeight: 600,
};

const fieldValue = {
  margin: "6px 0 0 0",
  color: "#0f172a",
  fontWeight: 600,
};

const detailsText = {
  marginTop: "6px",
  marginBottom: 0,
  color: "#334155",
  lineHeight: 1.6,
};

const deleteButton = {
  marginTop: "16px",
  padding: "10px 14px",
  backgroundColor: "#dc2626",
  color: "white",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: 700,
};

const emptyText = {
  color: "#64748b",
  margin: 0,
};