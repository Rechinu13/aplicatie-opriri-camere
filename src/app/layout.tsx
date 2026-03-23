import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Aplicatie Opriri Camere",
  description: "Monitorizare opriri masini de asamblare",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ro">
      <body>
        <Navbar />
        <div style={{ padding: "30px" }}>{children}</div>
      </body>
    </html>
  );
}