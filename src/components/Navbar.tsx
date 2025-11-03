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
  //{ label: "Movimientos", href: "/movimientos" },
  { label: "Activos", href: "/activos" },
  { label: "Noticias", href: "/noticias" }, 
  { label: "Reportes", href: "/reportes" },
];

export default function Navbar() {
  const [open, setOpen] = React.useState(false);
  const toggle = (v: boolean) => () => setOpen(v);

  return (
    <>
      <AppBar position="sticky" elevation={0}>
        <Toolbar
          sx={{
            minHeight: { xs: 84, md: 96 }, 
            px: { xs: 2, md: 3 },
            backdropFilter: "blur(6px)",
            bgcolor: "rgba(0,0,0,0.45)",
          }}
        >
          <Box
            component={Link}
            href="/"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              textDecoration: "none",
              color: "inherit",
              cursor: "pointer",
            }}
          >
            <Image
              src="/favicon.png"             
              alt="FinanzApp"
              width={87}                      
              height={48}
              style={{ borderRadius: 12 }}
              priority
            />
            <Typography
              variant="h4"                    
              sx={{
                fontWeight: 800,
                letterSpacing: 0.6,
                fontSize: { xs: "1.6rem", sm: "1.9rem", md: "2.1rem" },
                lineHeight: 1,
              }}
            >
              FinanzApp
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1.2 }}>
            {navItems.map((item) => (
              <Button
                key={item.href}
                component={Link}
                href={item.href}
                color="inherit"
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "1rem",
                  px: 2,
                }}
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
          sx={{ width: 280, mt: 2 }}
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
