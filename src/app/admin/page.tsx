"use client";

import * as React from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Stack,
  Chip,
  Divider,
  Button,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  IconButton,
  CircularProgress
} from "@mui/material";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getCurrentUser, type AuthUser } from "@/services/AuthService";
import {
  getDashboardStats,
  getUsers,
  getAllOperations,
  DashboardStats,
  UserDTO
} from "@/services/AdminService";
import { OperacionResponseDTO } from "@/types/Operacion";
import RefreshIcon from '@mui/icons-material/Refresh';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';
import DescriptionIcon from '@mui/icons-material/Description';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { getActivosNoMoneda } from "@/services/ActivosService";
import { ActivoDTO } from "@/types/Activo";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

import styles from "./styles/Admin.module.css";


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
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [user, setUser] = React.useState<AuthUser | null>(null);
  const [checking, setChecking] = React.useState(true);

  const [tabValue, setTabValue] = React.useState(0);
  const [stats, setStats] = React.useState<DashboardStats | null>(null);
  const [users, setUsers] = React.useState<UserDTO[]>([]);
  const [operations, setOperations] = React.useState<OperacionResponseDTO[]>([]);
  const [activos, setActivos] = React.useState<ActivoDTO[]>([]);
  const [loadingData, setLoadingData] = React.useState(false);

  React.useEffect(() => {
    const u = getCurrentUser();
    if (!u) {
      router.replace("/auth/login");
      return;
    }
    if (u.rol !== "Admin") {
      router.replace("/access-denied");
      return;
    }
    setUser(u);
    setChecking(false);
  }, [router]);

  const loadData = React.useCallback(async () => {
    setLoadingData(true);
    try {
      const [statsData, usersData, opsData, activosData] = await Promise.all([
        getDashboardStats(),
        getUsers(),
        getAllOperations(),
        getActivosNoMoneda()
      ]);
      setStats(statsData);
      setUsers(usersData);
      setOperations(opsData);
      setActivos(activosData);
    } catch (error) {
      console.error("Error loading admin data:", error);
    } finally {
      setLoadingData(false);
    }
  }, []);

  React.useEffect(() => {
    if (!checking && user) {
      loadData();
    }
  }, [checking, user, loadData]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  if (checking || !user) {
    return (
      <Box className={styles.loadingContainer}>
        <CircularProgress color="secondary" />
      </Box>
    );
  }

  return (
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
              Bienvenido, {user.nombre}. Gestiona usuarios, activos y monitorea operaciones.
            </Typography>
          </Box>
          <Button startIcon={<RefreshIcon />} onClick={loadData} disabled={loadingData} variant="outlined" color="inherit">
            Actualizar Datos
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
        </Tabs>
      </Box>

      {/* DASHBOARD TAB */}
      <CustomTabPanel value={tabValue} index={0}>
        {loadingData && !stats ? (
          <CircularProgress />
        ) : stats ? (
          <Grid container spacing={3}>
            {/* KPI Cards */}
            <Grid item xs={12} sm={6} md={3}>
              <Paper className={styles.kpiPaper}>
                <Typography variant="caption" color="text.secondary">Total Usuarios</Typography>
                <Typography variant="h4" className={styles.kpiValue}>{stats.totalUsuarios}</Typography>
                <Typography variant="body2" color="success.main" className={styles.kpiChange}>
                  +{stats.usuariosHoy} hoy
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper className={styles.kpiPaper}>
                <Typography variant="caption" color="text.secondary">Operaciones Totales</Typography>
                <Typography variant="h4" className={styles.kpiValue}>{stats.totalOperaciones}</Typography>
                <Typography variant="body2" color="success.main" className={styles.kpiChange}>
                  +{stats.operacionesHoy} hoy
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper className={styles.kpiPaper}>
                <Typography variant="caption" color="text.secondary">Volumen (ARS)</Typography>
                <Typography variant="h5" className={styles.kpiValue}>${stats.volumenHoyArs.toLocaleString()}</Typography>
                <Typography variant="body2" color="text.secondary" mt={1}>Hoy</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper className={styles.kpiPaper}>
                <Typography variant="caption" color="text.secondary">Total Activos</Typography>
                <Typography variant="h4" className={styles.kpiValue}>{stats.totalActivos}</Typography>
                <Typography variant="body2" color="text.secondary" mt={1}>En sistema</Typography>
              </Paper>
            </Grid>

            {/* Recent Activity Placeholders */}
            <Grid item xs={12} md={6}>
              <Paper className={styles.sectionPaper}>
                <Typography variant="h6" className={styles.sectionTitle}>Distribución de Usuarios</Typography>
                <Divider className={styles.divider} />
                <Typography color="text.secondary" variant="body2">
                  Gráfico de distribución por rol o fecha de registro (Próximamente chart.js)
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper className={styles.sectionPaper}>
                <Typography variant="h6" className={styles.sectionTitle}>Últimos Registros</Typography>
                <Divider className={styles.divider} />
                <Stack spacing={1}>
                  {users.slice(0, 5).map(u => (
                    <Typography key={u.id} variant="body2">• {u.nombre} ({u.email}) se unió recientemente.</Typography>
                  ))}
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        ) : (
          <Typography>No se pudieron cargar las estadísticas.</Typography>
        )}
      </CustomTabPanel>

      {/* USUARIOS TAB */}
      <CustomTabPanel value={tabValue} index={1}>
        <TableContainer component={Paper} className={styles.tableContainer}>
          <Table>
            <TableHead className={styles.tableHead}>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Usuario</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Rol</TableCell>
                <TableCell>Fecha Registro</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell>#{row.id}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar sx={{ width: 24, height: 24 }}>{row.nombre[0]}</Avatar>
                      <Typography variant="body2" fontWeight={600}>{row.nombre}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>
                    <Chip label={row.rol} size="small" color={row.rol === 'Admin' ? 'secondary' : 'default'} variant="outlined" />
                  </TableCell>
                  <TableCell>{new Date(row.fechaRegistro).toLocaleDateString()}</TableCell>
                  <TableCell align="right">
                    <IconButton size="small"><EditIcon fontSize="small" /></IconButton>
                    <IconButton size="small" color="error"><DeleteIcon fontSize="small" /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CustomTabPanel>

      {/* OPERACIONES TAB */}
      <CustomTabPanel value={tabValue} index={2}>
        <TableContainer component={Paper} className={styles.tableContainer}>
          <Table>
            <TableHead className={styles.tableHead}>
              <TableRow>
                <TableCell>ID Op</TableCell>
                <TableCell>Usuario</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Activo</TableCell>
                <TableCell align="right">Cantidad</TableCell>
                <TableCell align="right">Precio</TableCell>
                <TableCell align="right">Total</TableCell>
                <TableCell>Fecha</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {operations.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell>#{row.id}</TableCell>
                  <TableCell>{row.personaNombre}</TableCell>
                  <TableCell>
                    <Chip
                      label={row.tipo}
                      size="small"
                      color={row.tipo === 'Compra' ? 'success' : 'error'}
                      variant="soft"
                      className={styles.chip}
                    />
                  </TableCell>
                  <TableCell>
                    <Stack>
                      <Typography variant="body2" fontWeight={600}>{row.activoSymbol}</Typography>
                      <Typography variant="caption" color="text.secondary">{row.activoNombre}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell align="right">{row.cantidad}</TableCell>
                  <TableCell align="right">${row.precioUnitario}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>${row.totalOperado.toLocaleString()}</TableCell>
                  <TableCell>{new Date(row.fecha).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CustomTabPanel>

      {/* ACTIVOS TAB */}
      <CustomTabPanel value={tabValue} index={3}>
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="contained" color="primary">Agregar Nuevo Activo</Button>
        </Box>
        <TableContainer component={Paper} className={styles.tableContainer}>
          <Table>
            <TableHead className={styles.tableHead}>
              <TableRow>
                <TableCell>Símbolo</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Moneda</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {activos.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell>
                    <Chip label={row.symbol} size="small" className={styles.chipSymbol} />
                  </TableCell>
                  <TableCell>{row.nombre}</TableCell>
                  <TableCell>{row.tipo}</TableCell>
                  <TableCell><Chip label={row.moneda} size="small" variant="outlined" /></TableCell>
                  <TableCell align="right">
                    <IconButton size="small"><EditIcon fontSize="small" /></IconButton>
                    <IconButton size="small" color="error"><DeleteIcon fontSize="small" /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CustomTabPanel>

    </Box>
  );
}
