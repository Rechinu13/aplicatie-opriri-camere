"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { getUserWithRole } from "@/lib/getUser";

type Profile = {
  id: string;
  email: string;
  role: string;
};

export default function AdminPage() {
  const [role, setRole] = useState<string | null>(null);
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    const { data } = await supabase.from("profiles").select("*");
    setUsers(data || []);
  };

  useEffect(() => {
    const init = async () => {
      const result = await getUserWithRole();

      if (!result) {
        setLoading(false);
        return;
      }

      setRole(result.role);

      if (result.role === "admin") {
        await fetchUsers();
      }

      setLoading(false);
    };

    init();
  }, []);

  const updateRole = async (id: string, newRole: string) => {
    await supabase
      .from("profiles")
      .update({ role: newRole })
      .eq("id", id);

    await fetchUsers();
  };

  if (loading) return <p>Se încarcă...</p>;

  if (role !== "admin") {
    return <p>Acces interzis</p>;
  }

  return (
    <div style={{ padding: "40px", maxWidth: "900px", margin: "auto" }}>
      <h1>Admin Panel</h1>

      <div className="card">
        <h3>Utilizatori</h3>

        {users.map((u) => (
          <div
            key={u.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "10px",
              padding: "10px",
              borderBottom: "1px solid #334155",
            }}
          >
            <div>
              <p style={{ margin: 0 }}>{u.email}</p>
              <small>{u.id}</small>
            </div>

            <select
              value={u.role}
              onChange={(e) => updateRole(u.id, e.target.value)}
            >
              <option value="operator">Operator</option>
              <option value="supervisor">Supervisor</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}