import type { Metadata } from "next";
import "@/app/styles/globals.css";
import NeonParticlesBg from "@/components/NeonParticlesBg"; 

export const metadata: Metadata = { title: "FinanzApp", description: "Gestión financiera" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body style={{ margin: 0 }}>
        <NeonParticlesBg />
        <main
          style={{
            position: "relative",
            zIndex: 1,
            minHeight: "100svh",
            color: "#e5e7eb", 
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "32px",
          }}
        >
          {children}
        </main>
      </body>
    </html>
  );
}
