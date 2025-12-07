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
  getHomePathForRole,
  type AuthUser,
} from "@/services/AuthService";

import styles from "./styles/Navbar.module.css";

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

  const navItems = React.useMemo(() => {
    if (!isLogged) return baseNavItems;
    // logueado: base + Mi portafolio
    return [...baseNavItems, { label: "Mi portafolio", href: "/portfolio" }];
  }, [isLogged]);

  const defaultPanelHref = getHomePathForRole(user?.rol ?? null);

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

  const logoHref = isLogged ? defaultPanelHref : "/";

  const roleLabel =
    user?.rol === "Admin"
      ? "Admin"
      : user?.rol === "Inversor"
        ? "Inversor"
        : user?.rol ?? "";

  return (
    <>
      <AppBar position="sticky" elevation={0} className={styles.appBar}>
        <Toolbar className={styles.toolbar}>
          <Box
            component={Link}
            href={logoHref}
            className={styles.logoLink}
          >
            <Image
              src="/favicon.png"
              alt="FinanzApp"
              width={87}
              height={48}
              className={styles.logoImage}
              priority
            />
            <Typography variant="h4" className={styles.logoText}>
              FinanzApp
            </Typography>
          </Box>

          <Box className={styles.flexGrow} />

          {/* Desktop nav */}
          <Box className={styles.desktopNav}>
            {navItems.map((item) => (
              <Button
                key={item.href}
                component={Link}
                href={item.href}
                color="inherit"
                className={styles.navButton}
              >
                {item.label}
              </Button>
            ))}

            <Divider
              orientation="vertical"
              flexItem
              className={styles.dividerVertical}
            />

            {!isLogged ? (
              <>
                <Button
                  component={Link}
                  href="/auth/login"
                  color="inherit"
                  className={styles.loginButton}
                >
                  Iniciar sesión
                </Button>
                <Button
                  component={Link}
                  href="/auth/register"
                  variant="contained"
                  className={styles.registerButton}
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
                  className={styles.userButton}
                >
                  {roleLabel} •{" "}
                  <Box component="span" className={styles.userNameSpan}>
                    {user!.nombre} {user!.apellido}
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

          <Box className={styles.mobileMenuIconBox}>
            <IconButton color="inherit" onClick={toggle(true)} aria-label="menu">
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer anchor="right" open={open} onClose={toggle(false)}>
        <Box
          role="presentation"
          className={styles.drawerContent}
          onClick={toggle(false)}
          onKeyDown={toggle(false)}
        >
          <Box className={styles.drawerHeader}>
            {isLogged ? (
              <>
                <Typography variant="subtitle2" color="text.secondary">
                  Sesión
                </Typography>
                <Typography variant="body1" className={styles.drawerUserName}>
                  {user!.nombre} {user!.apellido}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  className={styles.drawerRole}
                >
                  Rol: {user!.rol}
                </Typography>
              </>
            ) : (
              <Typography
                variant="body1"
                className={styles.drawerMenuTitle}
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

          <Divider className={styles.drawerDivider} />

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
