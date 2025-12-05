"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Pagination,
  CircularProgress,
  Grid,
  Divider,
} from "@mui/material";
import { ActivoDTO } from "@/types/Activo";
import { TipoActivoDTO } from "@/types/TipoActivo";
import { getActivosNoMoneda, getActivosByTipoId } from "@/services/ActivosService";
import { getTiposActivoNoMoneda } from "@/services/TipoActivosService";

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
          <Stack spacing={2}>
            {currentActivos.map((activo) => (
              <AssetCard key={activo.id} activo={activo} />
            ))}
          </Stack>

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

          {activos.length === 0 && (
            <Box sx={{ textAlign: "center", mt: 8, p: 4, bgcolor: "background.paper", borderRadius: 2 }}>
              <Typography variant="h6" color="text.secondary">
                No se encontraron activos para esta categoría.
              </Typography>
            </Box>
          )}
        </>
      )}
    </main>
  );
}

function AssetCard({ activo }: { activo: ActivoDTO }) {
  return (
    <Card
      elevation={0}
      sx={{
        width: "100%",
        borderRadius: "12px",
        border: "1px solid",
        borderColor: "divider",
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          borderColor: "primary.main",
          transform: "translateY(-2px)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        },
      }}
    >
      <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
        <Grid container alignItems="center" spacing={2} sx={{ width: "100%" }}>
          {/* Symbol and Name */}
          <Grid item xs={12} sm={4} md={5}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  bgcolor: "primary.light",
                  color: "primary.main",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                  fontSize: "1.2rem",
                  opacity: 0.2
                }}
              >
                {activo.symbol.substring(0, 1)}
              </Box>
              <Box>
                <Typography variant="h6" component="div" fontWeight="bold" sx={{ lineHeight: 1.2 }}>
                  {activo.symbol}
                </Typography>
                <Typography variant="body2" color="text.secondary" noWrap>
                  {activo.nombre}
                </Typography>
              </Box>
            </Stack>
          </Grid>

          {/* Tags / Metadata */}
          <Grid item xs={12} sm={5} md={4}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Chip
                label={activo.tipo}
                size="small"
                sx={{ bgcolor: "action.hover", fontWeight: 500 }}
              />
              <Chip
                label={activo.moneda}
                size="small"
                variant="outlined"
                color={activo.moneda === "USD" ? "success" : "default"}
              />
              {activo.esLocal && (
                <Chip label="ARG" size="small" color="info" variant="outlined" sx={{ height: 24 }} />
              )}
            </Stack>
          </Grid>

          {/* Action Button */}
          <Grid item xs={12} sm={3} md={3} sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Box sx={{ width: "100%", display: "flex", justifyContent: "flex-end" }}>
              <Button
                component={Link}
                href={`/activos/${activo.id}`}
                variant="contained"
                disableElevation
                size="small"
                sx={{
                  borderRadius: "8px",
                  textTransform: "none",
                  fontWeight: 600,
                  px: 3
                }}
              >
                Ver Detalles
              </Button>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}