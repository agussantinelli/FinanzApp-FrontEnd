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
  Avatar,
  IconButton,
  Card,
} from "@mui/material";
import { ActivoDTO } from "@/types/Activo";
import { TipoActivoDTO } from "@/types/TipoActivo";
import { getActivosNoMoneda, getActivosByTipoId } from "@/services/ActivosService";
import { getTiposActivoNoMoneda } from "@/services/TipoActivosService";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

export default function Activos() {
  const [selectedType, setSelectedType] = useState<string | number>("Todos");
  const [activos, setActivos] = useState<ActivoDTO[]>([]);
  const [tipos, setTipos] = useState<TipoActivoDTO[]>([]);
  const [loading, setLoading] = useState(false);

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

  const fetchActivos = async (tipo: string | number) => {
    setLoading(true);
    try {
      let data: ActivoDTO[];
      if (tipo === "Todos") {
        data = await getActivosNoMoneda();
      } else {
        data = await getActivosByTipoId(Number(tipo));
      }
      setActivos(data);
      setPage(1); // Reset to first page on filter change
    } catch (error) {
      console.error("Error fetching activos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTypeChange = (event: any) => {
    setSelectedType(event.target.value);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  // Pagination logic
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentActivos = activos.slice(startIndex, endIndex);
  const totalPages = Math.ceil(activos.length / itemsPerPage);

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

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {currentActivos.length > 0 ? (
            <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid", borderColor: "divider", borderRadius: "12px", overflow: "hidden" }}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead sx={{ bgcolor: "background.default" }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold", color: "text.secondary" }}>Activo</TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: "text.secondary" }}>Tipo</TableCell>
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
                              bgcolor: "primary.light",
                              color: "primary.main",
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
                        <Chip
                          label={activo.tipo}
                          size="small"
                          sx={{
                            borderRadius: "6px",
                            fontWeight: 500,
                            bgcolor: "rgba(0, 0, 0, 0.04)"
                          }}
                        />
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