import type { Metadata } from "next";
import "@/app/styles/globals.css";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NeonParticlesBg from "@/components/NeonParticlesBg";

export const metadata: Metadata = {
  title: "FinanzApp",
  description: "Gestión financiera personal",
  icons: {
    icon: [{ url: "/logo.png" }], 
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body style={{ margin: 0 }}>
        <NeonParticlesBg />
        <Providers>
          <Navbar />
          <main
            style={{
              position: "relative",
              zIndex: 1,
              minHeight: "calc(100svh - 72px)",
            }}
          >
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
