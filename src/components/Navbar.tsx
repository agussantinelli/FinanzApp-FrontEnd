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
import Divider from "@mui/material/Divider";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  getCurrentUser,
  clearAuthSession,
  type AuthUser,
} from "@/services/AuthService";

const baseNavItems = [
  { label: "Inicio", href: "/" },
  { label: "Activos", href: "/activos" },
  { label: "Noticias", href: "/noticias" },
  { label: "Reportes", href: "/reportes" },
];

export default function Navbar() {
  const [open, setOpen] = React.useState(false);
  const [user, setUser] = React.useState<AuthUser | null>(null);
  const router = useRouter();

  React.useEffect(() => {
    const u = getCurrentUser();
    setUser(u);
  }, []);

  const isLogged = !!user;
  const isAdmin = user?.rol === "Admin";

  // Nav items según rol
  const navItems = React.useMemo(() => {
    if (!isLogged) return baseNavItems;

    if (isAdmin) {
      return [
        { label: "Dashboard", href: "/admin" },
        ...baseNavItems,
      ];
    }

    // Inversor
    return [
      { label: "Mi panel", href: "/dashboard" },
      ...baseNavItems,
    ];
  }, [isLogged, isAdmin]);

  const handleLogout = () => {
    clearAuthSession();
    router.push("/auth/login");
  };

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
          {/* LOGO / BRAND */}
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

          {/* DESKTOP NAV */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              gap: 1.2,
              alignItems: "center",
            }}
          >
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

            <Divider
              orientation="vertical"
              flexItem
              sx={{ mx: 1.5, borderColor: "rgba(255,255,255,0.2)" }}
            />

            {!isLogged ? (
              <>
                <Button
                  component={Link}
                  href="/auth/login"
                  color="inherit"
                  sx={{
                    textTransform: "none",
                    fontWeight: 600,
                    fontSize: "0.95rem",
                    px: 2,
                  }}
                >
                  Iniciar sesión
                </Button>
                <Button
                  component={Link}
                  href="/auth/register"
                  variant="contained"
                  sx={{
                    textTransform: "none",
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    px: 2.5,
                    borderRadius: 999,
                  }}
                >
                  Registrarse
                </Button>
              </>
            ) : (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  {user.rol === "Admin" ? "Admin" : "Inversor"} •{" "}
                  <strong>
                    {user.nombre} {user.apellido}
                  </strong>
                </Typography>
                <Button
                  color="inherit"
                  size="small"
                  onClick={handleLogout}
                  sx={{
                    textTransform: "none",
                    fontWeight: 600,
                    fontSize: "0.85rem",
                  }}
                >
                  Cerrar sesión
                </Button>
              </Box>
            )}
          </Box>

          {/* MOBILE NAV TOGGLE */}
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              color="inherit"
              onClick={toggle(true)}
              aria-label="menu"
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* DRAWER MOBILE */}
      <Drawer anchor="right" open={open} onClose={toggle(false)}>
        <Box
          role="presentation"
          sx={{ width: 280, mt: 2 }}
          onClick={toggle(false)}
          onKeyDown={toggle(false)}
        >
          <Box sx={{ px: 2, pb: 1 }}>
            {isLogged ? (
              <>
                <Typography variant="subtitle2" color="text.secondary">
                  Sesión
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 700 }}>
                  {user!.nombre} {user!.apellido}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  Rol: {user!.rol}
                </Typography>
              </>
            ) : (
              <Typography
                variant="body1"
                sx={{ fontWeight: 700, mb: 1, px: 0.5 }}
              >
                Menú
              </Typography>
            )}
          </Box>

          <List>
            {navItems.map((item) => (
              <ListItem key={item.href} disablePadding>
                <ListItemButton component={Link} href={item.href}>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>

          <Divider sx={{ my: 1 }} />

          {!isLogged ? (
            <List>
              <ListItem disablePadding>
                <ListItemButton component={Link} href="/auth/login">
                  <ListItemText primary="Iniciar sesión" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton component={Link} href="/auth/register">
                  <ListItemText primary="Registrarse" />
                </ListItemButton>
              </ListItem>
            </List>
          ) : (
            <List>
              <ListItem disablePadding>
                <ListItemButton onClick={handleLogout}>
                  <ListItemText primary="Cerrar sesión" />
                </ListItemButton>
              </ListItem>
            </List>
          )}
        </Box>
      </Drawer>
    </>
  );
}
