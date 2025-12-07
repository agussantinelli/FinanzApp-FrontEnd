import type { Metadata } from "next";
import "@/app/styles/globals.css";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ClientBackground from "@/components/ClientBackground";

export const metadata: Metadata = {
  title: "FinanzApp",
  description: "Gestión financiera personal",
  icons: {
    icon: [{ url: "/logo.png" }],
  },
};

import styles from "./styles/Layout.module.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={styles.body}>
        <ClientBackground />
        <Providers>
          <Navbar />
          <main className={styles.main}>
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
