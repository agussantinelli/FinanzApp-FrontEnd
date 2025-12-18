import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ClientBackground from "@/components/ClientBackground";

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

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
      <body className={`${styles.body} ${roboto.className}`}>
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
