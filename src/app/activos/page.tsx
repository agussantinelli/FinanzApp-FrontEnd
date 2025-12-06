"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Box,
  Stack,
  Typography,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Pagination,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Card,
  TableSortLabel,
  Avatar,
} from "@mui/material";
import { ActivoDTO } from "@/types/Activo";
import { TipoActivoDTO } from "@/types/TipoActivo";
import { getActivosNoMoneda, getActivosByTipoId } from "@/services/ActivosService";
import { getTiposActivoNoMoneda } from "@/services/TipoActivosService";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import RefreshIcon from '@mui/icons-material/Refresh';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import NeonLoader from "@/components/ui/NeonLoader";

const getAvatarColor = (tipo: string) => {
  switch (tipo?.toLowerCase()) {
    case 'accion':
    case 'acciones':
      return "#2196f3";
    case 'cedear':
    case 'cedears':
      return "#9c27b0";
    case 'bono':
    case 'bonos':
      return "#4caf50";
    case 'obligacion negociable':
    case 'on':
      return "#ff9800";
    case 'fci':
      return "#00bcd4";
    default:
      return "#757575";
  }
};

export default function Activos() {
  const [selectedType, setSelectedType] = useState<string | number>("Todos");
  const [activos, setActivos] = useState<ActivoDTO[]>([]);
  const [tipos, setTipos] = useState<TipoActivoDTO[]>([]);
  const [loading, setLoading] = useState(false);

  const [orderBy, setOrderBy] = useState<string>("variacion");
  const [orderDesc, setOrderDesc] = useState<boolean>(true);

  // Pagination state
  const [page, setPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    const loadTipos = async () => {
      try {
        const data = await getTiposActivoNoMoneda();
        setTipos(data);
      } catch (error) {
        console.error("Error fetching types:", error);
      }
    };
    loadTipos();
  }, []);

  useEffect(() => {
    fetchActivos(selectedType);
  }, [selectedType]);

  const fetchActivos = async (tipo: string | number = selectedType) => {
    setLoading(true);
    try {
      let data: ActivoDTO[];
      if (tipo === "Todos") {
        data = await getActivosNoMoneda();
      } else {
        data = await getActivosByTipoId(Number(tipo));
      }
      setActivos(data);
    } catch (error) {
      console.error("Error fetching activos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchActivos(selectedType);
  };

  const handleRequestSort = (property: string) => {
    const isDesc = orderBy === property && orderDesc;
    setOrderDesc(!isDesc);
    setOrderBy(property);
  };

  const handleTypeChange = (event: any) => {
    setSelectedType(event.target.value);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  // Client-side sorting logic
  const sortedActivos = [...activos].sort((a, b) => {
    let valueA: any = a[orderBy as keyof ActivoDTO];
    let valueB: any = b[orderBy as keyof ActivoDTO];

    // Handle special cases
    if (orderBy === "variacion") {
      valueA = a.variacion24h;
      valueB = b.variacion24h;
    } else if (orderBy === "precio") {
      valueA = a.precioActual;
      valueB = b.precioActual;
    }

    // Handle nulls: always put nulls at the end
    if (valueA === null || valueA === undefined) return 1;
    if (valueB === null || valueB === undefined) return -1;

    if (valueB < valueA) {
      return orderDesc ? -1 : 1;
    }
    if (valueB > valueA) {
      return orderDesc ? 1 : -1;
    }
    return 0;
  });

  // Pagination logic on sorted data
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentActivos = sortedActivos.slice(startIndex, endIndex);
  const totalPages = Math.ceil(sortedActivos.length / itemsPerPage);

  return (
    <main style={{ padding: 24 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Box>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Mercado
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Explora el catálogo completo de activos financieros.
          </Typography>
        </Box>

        <Stack direction="row" spacing={2} alignItems="center">
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            disabled={loading}
            sx={{
              borderColor: 'divider',
              color: 'text.secondary',
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': {
                borderColor: 'primary.main',
                color: 'primary.main',
                bgcolor: 'background.paper'
              }
            }}
          >
            Actualizar
          </Button>

          <FormControl sx={{ minWidth: 220 }} size="small">
            <InputLabel id="asset-type-label">Filtrar por Tipo</InputLabel>
            <Select
              labelId="asset-type-label"
              id="asset-type-select"
              value={selectedType}
              label="Filtrar por Tipo"
              onChange={handleTypeChange}
            >
              <MenuItem value="Todos">Todos</MenuItem>
              {tipos.map((type) => (
                <MenuItem key={type.id} value={type.id}>
                  {type.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </Stack>

      {loading ? (
        <NeonLoader message="Actualizando mercado..." />
      ) : (
        <>
          {currentActivos.length > 0 ? (
            <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid", borderColor: "divider", borderRadius: "12px", overflow: "hidden" }}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead sx={{ bgcolor: "background.default" }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold", color: "text.secondary" }}>
                      <TableSortLabel
                        active={orderBy === "symbol"}
                        direction={orderBy === "symbol" && orderDesc ? "desc" : "asc"}
                        onClick={() => handleRequestSort("symbol")}
                        IconComponent={orderBy !== "symbol" ? UnfoldMoreIcon : undefined}
                      >
                        Activo
                      </TableSortLabel>
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: "text.secondary" }}>
                      <TableSortLabel
                        active={orderBy === "precio"}
                        direction={orderBy === "precio" && orderDesc ? "desc" : "asc"}
                        onClick={() => handleRequestSort("precio")}
                        IconComponent={orderBy !== "precio" ? UnfoldMoreIcon : undefined}
                      >
                        Precio
                      </TableSortLabel>
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: "text.secondary" }}>
                      <TableSortLabel
                        active={orderBy === "variacion"}
                        direction={orderBy === "variacion" && orderDesc ? "desc" : "asc"}
                        onClick={() => handleRequestSort("variacion")}
                        IconComponent={orderBy !== "variacion" ? UnfoldMoreIcon : undefined}
                      >
                        24h %
                      </TableSortLabel>
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: "text.secondary" }}>Moneda</TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: "text.secondary" }}>Origen</TableCell>
                    <TableCell align="right" sx={{ fontWeight: "bold", color: "text.secondary" }}>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {currentActivos.map((activo) => (
                    <TableRow
                      key={activo.id}
                      sx={{
                        '&:last-child td, &:last-child th': { border: 0 },
                        '&:hover': { bgcolor: "action.hover" },
                        transition: "background-color 0.2s"
                      }}
                    >
                      <TableCell component="th" scope="row">
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Avatar
                            sx={{
                              bgcolor: getAvatarColor(activo.tipo),
                              color: "#fff",
                              fontWeight: "bold",
                              width: 40,
                              height: 40,
                              fontSize: "0.9rem"
                            }}
                          >
                            {activo.symbol.substring(0, 1)}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle2" fontWeight="bold">
                              {activo.symbol}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {activo.nombre}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>
                          {(activo.precioActual !== null && activo.precioActual !== undefined)
                            ? new Intl.NumberFormat('en-US', { style: 'currency', currency: activo.moneda }).format(activo.precioActual)
                            : '-'
                          }
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {(activo.variacion24h !== null && activo.variacion24h !== undefined) ? (
                          <Chip
                            label={`${activo.variacion24h >= 0 ? '+' : ''}${activo.variacion24h.toFixed(2)}%`}
                            size="small"
                            sx={{
                              bgcolor: activo.variacion24h >= 0 ? 'success.lighter' : 'error.lighter',
                              color: activo.variacion24h >= 0 ? 'success.main' : 'error.main',
                              fontWeight: 700,
                              borderRadius: "6px",
                              height: 24,
                            }}
                          />
                        ) : (
                          <Typography variant="body2" color="text.secondary">-</Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={activo.moneda}
                          size="small"
                          variant="outlined"
                          color={activo.moneda === "USD" ? "success" : "default"}
                          sx={{ borderRadius: "6px", fontWeight: 600 }}
                        />
                      </TableCell>
                      <TableCell>
                        {activo.esLocal ? (
                          <Chip label="ARG" size="small" color="info" variant="outlined" sx={{ height: 24, borderRadius: "6px" }} />
                        ) : (
                          <Typography variant="caption" color="text.secondary">-</Typography>
                        )}
                      </TableCell>
                      <TableCell align="right">
                        <Button
                          component={Link}
                          href={`/activos/${activo.id}`}
                          variant="outlined"
                          size="small"
                          sx={{
                            textTransform: "none",
                            fontWeight: 600,
                            borderRadius: "8px",
                            borderColor: "divider",
                            color: "text.primary",
                            '&:hover': {
                              borderColor: "primary.main",
                              color: "primary.main",
                              bgcolor: "primary.lighter"
                            }
                          }}
                        >
                          Ver Detalles
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Box sx={{ textAlign: "center", mt: 8, p: 4, bgcolor: "background.paper", borderRadius: 2 }}>
              <Typography variant="h6" color="text.secondary">
                No se encontraron activos para esta categoría.
              </Typography>
            </Box>
          )}

          {activos.length > 0 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                size="large"
              />
            </Box>
          )}
        </>
      )}
    </main>
  );
}