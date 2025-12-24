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
  CircularProgress,
  Skeleton
} from "@mui/material";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useAdminData } from "@/hooks/useAdminData";
import { usePortfolioData } from "@/hooks/usePortfolioData";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { AdminStatsDTO } from "@/types/Admin";
import { UserDTO, RolUsuario } from "@/types/Usuario";
import { OperacionResponseDTO } from "@/types/Operacion";
import RefreshIcon from '@mui/icons-material/Refresh';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';
import DescriptionIcon from '@mui/icons-material/Description';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { ActivoDTO } from "@/types/Activo";

import { TabPanelProps } from "@/types/ComponentProps";
import { getRecomendacionesAdmin, destacarRecomendacion, resolverRecomendacion } from "@/services/RecomendacionesService";
import { RecomendacionResumenDTO, EstadoRecomendacion } from "@/types/Recomendacion";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";

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
  const { user } = useAuth();

  const [tabValue, setTabValue] = React.useState(0);
  const {
    stats,
    portfolioStats,
    users,
    operations,
    activos,
    loading: loadingData,
    loadData
  } = useAdminData();

  const { valuacion, loading: portfolioLoading } = usePortfolioData();

  // Recommendations State
  const [recommendations, setRecommendations] = React.useState<RecomendacionResumenDTO[]>([]);
  const [recFilter, setRecFilter] = React.useState<number | ''>(''); // '' = All
  const [loadingRecs, setLoadingRecs] = React.useState(false);

  const fetchRecommendations = React.useCallback(async () => {
    setLoadingRecs(true);
    try {
      const estado = recFilter === '' ? undefined : recFilter;
      const data = await getRecomendacionesAdmin(estado);
      setRecommendations(data);
    } catch (error) {
      console.error("Error fetching recs", error);
    } finally {
      setLoadingRecs(false);
    }
  }, [recFilter]);

  React.useEffect(() => {
    if (tabValue === 4) { // New Tab Index
      fetchRecommendations();
    }
  }, [tabValue, recFilter, fetchRecommendations]);

  const handleDestacar = async (id: string) => {
    await destacarRecomendacion(id);
    fetchRecommendations();
  };

  const handleResolver = async (id: string, acierto: boolean) => {
    if (confirm(`¿Marcar recomendación como ${acierto ? 'ACERTADA' : 'FALLIDA'}? Esto la cerrará.`)) {
      await resolverRecomendacion(id, acierto);
      fetchRecommendations();
    }
  };


  React.useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user, loadData]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
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
            <Tab icon={<StarIcon />} iconPosition="start" label="Recomendaciones" />
          </Tabs>
        </Box>

        {loadingData && !stats ? (
          <Grid container spacing={3}>
            {/* KPI Cards Skeleton */}
            {[1, 2, 3, 4].map((i) => (
              <Grid key={i} size={{ xs: 12, sm: 6, md: 3 }}>
                <Paper className={styles.card}>
                  <Typography variant="caption"><Skeleton width="60%" /></Typography>
                  <Skeleton height={40} width="40%" sx={{ my: 1 }} />
                  <Skeleton width="30%" />
                </Paper>
              </Grid>
            ))}

            {/* Sections Skeleton */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper className={styles.sectionPaper}>
                <Typography variant="h6"><Skeleton width="50%" /></Typography>
                <Divider className={styles.divider} />
                <Skeleton variant="rectangular" height={150} />
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper className={styles.sectionPaper}>
                <Typography variant="h6"><Skeleton width="40%" /></Typography>
                <Divider className={styles.divider} />
                <Stack spacing={1}>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton key={i} width="90%" />
                  ))}
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        ) : (
          <>
            {/* DASHBOARD TAB */}
            <CustomTabPanel value={tabValue} index={0}>
              {stats ? (
                <Grid container spacing={3}>
                  {/* KPI Cards */}
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Paper className={styles.card}>
                      <Typography className={styles.kpiLabel}>Total Usuarios</Typography>
                      <Typography variant="h4" className={styles.kpiValue}>{stats.totalUsuarios}</Typography>
                      <Typography variant="body2" color="success.main" className={styles.kpiChange}>
                        +{stats.nuevosUsuariosMes} este mes
                      </Typography>
                    </Paper>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Paper className={styles.card}>
                      <Typography className={styles.kpiLabel}>Recomendaciones</Typography>
                      <Typography variant="h4" className={styles.kpiValue}>{stats.recomendacionesPendientes}</Typography>
                      <Typography variant="body2" color="warning.main" className={styles.kpiChange}>
                        Pendientes de revisión
                      </Typography>
                    </Paper>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Paper className={`${styles.card} ${styles.highlightCard}`}>
                      <Typography className={styles.kpiLabel} style={{ color: '#fff' }}>Valor en Custodia</Typography>
                      <Typography variant="h5" className={styles.kpiValue}>${portfolioStats?.valorGlobalPesos?.toLocaleString() ?? '-'}</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontSize: '0.8rem' }}>
                        USD {portfolioStats?.valorGlobalDolares?.toLocaleString() ?? '-'}
                      </Typography>
                    </Paper>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Paper className={styles.card}>
                      <Typography className={styles.kpiLabel}>Efectividad Global</Typography>
                      <Typography variant="h4" className={styles.kpiValue}>{stats.efectividadGlobal}</Typography>
                      <Typography variant="body2" color="text.secondary" className={styles.kpiChange}>
                        Total Activos: {stats.totalActivos}
                      </Typography>
                    </Paper>
                  </Grid>

                  {/* Recent Activity Placeholders */}
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Paper className={styles.sectionPaper}>
                      <Typography variant="h6" className={styles.sectionTitle}>Distribución de Usuarios</Typography>
                      <Divider className={styles.divider} />
                      <Typography color="text.secondary" variant="body2">
                        Gráfico de distribución por rol o fecha de registro (Próximamente chart.js)
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
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
                        <TableCell>{new Date(row.fechaAlta).toLocaleDateString()}</TableCell>
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

            {/* RECOMENDACIONES TAB */}
            <CustomTabPanel value={tabValue} index={4}>
              <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">Gestión de Recomendaciones</Typography>
                <FormControl size="small" sx={{ minWidth: 200 }}>
                  <InputLabel>Estado</InputLabel>
                  <Select value={recFilter} label="Estado" onChange={(e) => setRecFilter(e.target.value as any)}>
                    <MenuItem value="">Todos</MenuItem>
                    <MenuItem value={EstadoRecomendacion.Pendiente}>Pendientes</MenuItem>
                    <MenuItem value={EstadoRecomendacion.Aceptada}>Aceptadas</MenuItem>
                    <MenuItem value={EstadoRecomendacion.Rechazada}>Rechazadas</MenuItem>
                    <MenuItem value={EstadoRecomendacion.Cerrada}>Cerradas</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              {loadingRecs ? <CircularProgress /> : (
                <TableContainer component={Paper} className={styles.tableContainer}>
                  <Table>
                    <TableHead className={styles.tableHead}>
                      <TableRow>
                        <TableCell>Título</TableCell>
                        <TableCell>Autor</TableCell>
                        <TableCell>Estado</TableCell>
                        <TableCell align="center">Destacada</TableCell>
                        <TableCell align="right">Acciones</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {recommendations.map((row) => (
                        <TableRow key={row.id} hover>
                          <TableCell>
                            <Typography variant="body2" fontWeight="bold">{row.titulo}</Typography>
                            <Typography variant="caption" color="text.secondary">{new Date(row.fecha).toLocaleDateString()}</Typography>
                          </TableCell>
                          <TableCell>{row.autorNombre}</TableCell>
                          <TableCell>
                            <Chip
                              label={EstadoRecomendacion[row.estado]}
                              size="small"
                              color={row.estado === EstadoRecomendacion.Aceptada ? "success" : row.estado === EstadoRecomendacion.Pendiente ? "warning" : "default"}
                              variant="outlined"
                            />
                            {row.esAcertada !== undefined && row.esAcertada !== null && (
                              <Chip
                                icon={row.esAcertada ? <CheckIcon /> : <CloseIcon />}
                                label={row.esAcertada ? "Acertada" : "Fallida"}
                                size="small"
                                sx={{ ml: 1 }}
                                color={row.esAcertada ? "success" : "error"}
                              />
                            )}
                          </TableCell>
                          <TableCell align="center">
                            <IconButton onClick={() => handleDestacar(row.id)} color={row.esDestacada ? "warning" : "default"}>
                              {row.esDestacada ? <StarIcon /> : <StarBorderIcon />}
                            </IconButton>
                          </TableCell>
                          <TableCell align="right">
                            {row.estado !== EstadoRecomendacion.Cerrada && (
                              <>
                                <IconButton size="small" title="Marcar Acertada" onClick={() => handleResolver(row.id, true)} color="success"><CheckIcon /></IconButton>
                                <IconButton size="small" title="Marcar Fallida" onClick={() => handleResolver(row.id, false)} color="error"><CloseIcon /></IconButton>
                              </>
                            )}

                          </TableCell>
                        </TableRow>
                      ))}
                      {recommendations.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5} align="center">No hay recomendaciones con este filtro.</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CustomTabPanel>
          </>
        )}

      </Box >
    </RoleGuard >
  );
}
