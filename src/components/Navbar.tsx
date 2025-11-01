"use client";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Link from "next/link";

export default function Navbar() {
  return (
    <AppBar position="static" color="transparent" elevation={0}>
      <Toolbar sx={{ maxWidth: 1080, mx: "auto", width: "100%" }}>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>
            FinanzApp
          </Link>
        </Typography>
        <Link href="/movimientos" style={{ textDecoration: "none" }}>
          Movimientos
        </Link>
      </Toolbar>
    </AppBar>
  );
}
