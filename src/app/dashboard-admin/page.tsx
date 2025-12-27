"use client";

import * as React from "react";
import {
  Box,
  Paper,
  Typography,
  Stack,
  Chip,
  Button,
  Tabs,
  Tab,
} from "@mui/material";
import { useAuth } from "@/hooks/useAuth";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { RolUsuario } from "@/types/Usuario";
import RefreshIcon from '@mui/icons-material/Refresh';
import PersonIcon from '@mui/icons-material/Person';
import DescriptionIcon from '@mui/icons-material/Description';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import DashboardIcon from '@mui/icons-material/Dashboard';
import StarIcon from '@mui/icons-material/Star';
import PieChartIcon from '@mui/icons-material/PieChart';

import styles from "./styles/Admin.module.css";
import { TabPanelProps } from "@/types/ComponentProps";

// Components
import ResumenTab from "./components/ResumenTab";
import UsuariosTab from "./components/UsuariosTab";
import OperacionesTab from "./components/OperacionesTab";
import ActivosTab from "./components/ActivosTab";
import RecomendacionesTab from "./components/RecomendacionesTab";
import PortafolioTab from "./components/PortafolioTab";

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 0 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [tabValue, setTabValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const reloadPage = () => {
    window.location.reload();
  };

  return (
    <RoleGuard allowedRoles={[RolUsuario.Admin]}>
      <Box className={styles.container}>

        {/* Header */}
        <Paper className={styles.headerPaper}>
          <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems="center" spacing={2}>
            <Box>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="h4" className={styles.headerTitle}>
                  Panel Administrador
                </Typography>
                <Chip label="Admin" size="small" color="secondary" className={styles.adminChip} />
              </Stack>
              <Typography variant="body2" color="text.secondary" mt={0.5}>
                Bienvenido, {user?.nombre}. Gestiona usuarios, activos y monitorea operaciones.
              </Typography>
            </Box>
            <Button startIcon={<RefreshIcon />} onClick={reloadPage} variant="outlined" color="inherit">
              Recargar
            </Button>
          </Stack>
        </Paper>

        {/* Tabs */}
        <Box className={styles.tabBox}>
          <Tabs value={tabValue} onChange={handleChange} aria-label="admin tabs" textColor="secondary" indicatorColor="secondary">
            <Tab icon={<DashboardIcon />} iconPosition="start" label="Resumen" />
            <Tab icon={<PersonIcon />} iconPosition="start" label="Usuarios" />
            <Tab icon={<DescriptionIcon />} iconPosition="start" label="Operaciones" />
            <Tab icon={<AttachMoneyIcon />} iconPosition="start" label="Activos" />
            <Tab icon={<PieChartIcon />} iconPosition="start" label="Portafolios" />
            <Tab icon={<StarIcon />} iconPosition="start" label="Recomendaciones" />
          </Tabs>
        </Box>

        {/* Tab Content */}
        <CustomTabPanel value={tabValue} index={0}>
          <ResumenTab />
        </CustomTabPanel>

        <CustomTabPanel value={tabValue} index={1}>
          <UsuariosTab />
        </CustomTabPanel>

        <CustomTabPanel value={tabValue} index={2}>
          <OperacionesTab />
        </CustomTabPanel>

        <CustomTabPanel value={tabValue} index={3}>
          <ActivosTab />
        </CustomTabPanel>

        <CustomTabPanel value={tabValue} index={4}>
          <PortafolioTab />
        </CustomTabPanel>

        <CustomTabPanel value={tabValue} index={5}>
          <RecomendacionesTab />
        </CustomTabPanel>

      </Box >
    </RoleGuard >
  );
}
