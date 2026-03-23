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
  const [opriri, setOpriri] = useState<Oprire[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);

  const fetchOpriri = async () => {
    const { data, error } = await supabase
      .from("assembly_stops")
      .select("*")
      .order("id", { ascending: false });

    if (!error) {
      setOpriri(data || []);
    }
  };

  useEffect(() => {
    const init = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const user = session?.user;

      // 🔥 IMPORTANT: NU redirectăm aici → evităm loop
      if (!user) {
        setLoading(false);
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      let role = profile?.role;

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

  if (loading) {
    return <p style={{ padding: "20px" }}>Se încarcă...</p>;
  }

  if (!userRole) {
    return (
      <div style={{ padding: "20px" }}>
        <h1>Nu ești logat</h1>
        <p>Te rog intră în aplicație.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Opriri</h1>

      {opriri.length === 0 ? (
        <p>Nu există opriri.</p>
      ) : (
        opriri.map((o) => (
          <div key={o.id} style={{ marginBottom: "10px" }}>
            <strong>{o.machine}</strong> — {o.reason}
          </div>
        ))
      )}
    </div>
  );
}