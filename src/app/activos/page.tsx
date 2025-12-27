"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActivosFilters } from "@/hooks/useActivosFilters";
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
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import RefreshIcon from '@mui/icons-material/Refresh';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import SearchIcon from '@mui/icons-material/Search';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { toggleSeguirActivo } from "@/services/ActivosService";
import NeonLoader from "@/components/ui/NeonLoader";
import styles from "./styles/Activos.module.css";

import { formatPercentage } from "@/utils/format";
import { getAvatarColor } from "@/app-theme/icons-appearance";
import PageHeader from "@/components/ui/PageHeader";


export default function Activos() {
  const router = useRouter();
  const {
    selectedType,
    selectedSector,
    selectedCurrency,
    activos,
    tipos,
    sectores,
    loading,
    searchTerm,
    suggestions,
    orderBy,
    orderDesc,
    page,
    totalPages,
    paginatedActivos: currentActivos,
    setSearchTerm,
    handleRequestSort,
    handleTypeChange,
    handleSectorChange,
    handleCurrencyChange,
    handlePageChange,
    handleRefresh,
    executeSearch,
    resetFilters,
    updateAssetInList,
    onlyFavorites,
    setOnlyFavorites
  } = useActivosFilters();

  const handleToggleSeguir = async (e: React.MouseEvent, asset: ActivoDTO) => {
    e.preventDefault();
    e.stopPropagation();

    // Optimistic Update
    const updatedAsset = { ...asset, loSigo: !asset.loSigo };
    updateAssetInList(updatedAsset);

    try {
      await toggleSeguirActivo(asset.id);
    } catch (error) {
      console.error("Error toggling follow:", error);
      // Revert on error
      updateAssetInList(asset);
    }
  };

  return (
    <main className={styles.main}>
      <Box className={styles.headerContainer}>
        <Stack spacing={3}>
          <PageHeader
            title="Mercado Financiero"
            subtitle="Activos en Tiempo Real"
            description="Explora, analiza y descubre oportunidades de inversión en tiempo real."
          />

          {/* Favorites Toggle */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant={onlyFavorites ? "contained" : "outlined"}
              onClick={() => setOnlyFavorites(true)}
              color="primary"
              startIcon={<StarIcon />}
            >
              Mis Favoritos
            </Button>
            <Button
              variant={!onlyFavorites ? "contained" : "outlined"}
              onClick={() => setOnlyFavorites(false)}
              color="primary"
            >
              Todos los Activos
            </Button>
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

            <FormControl size="small" className={styles.filterControl}>
              <InputLabel id="currency-select-label">Moneda</InputLabel>
              <Select
                labelId="currency-select-label"
                id="currency-select"
                value={selectedCurrency}
                label="Moneda"
                onChange={handleCurrencyChange}
                className={styles.filterSelect}
              >
                <MenuItem value="Todos">Todas</MenuItem>
                <MenuItem value="ARS">Pesos (ARS)</MenuItem>
                <MenuItem value="USD">Dólares (USD)</MenuItem>
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
                    <TableCell padding="checkbox">
                      {/* Empty header for star icon */}
                    </TableCell>
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
                      <TableCell padding="checkbox">
                        <IconButton onClick={(e) => handleToggleSeguir(e, activo)} size="small">
                          {activo.loSigo ? <StarIcon color="warning" /> : <StarBorderIcon />}
                        </IconButton>
                      </TableCell>
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
                          label={`${(activo.variacion24h ?? 0) >= 0 ? '+' : ''}${formatPercentage(activo.variacion24h)}%`}
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
                          href={`/activos/${activo.symbol}`}
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
                onClick={resetFilters}
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