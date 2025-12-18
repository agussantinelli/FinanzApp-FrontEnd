"use client";

import "@/app/styles/globals.css";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "@/app-theme/theme";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
