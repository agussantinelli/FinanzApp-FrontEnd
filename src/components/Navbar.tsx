"use client";

import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import Image from "next/image";

const navItems = [
  { label: "Inicio", href: "/" },
  { label: "Movimientos", href: "/movimientos" },
  { label: "Categorías", href: "/categorias" },
  { label: "Reportes", href: "/reportes" },
];

export default function Navbar() {
  const [open, setOpen] = React.useState(false);
  const toggle = (v: boolean) => () => setOpen(v);

  return (
    <>
      <AppBar position="sticky" elevation={0}>
        <Toolbar sx={{ minHeight: 72 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Image
              src="/favicon.png"  
              alt="FinanzApp"
              width={32}
              height={32}
              style={{ borderRadius: 8 }}
              priority
            />
            <Typography variant="h6" sx={{ letterSpacing: 0.5 }}>
              FinanzApp
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1 }}>
            {navItems.map((item) => (
              <Button
                key={item.href}
                component={Link}
                href={item.href}
                color="inherit"
                sx={{ textTransform: "none", fontWeight: 500 }}
              >
                {item.label}
              </Button>
            ))}
          </Box>

          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton color="inherit" onClick={toggle(true)} aria-label="menu">
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer anchor="right" open={open} onClose={toggle(false)}>
        <Box
          role="presentation"
          sx={{ width: 260, mt: 2 }}
          onClick={toggle(false)}
          onKeyDown={toggle(false)}
        >
          <List>
            {navItems.map((item) => (
              <ListItem key={item.href} disablePadding>
                <ListItemButton component={Link} href={item.href}>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
}
