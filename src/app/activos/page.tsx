"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  TextField,
  InputAdornment,
  Autocomplete,
} from "@mui/material";
import { ActivoDTO } from "@/types/Activo";
import { TipoActivoDTO } from "@/types/TipoActivo";
import { SectorDTO } from "@/types/Sector";
import {
  getActivosNoMoneda,
  getActivosByTipoId,
  searchActivos,
  getRankingActivos,
  getActivosBySector,
  getActivosByTipoAndSector,
  getAllActivosFromCache
} from "@/services/ActivosService";
import { getTiposActivoNoMoneda } from "@/services/TipoActivosService";
import { getSectores } from "@/services/SectorService";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import RefreshIcon from '@mui/icons-material/Refresh';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import SearchIcon from '@mui/icons-material/Search';
import NeonLoader from "@/components/ui/NeonLoader";

const getAvatarColor = (tipo: string) => {
  switch (tipo?.toLowerCase()) {
    case 'accion':
    case 'acciones':
      return "#0400ffff";
    case 'cedear':
    case 'cedears':
      return "#a73bffff";
    case 'bono':
    case 'bonos':
      return "#4caf50";
    case 'obligacion negociable':
    case 'on':
      return "#ff9800";
    case 'fci':
      return "#63deeeff";
    case 'cripto':
    case 'crypto':
      return "#f14ae4ff";
    default:
      return "#757575";
  }
};

