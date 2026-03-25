"use client";

import { exportToExcel } from "@/lib/exportExcel";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { getUserWithRole } from "@/lib/getUser";
import Navbar from "@/components/Navbar";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const [opriri, setOpriri] = useState<any[]>([]);
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

  if (loading) return <p className="container">Se încarcă...</p>;
  if (!user) return <p className="container">Nu ești logat</p>;

  let filtered = opriri;

  if (startDate) filtered = filtered.filter(o => o.stop_date >= startDate);
  if (endDate) filtered = filtered.filter(o => o.stop_date <= endDate);
  if (selectedMachine) filtered = filtered.filter(o => o.machine === selectedMachine);

  const byDay: Record<string, number> = {};
  filtered.forEach(o => {
    byDay[o.stop_date] = (byDay[o.stop_date] || 0) + 1;
  });

  const chartData = Object.entries(byDay).map(([day, count]) => ({ day, count }));

  const uniqueMachines = [...new Set(opriri.map(o => o.machine))];

  return (
    <>
      <Navbar email={user.email} />

      <div className="container">
        <h1>Dashboard</h1>

        <button
          onClick={() => exportToExcel(filtered)}
          style={{ background: "#22c55e", marginBottom: "20px" }}
        >
          Export Excel
        </button>

        <div className="card" style={{ marginBottom: "20px" }}>
          <h3>Filtre</h3>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />

            <select value={selectedMachine} onChange={(e) => setSelectedMachine(e.target.value)}>
              <option value="">Toate mașinile</option>
              {uniqueMachines.map(m => <option key={m}>{m}</option>)}
            </select>
          </div>
        </div>

        <div className="card">
          <h3>Opriri pe zile</h3>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
}