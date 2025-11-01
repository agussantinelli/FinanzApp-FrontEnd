import type { Metadata } from "next";
import "@/app/styles/globals.css";
import Providers from "@/components/Providers";
import NeonParticlesBg from "@/components/NeonParticlesBg";

export const metadata: Metadata = { title: "FinanzApp", description: "Gestión financiera" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <NeonParticlesBg />
        <Providers>
          <main style={{ position: "relative", zIndex: 1 }}>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