export default function Activos() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<string | number>("Todos");
  const [selectedSector, setSelectedSector] = useState<string>("Todos");
  const [activos, setActivos] = useState<ActivoDTO[]>([]);
  const [tipos, setTipos] = useState<TipoActivoDTO[]>([]);
  const [sectores, setSectores] = useState<SectorDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<ActivoDTO[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const [orderBy, setOrderBy] = useState<string>("marketCap");
  const [orderDesc, setOrderDesc] = useState<boolean>(true);

  const [page, setPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    const loadTiposAndSectores = async () => {
      try {
        const [tiposData, sectoresData] = await Promise.all([
          getTiposActivoNoMoneda(),
          getSectores()
        ]);
        setTipos(tiposData);
        setSectores(sectoresData);
      } catch (error) {
        console.error("Error fetching types/sectors:", error);
      }
    };
    loadTiposAndSectores();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm.length >= 2) {
        fetchSuggestions();
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const fetchSuggestions = async () => {
    try {
      const data = await searchActivos(searchTerm);
      setSuggestions(data.slice(0, 10));
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  const executeSearch = async (termToSearch: string = searchTerm) => {
    setLoading(true);
    try {
      let data: ActivoDTO[];
      const term = termToSearch.trim();

      if (term.length >= 1) {
        data = await searchActivos(term);
      } else {
        if (selectedType === "Todos") {
          data = await getActivosNoMoneda();
        } else {
          data = await getActivosByTipoId(Number(selectedType));
        }
      }
      setActivos(data);
    } catch (error) {
      fetchActivos();
    }
  };

  const fetchActivos = async () => {
    setLoading(true);
    try {
      let data: ActivoDTO[] = [];
      const cache = getAllActivosFromCache();

      const criterioMap: Record<string, string> = {
        "symbol": "nombre",
        "precio": "precio",
        "variacion": "variacion",
        "marketCap": "marketCap"
      };

      if (cache) {
        // --- Client-Side Filtering from Cache ---
        data = [...cache];

        // Filter by Type
        if (selectedType !== "Todos") {
          const tObj = tipos.find(t => t.id === Number(selectedType));
          if (tObj) {
            data = data.filter(a => a.tipo === tObj.nombre);
          }
        }

        // Filter by Sector
        if (selectedSector !== "Todos") {
          const sObj = sectores.find(s => s.id === selectedSector);
          if (sObj) {
            data = data.filter(a => a.sector === sObj.nombre);
          }
        }

      } else {

        if (selectedType !== "Todos" || selectedSector !== "Todos") {
          if (selectedType !== "Todos" && selectedSector !== "Todos") {
            data = await getActivosByTipoAndSector(Number(selectedType), selectedSector);
          } else if (selectedSector !== "Todos") {
            data = await getActivosBySector(selectedSector);
          } else {
            data = await getActivosByTipoId(Number(selectedType));
          }
        } else {
          const backendCriterio = criterioMap[orderBy] || "marketCap";
          const tipoId = selectedType !== "Todos" ? Number(selectedType) : undefined;
          data = await getRankingActivos(backendCriterio, orderDesc, tipoId);
        }
      }

      const criterio = criterioMap[orderBy] || "marketCap";
      data.sort((a, b) => {
        let valA: any = 0;
        let valB: any = 0;

        // Explicit Property Mapping
        if (criterio === "precio") {
          valA = a.precioActual ?? 0;
          valB = b.precioActual ?? 0;
        } else if (criterio === "variacion") {
          valA = a.variacion24h ?? 0;
          valB = b.variacion24h ?? 0;
        } else if (criterio === "marketCap") {
          valA = a.marketCap ?? 0;
          valB = b.marketCap ?? 0;
        } else {
          // Default generic fallback (usually by symbol/name)
          valA = a.symbol;
          valB = b.symbol;
        }

        if (valB < valA) return orderDesc ? -1 : 1;
        if (valB > valA) return orderDesc ? 1 : -1;
        return 0;
      });

      setActivos(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchTerm === "") {
      fetchActivos();
    }
  }, [selectedType, selectedSector, orderBy, orderDesc]);

  const handleRefresh = () => {
    if (searchTerm.length > 0) {
      executeSearch();
    } else {
      fetchActivos();
    }
  };

  const handleRequestSort = (property: string) => {
    const isDesc = orderBy === property && orderDesc;
    setOrderDesc(!isDesc);
    setOrderBy(property);
  };

  const handleTypeChange = (event: any) => {
    setSelectedType(event.target.value);
    setPage(1);
  };

  const handleSectorChange = (event: any) => {
    setSelectedSector(event.target.value);
    setPage(1);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  // Client-side pagination on server-sorted data
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentActivos = activos.slice(startIndex, endIndex);
  const totalPages = Math.ceil(activos.length / itemsPerPage);

  return (
    <main style={{ padding: 24 }}>
      <Box sx={{ mb: 5, pb: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Stack spacing={3}>
          <Box>
            <Typography
              variant="h3"
              gutterBottom
              fontWeight={800}
              sx={{
                background: 'linear-gradient(135deg, #0dff21ff 0%, #7aff85ff 50%, #bcffc2ff 100%)',
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                mb: 1,
                letterSpacing: "-0.02em"
              }}
            >
              Mercado Financiero
            </Typography>
            <Typography
              variant="h6"
              fontWeight={500}
              sx={{
                background: 'linear-gradient(90deg, #ffffffff 0%, #beffc3ff 100%)',
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                opacity: 0.9
              }}
            >
              Explora, analiza y descubre oportunidades de inversión en tiempo real.
            </Typography>
          </Box>

          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center" width="100%">

            <Autocomplete
              freeSolo
              options={suggestions}
              getOptionLabel={(option) => typeof option === 'string' ? option : `${option.symbol} - ${option.nombre}`}
              filterOptions={(x) => x}
              onInputChange={(event, newInputValue) => {
                setSearchTerm(newInputValue);
              }}
              onChange={(event, newValue) => {
                if (newValue && typeof newValue !== 'string') {
                  router.push(`/activos/${newValue.id}`);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  executeSearch();
                }
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Buscar activo..."
                  variant="outlined"
                  size="small"
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <>
                        <InputAdornment position="start">
                          <SearchIcon color="action" />
                        </InputAdornment>
                        {params.InputProps.startAdornment}
                      </>
                    ),
                  }}
                  sx={{
                    minWidth: 350,
                    bgcolor: 'background.paper',
                    '& fieldset': { borderRadius: '12px' }
                  }}
                />
              )}
              renderOption={(props, option) => {
                const { key, ...otherProps } = props;
                return (
                  <li key={key} {...otherProps}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Avatar sx={{ width: 24, height: 24, fontSize: '0.7rem', bgcolor: getAvatarColor(typeof option === 'string' ? '' : option.tipo) }}>
                        {typeof option === 'string' ? '?' : option.symbol[0]}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight="bold">
                          {typeof option === 'string' ? option : option.symbol}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {typeof option === 'string' ? '' : option.nombre}
                        </Typography>
                      </Box>
                    </Stack>
                  </li>
                );
              }}
              sx={{ flexGrow: 1 }}
            />

            <Button
              variant="contained"
              onClick={handleRefresh}
              disabled={loading}
              sx={{
                minWidth: 'auto',
                p: 1.5,
                borderRadius: '12px',
                background: 'linear-gradient(45deg, #0dff21ff 30%, #21CBF3 90%)',
                boxShadow: '0 3px 5px 2px rgba(4, 63, 33, 0.3)',
              }}
            >
              <RefreshIcon />
            </Button>

            <FormControl sx={{ minWidth: 200 }} size="small">
              <InputLabel id="sector-select-label">Filtrar por Sector</InputLabel>
              <Select
                labelId="sector-select-label"
                id="sector-select"
                value={selectedSector}
                label="Filtrar por Sector"
                onChange={handleSectorChange}
                sx={{ borderRadius: "12px" }}
              >
                <MenuItem value="Todos">Todos</MenuItem>
                {sectores.map((sector) => (
                  <MenuItem key={sector.id} value={sector.id}>
                    {sector.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 200 }} size="small">
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
      </Box>

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
                    <TableCell sx={{ fontWeight: "bold", color: "text.secondary" }}>Sector</TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: "text.secondary" }}>
                      <TableSortLabel
                        active={orderBy === "marketCap"}
                        direction={orderBy === "marketCap" && orderDesc ? "desc" : "asc"}
                        onClick={() => handleRequestSort("marketCap")}
                        IconComponent={orderBy !== "marketCap" ? UnfoldMoreIcon : undefined}
                      >
                        Market Cap
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
                        <Chip label={activo.sector || "-"} size="small" variant="outlined" sx={{ borderRadius: "6px" }} />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {activo.marketCap
                            ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: "compact", maximumFractionDigits: 1 }).format(activo.marketCap)
                            : "-"}
                        </Typography>
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
            <Box sx={{ textAlign: "center", mt: 8, p: 6, bgcolor: "background.paper", borderRadius: "16px", border: "1px dashed", borderColor: "divider" }}>
              <SearchIcon sx={{ fontSize: 60, color: "text.disabled", mb: 2, opacity: 0.5 }} />
              <Typography variant="h6" gutterBottom>
                No se encontraron activos
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400, mx: "auto", mb: 3 }}>
                No hay resultados para
                {searchTerm ? <strong> "{searchTerm}" </strong> : ""}
                {selectedType !== "Todos" ? ` del tipo "${tipos.find(t => t.id === Number(selectedType))?.nombre || selectedType}"` : ""}
                {selectedSector !== "Todos" ? ` en el sector "${sectores.find(s => s.id === selectedSector)?.nombre || selectedSector}"` : ""}
                . Intenta ajustar tus filtros.
              </Typography>
              <Button
                variant="outlined"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedType("Todos");
                  setSelectedSector("Todos");
                  setPage(1);
                }}
                sx={{ borderRadius: "8px", textTransform: "none" }}
              >
                Limpiar Filtros
              </Button>
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