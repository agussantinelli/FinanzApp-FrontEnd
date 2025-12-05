"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Box,
  Card,
  CardActions,
  CardContent,
  Chip,
  Stack,
  Typography,
  Button,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Pagination,
  CircularProgress,
} from "@mui/material";
import { ActivoDTO } from "@/types/Activo";
import { TipoActivoDTO } from "@/types/TipoActivo";
import { getActivos } from "@/services/ActivosService";
import { getTiposActivo } from "@/services/TipoActivosService";

export default function Activos() {
  const [selectedType, setSelectedType] = useState("Todos");
  const [activos, setActivos] = useState<ActivoDTO[]>([]);
  const [tipos, setTipos] = useState<TipoActivoDTO[]>([]);
  const [loading, setLoading] = useState(false);

  // Pagination state
  const [page, setPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    const loadTipos = async () => {
      try {
        const data = await getTiposActivo();
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

  const fetchActivos = async (tipo: string) => {
    setLoading(true);
    try {
      const data = await getActivos(tipo);
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
          <Typography variant="h4" gutterBottom>
            Mercado
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Explora el catálogo completo de activos financieros.
          </Typography>
        </Box>

        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="asset-type-label">Tipo de Activo</InputLabel>
          <Select
            labelId="asset-type-label"
            id="asset-type-select"
            value={selectedType}
            label="Tipo de Activo"
            onChange={handleTypeChange}
          >
            <MenuItem value="Todos">Todos</MenuItem>
            {tipos.map((type) => (
              <MenuItem key={type.id} value={type.nombre}>
                {type.nombre}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
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
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          )}

          {activos.length === 0 && (
            <Typography variant="body1" sx={{ textAlign: "center", mt: 4 }}>
              No se encontraron activos para esta categoría.
            </Typography>
          )}
        </>
      )}
    </main>
  );
}

function AssetCard({ activo }: { activo: ActivoDTO }) {
  return (
    <Card
      sx={{
        width: "100%",
        borderRadius: "12px",
        border: "1px solid",
        borderColor: "divider",
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: 4,
        },
      }}
    >
      <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
        >
          <Box sx={{ flexGrow: 1, textAlign: { xs: "center", sm: "left" } }}>
            <Typography variant="h6" component="div" fontWeight="bold">
              {activo.symbol}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {activo.nombre}
            </Typography>
          </Box>

          <Stack direction="row" spacing={1} alignItems="center">
            <Chip label={activo.tipo} size="small" />
            <Chip
              label={activo.moneda}
              size="small"
              color={activo.moneda === "USD" ? "success" : "default"}
              variant="outlined"
            />
            <Button
              component={Link}
              href={`/activos/${activo.id}`}
              variant="outlined"
              size="small"
            >
              Ver Detalles
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}