"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { getUserWithRole } from "@/lib/getUser";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type Oprire = {
  id: number;
  stop_date: string;
  machine: string;
  reason: string;
};

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const [opriri, setOpriri] = useState<Oprire[]>([]);
  const [loading, setLoading] = useState(true);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedMachine, setSelectedMachine] = useState("");

  useEffect(() => {
    const init = async () => {
      const result = await getUserWithRole();

      if (!result) {
        setLoading(false);
        return;
      }

      setUser(result.user);
      setRole(result.role);

      const { data } = await supabase
        .from("assembly_stops")
        .select("*");

      setOpriri(data || []);
      setLoading(false);
    };

    init();
  }, []);

  if (loading) return <p>Se încarcă...</p>;
  if (!user) return <p>Nu ești logat</p>;

  // 🔥 FILTRARE
  let filtered = opriri;

  if (startDate) {
    filtered = filtered.filter((o) => o.stop_date >= startDate);
  }

  if (endDate) {
    filtered = filtered.filter((o) => o.stop_date <= endDate);
  }

  if (selectedMachine) {
    filtered = filtered.filter((o) => o.machine === selectedMachine);
  }

  // 📊 GRAFICE
  const byDay: Record<string, number> = {};
  filtered.forEach((o) => {
    byDay[o.stop_date] = (byDay[o.stop_date] || 0) + 1;
  });

  const chartDataDays = Object.entries(byDay).map(([day, count]) => ({
    day,
    count,
  }));

  const byMachine: Record<string, number> = {};
  filtered.forEach((o) => {
    byMachine[o.machine] = (byMachine[o.machine] || 0) + 1;
  });

  const chartDataMachines = Object.entries(byMachine).map(
    ([machine, count]) => ({
      machine,
      count,
    })
  );

  const total = filtered.length;

  const topMachine =
    chartDataMachines.sort((a, b) => b.count - a.count)[0]?.machine || "-";

  const reasons: Record<string, number> = {};
  filtered.forEach((o) => {
    reasons[o.reason] = (reasons[o.reason] || 0) + 1;
  });

  const topReason =
    Object.entries(reasons).sort((a, b) => b[1] - a[1])[0]?.[0] || "-";

  const uniqueMachines = [...new Set(opriri.map((o) => o.machine))];

  return (
    <div style={{ padding: "40px", maxWidth: "1100px", margin: "auto" }}>
      <h1 style={{ marginBottom: "30px" }}>Dashboard</h1>

      {/* 🔥 FILTRE */}
      <div className="card" style={{ marginBottom: "30px" }}>
        <h3>Filtre</h3>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />

          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />

          <select
            value={selectedMachine}
            onChange={(e) => setSelectedMachine(e.target.value)}
          >
            <option value="">Toate mașinile</option>
            {uniqueMachines.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 📊 STATS */}
      <div style={{ display: "flex", gap: "20px", marginBottom: "30px" }}>
        <div className="card">
          <p>Total opriri</p>
          <h2>{total}</h2>
        </div>

        <div className="card">
          <p>Top mașină</p>
          <h2>{topMachine}</h2>
        </div>

        <div className="card">
          <p>Top motiv</p>
          <h2>{topReason}</h2>
        </div>
      </div>

      {/* 📈 GRAFIC ZILE */}
      <div className="card" style={{ marginBottom: "30px" }}>
        <h3>Opriri pe zile</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartDataDays}>
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 📊 GRAFIC MASINI */}
      <div className="card">
        <h3>Opriri pe mașini</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartDataMachines}>
            <XAxis dataKey="machine" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}