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
import styles from "./styles/Activos.module.css";

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
        data = [...cache];

        if (selectedType !== "Todos") {
          const tObj = tipos.find(t => t.id === Number(selectedType));
          if (tObj) {
            data = data.filter(a => a.tipo === tObj.nombre);
          }
        }

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

      if (criterio === "marketCap") {
        data = data.filter(a => a.marketCap !== null && a.marketCap !== undefined && a.marketCap > 0);
      }
      data.sort((a, b) => {
        let valA: any = 0;
        let valB: any = 0;

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

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentActivos = activos.slice(startIndex, endIndex);
  const totalPages = Math.ceil(activos.length / itemsPerPage);

  return (
    <main className={styles.main}>
      <Box className={styles.headerContainer}>
        <Stack spacing={3}>
          <Box>
            <Typography variant="h3" gutterBottom className={styles.title}>
              Mercado Financiero
            </Typography>
            <Typography variant="h6" className={styles.subtitle}>
              Explora, analiza y descubre oportunidades de inversión en tiempo real.
            </Typography>
          </Box>

          <div className={styles.controlsStack}>

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
                  className={styles.searchInput}
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
                />
              )}
              renderOption={(props, option) => {
                const { key, ...otherProps } = props;
                return (
                  <li key={key} {...otherProps}>
                    <div className={styles.optionInfo}>
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
                    </div>
                  </li>
                );
              }}
              sx={{ flexGrow: 1, width: "100%" }}
            />

            <Button
              variant="contained"
              onClick={handleRefresh}
              disabled={loading}
              className={styles.refreshButton}
            >
              <RefreshIcon />
            </Button>

            <FormControl size="small" className={styles.filterControl}>
              <InputLabel id="sector-select-label">Filtrar por Sector</InputLabel>
              <Select
                labelId="sector-select-label"
                id="sector-select"
                value={selectedSector}
                label="Filtrar por Sector"
                onChange={handleSectorChange}
                className={styles.filterSelect}
              >
                <MenuItem value="Todos">Todos</MenuItem>
                {sectores.map((sector) => (
                  <MenuItem key={sector.id} value={sector.id}>
                    {sector.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" className={styles.filterControl}>
              <InputLabel id="asset-type-label">Filtrar por Tipo</InputLabel>
              <Select
                labelId="asset-type-label"
                id="asset-type-select"
                value={selectedType}
                label="Filtrar por Tipo"
                onChange={handleTypeChange}
                className={styles.filterSelect}
              >
                <MenuItem value="Todos">Todos</MenuItem>
                {tipos.map((type) => (
                  <MenuItem key={type.id} value={type.id}>
                    {type.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </Stack>
      </Box>

      {loading ? (
        <NeonLoader message="Actualizando mercado..." />
      ) : (
        <>
          {currentActivos.length > 0 ? (
            <TableContainer component={Paper} elevation={0} className={styles.tableContainer}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead className={styles.tableHead}>
                  <TableRow>
                    <TableCell className={styles.columnHeader}>
                      <TableSortLabel
                        active={orderBy === "symbol"}
                        direction={orderBy === "symbol" && orderDesc ? "desc" : "asc"}
                        onClick={() => handleRequestSort("symbol")}
                        IconComponent={orderBy !== "symbol" ? UnfoldMoreIcon : undefined}
                      >
                        Activo
                      </TableSortLabel>
                    </TableCell>
                    <TableCell className={styles.columnHeader}>
                      <TableSortLabel
                        active={orderBy === "precio"}
                        direction={orderBy === "precio" && orderDesc ? "desc" : "asc"}
                        onClick={() => handleRequestSort("precio")}
                        IconComponent={orderBy !== "precio" ? UnfoldMoreIcon : undefined}
                      >
                        Precio
                      </TableSortLabel>
                    </TableCell>
                    <TableCell className={styles.columnHeader}>
                      <TableSortLabel
                        active={orderBy === "variacion"}
                        direction={orderBy === "variacion" && orderDesc ? "desc" : "asc"}
                        onClick={() => handleRequestSort("variacion")}
                        IconComponent={orderBy !== "variacion" ? UnfoldMoreIcon : undefined}
                      >
                        24h %
                      </TableSortLabel>
                    </TableCell>
                    <TableCell className={styles.columnHeader}>Sector</TableCell>
                    <TableCell className={styles.columnHeader}>
                      <TableSortLabel
                        active={orderBy === "marketCap"}
                        direction={orderBy === "marketCap" && orderDesc ? "desc" : "asc"}
                        onClick={() => handleRequestSort("marketCap")}
                        IconComponent={orderBy !== "marketCap" ? UnfoldMoreIcon : undefined}
                      >
                        Market Cap
                      </TableSortLabel>
                    </TableCell>
                    <TableCell className={styles.columnHeader}>Moneda</TableCell>
                    <TableCell className={styles.columnHeader}>Origen</TableCell>
                    <TableCell align="right" className={styles.columnHeader}>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {currentActivos.map((activo) => (
                    <TableRow
                      key={activo.id}
                      className={styles.tableRow}
                    >
                      <TableCell component="th" scope="row">
                        <div className={styles.assetInfo}>
                          <Avatar
                            className={styles.avatar}
                            sx={{ bgcolor: getAvatarColor(activo.tipo) }}
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
                        </div>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" className={styles.priceText}>
                          {(activo.precioActual !== null && activo.precioActual !== undefined)
                            ? new Intl.NumberFormat('en-US', { style: 'currency', currency: activo.moneda }).format(activo.precioActual)
                            : '-'
                          }
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={`${(activo.variacion24h ?? 0) >= 0 ? '+' : ''}${(activo.variacion24h ?? 0).toFixed(2)}%`}
                          size="small"
                          className={styles.variationChip}
                          sx={{
                            bgcolor: (activo.variacion24h ?? 0) >= 0 ? 'success.lighter' : 'error.lighter',
                            color: (activo.variacion24h ?? 0) >= 0 ? 'success.main' : 'error.main',
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip label={activo.sector || "-"} size="small" variant="outlined" className={styles.chipRounded} />
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
                          className={styles.chipBold}
                        />
                      </TableCell>
                      <TableCell>
                        {activo.esLocal ? (
                          <Chip label="ARG" size="small" color="info" variant="outlined" className={styles.chipRounded} />
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
                          className={styles.detailsButton}
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
            <Box className={styles.noResultsBox}>
              <SearchIcon className={styles.searchIconEmpty} />
              <Typography variant="h6" gutterBottom>
                No se encontraron activos
              </Typography>
              <Typography variant="body2" className={styles.noResultsText}>
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
                className={styles.cleanFiltersButton}
              >
                Limpiar Filtros
              </Button>
            </Box>
          )}

          {activos.length > 0 && (
            <Box className={styles.paginationContainer}>
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