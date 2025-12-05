"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Box,
  Card,
  CardActions,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography,
  Button,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Pagination,
  Collapse,
  IconButton,
  CircularProgress,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { styled } from "@mui/material/styles";
import { ActivoDTO } from "@/types/Activo";
import { TipoActivoDTO } from "@/types/TipoActivo";
import { getActivos } from "@/services/ActivosService";
import { getTiposActivo } from "@/services/TipoActivosService";

const ExpandMore = styled((props: { expand: boolean; onClick: () => void; children: React.ReactNode }) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function Activos() {
  const [selectedType, setSelectedType] = useState("Todos");
  const [activos, setActivos] = useState<ActivoDTO[]>([]);
  const [tipos, setTipos] = useState<TipoActivoDTO[]>([]);
  const [loading, setLoading] = useState(false);

  // Pagination state
  const [page, setPage] = useState(1);
  const itemsPerPage = 15;

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
          <Grid container spacing={3}>
            {currentActivos.map((activo) => (
              <AssetCard key={activo.id} activo={activo} />
            ))}
          </Grid>

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
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Grid item xs={12} sm={6} md={4}>
      <Card
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          borderRadius: "16px",
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <CardContent sx={{ flexGrow: 1 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
            <Box>
              <Typography variant="h6" component="div">
                {activo.symbol}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {activo.nombre}
              </Typography>
            </Box>
            <Chip
              label={activo.moneda}
              size="small"
              color={activo.moneda === "USD" ? "success" : "default"}
              variant="outlined"
            />
          </Stack>

          <Box sx={{ mt: 1 }}>
            <Chip label={activo.tipo} size="small" sx={{ mr: 1 }} />
            {activo.esLocal ? (
              <Chip label="Local" size="small" color="info" variant="outlined" />
            ) : (
              <Chip label="Exterior" size="small" color="warning" variant="outlined" />
            )}
          </Box>
        </CardContent>

        <CardActions disableSpacing>
          <Button size="small" component={Link} href={`/activos/${activo.id}`}>
            Ver Detalles
          </Button>
          <ExpandMore
            expand={expanded}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <ExpandMoreIcon />
          </ExpandMore>
        </CardActions>

        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <Typography paragraph variant="body2">
              {activo.descripcion || "Sin descripción disponible."}
            </Typography>
          </CardContent>
        </Collapse>
      </Card>
    </Grid>
  );
}