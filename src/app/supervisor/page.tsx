"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { getCurrentUserRole } from "@/lib/authHelpers";

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

export default function SupervisorPage() {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [opriri, setOpriri] = useState<Oprire[]>([]);

  useEffect(() => {
    const init = async () => {
      const currentRole = await getCurrentUserRole();
      setRole(currentRole);

      if (currentRole === "supervisor" || currentRole === "admin") {
        const { data, error } = await supabase
          .from("assembly_stops")
          .select("*")
          .order("id", { ascending: false });

        if (!error) {
          setOpriri(data || []);
        }
      }

      setLoading(false);
    };

    init();
  }, []);

  if (loading) {
    return <p>Se încarcă...</p>;
  }

  if (role !== "supervisor" && role !== "admin") {
    return (
      <div style={{ fontFamily: "Arial" }}>
        <h1>Acces interzis</h1>
        <p>Doar supervisorul sau adminul pot accesa această pagină.</p>
      </div>
    );
  }

  const totalOpriri = opriri.length;
  const opririCuPoza = opriri.filter((oprire) => oprire.photo_name).length;

  const schimburiCount: Record<string, number> = {};
  const motiveCount: Record<string, number> = {};
  const masiniCount: Record<string, number> = {};

  opriri.forEach((oprire) => {
    schimburiCount[oprire.shift] = (schimburiCount[oprire.shift] || 0) + 1;
    motiveCount[oprire.reason] = (motiveCount[oprire.reason] || 0) + 1;
    masiniCount[oprire.machine] = (masiniCount[oprire.machine] || 0) + 1;
  });

  const topSchimb =
    Object.keys(schimburiCount).length > 0
      ? Object.entries(schimburiCount).sort((a, b) => b[1] - a[1])[0][0]
      : "Niciunul";

  const topMotive = Object.entries(motiveCount).sort((a, b) => b[1] - a[1]);
  const topMasini = Object.entries(masiniCount).sort((a, b) => b[1] - a[1]);

  return (
    <div
  style={{
    fontFamily: "Arial, sans-serif",
    maxWidth: "1100px",
    margin: "40px auto",
    padding: "0 20px",
  }}
>
      <h1>Panou Supervisor</h1>
      <p>Aici superiorii pot vedea situația opririlor, fără drept de administrare utilizatori.</p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        <div style={{ border: "1px solid #ccc", borderRadius: "10px", padding: "20px" }}>
          <h3>Total opriri</h3>
          <p style={{ fontSize: "28px", margin: 0 }}>{totalOpriri}</p>
        </div>

        <div style={{ border: "1px solid #ccc", borderRadius: "10px", padding: "20px" }}>
          <h3>Top schimb</h3>
          <p style={{ fontSize: "28px", margin: 0 }}>{topSchimb}</p>
        </div>

        <div style={{ border: "1px solid #ccc", borderRadius: "10px", padding: "20px" }}>
          <h3>Opriri cu poză</h3>
          <p style={{ fontSize: "28px", margin: 0 }}>{opririCuPoza}</p>
        </div>
      </div>

      <div
        style={{
          marginTop: "25px",
          border: "1px solid #ccc",
          borderRadius: "10px",
          padding: "20px",
        }}
      >
        <h2>Top motive oprire</h2>
        {topMotive.length === 0 ? (
          <p>Nu există opriri introduse momentan.</p>
        ) : (
          topMotive.map(([motiv, count], index) => (
            <p key={motiv}>
              {index + 1}. {motiv} — {count} opriri
            </p>
          ))
        )}
      </div>

      <div
        style={{
          marginTop: "25px",
          border: "1px solid #ccc",
          borderRadius: "10px",
          padding: "20px",
        }}
      >
        <h2>Top mașini afectate</h2>
        {topMasini.length === 0 ? (
          <p>Nu există opriri introduse momentan.</p>
        ) : (
          topMasini.map(([masina, count], index) => (
            <p key={masina}>
              {index + 1}. {masina} — {count} opriri
            </p>
          ))
        )}
      </div>
    </div>
  );
}