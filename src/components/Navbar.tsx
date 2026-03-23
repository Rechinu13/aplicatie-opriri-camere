"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { getCurrentUserRole } from "@/lib/authHelpers";

export default function Navbar() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState("");
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const loadUserData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user?.email) {
        setUserEmail(user.email);
      } else {
        setUserEmail("");
      }

      const role = await getCurrentUserRole();
      setUserRole(role);
    };

    loadUserData();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user?.email) {
        setUserEmail(session.user.email);
      } else {
        setUserEmail("");
      }

      const role = await getCurrentUserRole();
      setUserRole(role);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUserEmail("");
    setUserRole(null);
    router.push("/login");
  };

  return (
    <header
      style={{
        width: "100%",
        borderBottom: "1px solid #e5e7eb",
        background: "linear-gradient(90deg, #f8fafc 0%, #eef2ff 100%)",
        padding: "18px 0",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "20px",
          flexWrap: "wrap",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            fontSize: "20px",
            fontWeight: "bold",
            color: "#1e293b",
            minWidth: "180px",
          }}
        >
          QC Stop Tracker
        </div>

        <nav
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "12px",
            flexWrap: "wrap",
            flex: 1,
          }}
        >
          <Link href="/" style={linkStyle}>
            Acasă
          </Link>

          {userRole && (
            <Link href="/dashboard" style={linkStyle}>
              Dashboard
            </Link>
          )}

          {(userRole === "operator" || userRole === "supervisor" || userRole === "admin") && (
            <Link href="/opriri" style={linkStyle}>
              Opriri
            </Link>
          )}

          {(userRole === "supervisor" || userRole === "admin") && (
            <Link href="/supervisor" style={linkStyle}>
              Supervisor
            </Link>
          )}

          {userRole === "admin" && (
            <Link href="/admin" style={linkStyle}>
              Admin
            </Link>
          )}

          {!userEmail && (
            <>
              <Link href="/login" style={linkStyle}>
                Login
              </Link>
              <Link href="/register" style={registerLinkStyle}>
                Register
              </Link>
            </>
          )}
        </nav>

        <div
          style={{
            minWidth: "220px",
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          {userEmail && (
            <>
              <span
                style={{
                  backgroundColor: "#dbeafe",
                  color: "#1e3a8a",
                  padding: "8px 12px",
                  borderRadius: "999px",
                  fontSize: "14px",
                  fontWeight: 600,
                }}
              >
                {userEmail}
              </span>

              {userRole && (
                <span
                  style={{
                    backgroundColor: "#ede9fe",
                    color: "#5b21b6",
                    padding: "8px 12px",
                    borderRadius: "999px",
                    fontSize: "14px",
                    fontWeight: 600,
                    textTransform: "capitalize",
                  }}
                >
                  {userRole}
                </span>
              )}

              <button onClick={handleLogout} style={logoutButtonStyle}>
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

const linkStyle = {
  textDecoration: "none",
  color: "#334155",
  fontWeight: 600,
  padding: "10px 14px",
  borderRadius: "10px",
  backgroundColor: "transparent",
};

const registerLinkStyle = {
  textDecoration: "none",
  color: "white",
  fontWeight: 700,
  padding: "10px 16px",
  borderRadius: "10px",
  backgroundColor: "#2563eb",
};

const logoutButtonStyle = {
  padding: "10px 16px",
  backgroundColor: "#0f172a",
  color: "white",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: 600,
};