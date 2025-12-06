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
import { getActivosNoMoneda, getActivosByTipoId, searchActivos } from "@/services/ActivosService";
import { getTiposActivoNoMoneda } from "@/services/TipoActivosService";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import RefreshIcon from '@mui/icons-material/Refresh';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import SearchIcon from '@mui/icons-material/Search';
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
  const router = useRouter(); // Initialize router
  const [selectedType, setSelectedType] = useState<string | number>("Todos");
  const [activos, setActivos] = useState<ActivoDTO[]>([]);
  const [tipos, setTipos] = useState<TipoActivoDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<ActivoDTO[]>([]);
  const [isSearching, setIsSearching] = useState(false);

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

  // Debounce for fetching suggestions only
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
      setSuggestions(data.slice(0, 10)); // Limit to 10 suggestions
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
        // If empty, revert to type filter
        if (selectedType === "Todos") {
          data = await getActivosNoMoneda();
        } else {
          data = await getActivosByTipoId(Number(selectedType));
        }
      }
      setActivos(data);
    } catch (error) {
      console.error("Error executing search:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    // Only fetch initial data if we are NOT searching
    if (searchTerm === "") {
      fetchActivos();
    }
  }, [selectedType]);

  const fetchActivos = async () => {
    setLoading(true);
    try {
      let data: ActivoDTO[];
      if (selectedType === "Todos") {
        data = await getActivosNoMoneda();
      } else {
        data = await getActivosByTipoId(Number(selectedType));
      }
      setActivos(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

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
      <Box sx={{ mb: 5, pb: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Stack spacing={3}>
          {/* Section 1: Title and Subtitle */}
          <Box>
            <Typography
              variant="h3"
              gutterBottom
              fontWeight={800}
              sx={{
                background: 'linear-gradient(45deg, #33a139ff 30%, #b3ffd0ff 90%)',
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                mb: 1
              }}
            >
              Mercado Financiero
            </Typography>
            <Typography variant="h6" color="text.secondary" fontWeight={400}>
              Explora, analiza y descubre oportunidades de inversión en tiempo real.
            </Typography>
          </Box>

          {/* Section 2: Controls Row (Search + Refresh + Filter) */}
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center" width="100%">

            {/* Search Bar with Autocomplete */}
            <Autocomplete
              freeSolo
              options={suggestions}
              getOptionLabel={(option) => typeof option === 'string' ? option : `${option.symbol} - ${option.nombre}`}
              filterOptions={(x) => x} // Disable client-side filtering since we do it server-side
              inputValue={searchTerm}
              onInputChange={(event, newInputValue) => {
                setSearchTerm(newInputValue);
              }}
              onChange={(event, newValue) => {
                if (newValue && typeof newValue !== 'string') {
                  // Navigate to asset detail page
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
                  placeholder="Buscar activo (Enter para buscar)..."
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
                // Extract key from props to avoid React warning, pass the rest
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
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
              }}
            >
              <RefreshIcon />
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