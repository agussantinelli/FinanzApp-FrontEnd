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
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

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
  const [userMenuAnchor, setUserMenuAnchor] =
    React.useState<null | HTMLElement>(null);

  const router = useRouter();

  React.useEffect(() => {
    const loadUser = () => {
      const u = getCurrentUser();
      setUser(u);
    };

    loadUser();

    const handler = () => loadUser();

    if (typeof window !== "undefined") {
      window.addEventListener("fa-auth-changed", handler);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("fa-auth-changed", handler);
      }
    };
  }, []);

  const isLogged = !!user;
  const isAdmin = user?.rol === "Admin";

  const navItems = React.useMemo(() => {
    if (!isLogged) return baseNavItems;
    if (isAdmin) return [{ label: "Dashboard", href: "/admin" }, ...baseNavItems];
    return [{ label: "Mi panel", href: "/dashboard" }, ...baseNavItems];
  }, [isLogged, isAdmin]);

  const defaultPanelHref = isAdmin ? "/admin" : "/dashboard";

  const handleLogout = () => {
    clearAuthSession();
    setUser(null); // por si acaso
    setUserMenuAnchor(null);
    router.push("/auth/login");
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setUserMenuAnchor(null);
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
          {/* Logo */}
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

          {/* Desktop nav */}
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
              <>
                <Button
                  color="inherit"
                  onClick={handleOpenUserMenu}
                  endIcon={<ArrowDropDownIcon />}
                  sx={{
                    textTransform: "none",
                    fontWeight: 600,
                    fontSize: "0.95rem",
                    px: 2,
                  }}
                >
                  {user.rol === "Admin" ? "Admin" : "Inversor"} •{" "}
                  <Box component="span" sx={{ ml: 0.7, fontWeight: 700 }}>
                    {user.nombre} {user.apellido}
                  </Box>
                </Button>

                <Menu
                  anchorEl={userMenuAnchor}
                  open={Boolean(userMenuAnchor)}
                  onClose={handleCloseUserMenu}
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  transformOrigin={{ vertical: "top", horizontal: "right" }}
                >
                  <MenuItem
                    onClick={() => {
                      handleCloseUserMenu();
                      router.push("/perfil");
                    }}
                  >
                    <ListItemIcon>
                      <AccountCircleIcon fontSize="small" />
                    </ListItemIcon>
                    Perfil
                  </MenuItem>

                  <MenuItem
                    onClick={() => {
                      handleCloseUserMenu();
                      router.push(defaultPanelHref);
                    }}
                  >
                    <ListItemIcon>
                      <DashboardIcon fontSize="small" />
                    </ListItemIcon>
                    Ir al panel
                  </MenuItem>

                  <Divider />

                  <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                      <LogoutIcon fontSize="small" />
                    </ListItemIcon>
                    Cerrar sesión
                  </MenuItem>
                </Menu>
              </>
            )}
          </Box>

          {/* Mobile toggle */}
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton color="inherit" onClick={toggle(true)} aria-label="menu">
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Drawer mobile */}
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
                <ListItemButton
                  onClick={() => {
                    handleLogout();
                  }}
                >
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
