"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { getUserWithRole } from "@/lib/getUser";

export default function AdminPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [search, setSearch] = useState("");
  const generateInvite = async () => {
  const code = Math.random().toString(36).substring(2, 10);

  await supabase.from("invites").insert([{ code }]);

  const link = `${window.location.origin}/register?invite=${code}`;

  navigator.clipboard.writeText(link);

  alert("Link copiat:\n" + link);
};
  const fetchUsers = async () => {
    const { data } = await supabase.from("profiles").select("*");
    setUsers(data || []);
  };

  useEffect(() => {
    const init = async () => {
      const result = await getUserWithRole();

      if (!result || result.role !== "admin") {
        setLoading(false);
        return;
      }

      setCurrentUser(result.user);
      await fetchUsers();
      setLoading(false);
    };

    init();
  }, []);

  const changeRole = async (id: string, role: string) => {
    await supabase.from("profiles").update({ role }).eq("id", id);
    fetchUsers();
  };
 
  const toggleActive = async (id: string, current: boolean) => {
    await supabase
      .from("profiles")
      .update({ is_active: !current })
      .eq("id", id);

    fetchUsers();
  };

  if (loading) return <p className="container">Se încarcă...</p>;

  if (!currentUser)
    return <p className="container">Nu ai acces</p>;

  const filteredUsers = users.filter((u) =>
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container">
      <h1 style={{ marginBottom: "20px" }}>Admin Panel</h1>
      <div style={{ marginBottom: "20px" }}>
  <button onClick={generateInvite}>
    Generează link invitație
  </button>
</div>
      {/* 🔍 SEARCH */}
      <div className="card">
        <input
          placeholder="Caută utilizator..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* 👥 USERS */}
      <div className="card">
        <h3>Utilizatori</h3>

        {filteredUsers.length === 0 ? (
          <p>Nu există utilizatori</p>
        ) : (
          filteredUsers.map((u) => (
            <div
              key={u.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "15px",
                marginBottom: "10px",
                background: "#0f172a",
                borderRadius: "10px",
                alignItems: "center",
              }}
            >
              <div>
                <p style={{ margin: 0, fontWeight: 600 }}>
                  {u.email}
                </p>

                <p style={{ margin: 0, fontSize: "12px", color: "#94a3b8" }}>
                  Rol: {u.role}
                </p>
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                {/* ROLE */}
                <select
                  value={u.role}
                  onChange={(e) => changeRole(u.id, e.target.value)}
                >
                  <option>operator</option>
                  <option>supervisor</option>
                  <option>admin</option>
                </select>

                {/* STATUS */}
                <button
                  onClick={() => toggleActive(u.id, u.is_active)}
                  style={{
                    background: u.is_active ? "#16a34a" : "#dc2626",
                  }}
                >
                  {u.is_active ? "Activ" : "Blocat"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}