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
import FloatingMessage from "@/components/ui/FloatingMessage";

import {
  getHomePathForRole,
} from "@/services/AuthService";
import { useAuth } from "@/hooks/useAuth";

import styles from "./styles/Navbar.module.css";

const unauthItems = [
  { label: "Inicio", href: "/" },
  { label: "Activos", href: "/activos" },
  { label: "Noticias", href: "/noticias" },
  { label: "Reportes", href: "/reportes" },
];

const authMoreItems = [
  { label: "Mis Operaciones", href: "/operaciones/me" },
  { label: "Noticias", href: "/noticias" },
  { label: "Reportes", href: "/reportes" },
];



export default function Navbar() {
  const [open, setOpen] = React.useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const [userMenuAnchor, setUserMenuAnchor] =
    React.useState<null | HTMLElement>(null);
  const [moreMenuAnchor, setMoreMenuAnchor] =
    React.useState<null | HTMLElement>(null);
  const [mounted, setMounted] = React.useState(false);
  const [logoutMessage, setLogoutMessage] = React.useState<string | null>(null);

  const router = useRouter();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const defaultPanelHref = getHomePathForRole(user?.rol ?? null);

  const { desktopItems, mobileItems } = React.useMemo(() => {
    if (!mounted || !isAuthenticated) {
      return { desktopItems: unauthItems, mobileItems: unauthItems };
    }

    // Auth items structure
    const mainItems = [
      { label: "Inicio", href: "/" },
      { label: "Dashboard", href: defaultPanelHref },
      { label: "Portafolio", href: "/portfolio" },
      { label: "Estrategias", href: "/estrategias" },
      { label: "Activos", href: "/activos" },
      { label: "Recomendaciones", href: "/recomendaciones" },
    ];

    return {
      desktopItems: mainItems,
      // For mobile drawer, we might want to flatten everything or keep same structure
      mobileItems: [...mainItems, ...authMoreItems],
    };
  }, [isAuthenticated, mounted, defaultPanelHref]);

  const handleLogout = () => {
    setLogoutMessage("Has cerrado sesión correctamente. ¡Hasta pronto!");
    setUserMenuAnchor(null);
    setTimeout(() => {
      logout();
    }, 1000);
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setUserMenuAnchor(null);
  };

  const handleOpenMoreMenu = (event: React.MouseEvent<HTMLElement>) => {
    setMoreMenuAnchor(event.currentTarget);
  };

  const handleCloseMoreMenu = () => {
    setMoreMenuAnchor(null);
  };

  const toggle = (v: boolean) => () => setOpen(v);

  // Logo links to Dashboard if logged in, else Home
  const logoHref = (mounted && isAuthenticated) ? defaultPanelHref : "/";

  const roleLabel =
    user?.rol === "Admin"
      ? "Admin"
      : user?.rol === "Inversor"
        ? "Inversor"
        : user?.rol ?? "";

  // Helper to safely render auth/unauth content
  const showAuthContent = mounted && isAuthenticated;

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
            {desktopItems.map((item) => (
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

            {showAuthContent && (
              <>
                <Button
                  color="inherit"
                  onClick={handleOpenMoreMenu}
                  endIcon={<ArrowDropDownIcon />}
                  className={styles.navButton}
                >
                  Más
                </Button>
                <Menu
                  anchorEl={moreMenuAnchor}
                  open={Boolean(moreMenuAnchor)}
                  onClose={handleCloseMoreMenu}
                  MenuListProps={{
                    'aria-labelledby': 'basic-button',
                  }}
                >
                  {authMoreItems.map((item) => (
                    <MenuItem
                      key={item.href}
                      component={Link}
                      href={item.href}
                      onClick={handleCloseMoreMenu}
                    >
                      {item.label}
                    </MenuItem>
                  ))}
                </Menu>
              </>
            )}

            <Divider
              orientation="vertical"
              flexItem
              className={styles.dividerVertical}
            />

            {!showAuthContent ? (
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
            {showAuthContent ? (
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
            {mobileItems.map((item) => (
              <ListItem key={item.href} disablePadding>
                <ListItemButton component={Link} href={item.href}>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>

          <Divider className={styles.drawerDivider} />

          {!showAuthContent ? (
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

      <FloatingMessage
        open={!!logoutMessage}
        message={logoutMessage}
        severity="success"
        onClose={() => setLogoutMessage(null)}
      />
    </>
  );
}
