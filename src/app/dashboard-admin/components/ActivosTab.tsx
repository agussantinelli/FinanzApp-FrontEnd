import React, { useState, useEffect, useMemo } from 'react';
import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, IconButton, Skeleton, TextField, InputAdornment, FormControl, InputLabel, Select, MenuItem, Stack } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import { useAdminAssets } from '@/hooks/useAdminAssets';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import AssetFormDialog from './AssetFormDialog';
import styles from '../styles/Admin.module.css';
import { ActivoDTO, ActivoCreateDTO, ActivoUpdateDTO } from '@/types/Activo';
import { getTiposActivoNoMoneda } from '@/services/TipoActivosService';
import { getSectores } from '@/services/SectorService';
import { TipoActivoDTO } from '@/types/TipoActivo';
import { SectorDTO } from '@/types/Sector';

export default function ActivosTab() {
    const { activos, loading, addAsset, updateAsset, removeAsset } = useAdminAssets();

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    // Filter State
    const [tipos, setTipos] = useState<TipoActivoDTO[]>([]);
    const [sectores, setSectores] = useState<SectorDTO[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedType, setSelectedType] = useState<string | number>("Todos");
    const [selectedSector, setSelectedSector] = useState<string>("Todos");

    // Dialog State
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
    const [selectedAsset, setSelectedAsset] = useState<ActivoDTO | null>(null);

    // Initial load for types/sectors
    useEffect(() => {
        const loadMetadata = async () => {
            try {
                const [t, s] = await Promise.all([getTiposActivoNoMoneda(), getSectores()]);
                setTipos(t);
                setSectores(s);
            } catch (err) {
                console.error("Error loading metadata", err);
            }
        };
        loadMetadata();
    }, []);

    const filteredActivos = useMemo(() => {
        return activos.filter(activo => {
            // Search Filter
            const lowerTerm = searchTerm.toLowerCase();
            const matchesSearch = activo.symbol.toLowerCase().includes(lowerTerm) ||
                activo.nombre.toLowerCase().includes(lowerTerm);

            // Type Filter
            let matchesType = true;
            if (selectedType !== "Todos") {
                const tObj = tipos.find(t => t.id === Number(selectedType));
                matchesType = tObj ? activo.tipo === tObj.nombre : true;
            }

            // Sector Filter
            let matchesSector = true;
            if (selectedSector !== "Todos") {
                const sObj = sectores.find(s => s.id === selectedSector);
                matchesSector = sObj ? activo.sector === sObj.nombre : true;
            }

            return matchesSearch && matchesType && matchesSector;
        });
    }, [activos, searchTerm, selectedType, selectedSector, tipos, sectores]);


    const handleDeleteClick = (id: string) => {
        setSelectedId(id);
        setConfirmOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (selectedId && removeAsset) {
            await removeAsset(selectedId);
        }
        setConfirmOpen(false);
    };

    const handleCreateClick = () => {
        setDialogMode('create');
        setSelectedAsset(null);
        setDialogOpen(true);
    };

    const handleEditClick = (asset: ActivoDTO) => {
        setDialogMode('edit');
        setSelectedAsset(asset);
        setDialogOpen(true);
    };

    const handleSave = async (data: ActivoCreateDTO | ActivoUpdateDTO) => {
        if (dialogMode === 'create') {
            await addAsset(data as ActivoCreateDTO);
        } else {
            if (selectedAsset) {
                await updateAsset(selectedAsset.id, data as ActivoUpdateDTO);
            }
        }
    };

    if (loading && activos.length === 0) return <Skeleton variant="rectangular" height={400} />;

    return (
        <Box sx={{ py: 3 }}>
            <Box sx={{ mb: 3 }} className={styles.controlsStack}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
                    <TextField
                        placeholder="Buscar por símbolo o nombre..."
                        variant="outlined"
                        size="small"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        fullWidth
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon color="action" />
                                </InputAdornment>
                            ),
                        }}
                    />

                    <FormControl size="small" sx={{ minWidth: 200 }}>
                        <InputLabel>Filtrar por Sector</InputLabel>
                        <Select
                            value={selectedSector}
                            label="Filtrar por Sector"
                            onChange={(e) => setSelectedSector(e.target.value)}
                        >
                            <MenuItem value="Todos">Todos</MenuItem>
                            {sectores.map((sector) => (
                                <MenuItem key={sector.id} value={sector.id}>
                                    {sector.nombre}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl size="small" sx={{ minWidth: 200 }}>
                        <InputLabel>Filtrar por Tipo</InputLabel>
                        <Select
                            value={selectedType}
                            label="Filtrar por Tipo"
                            onChange={(e) => setSelectedType(e.target.value)}
                        >
                            <MenuItem value="Todos">Todos</MenuItem>
                            {tipos.map((type) => (
                                <MenuItem key={type.id} value={type.id}>
                                    {type.nombre}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Button variant="contained" color="primary" onClick={handleCreateClick} sx={{ minWidth: 150, height: 40 }}>
                        Nuevo Activo
                    </Button>
                </Stack>
            </Box>
            <TableContainer component={Paper} className={styles.tableContainer}>
                <Table>
                    <TableHead className={styles.tableHead}>
                        <TableRow>
                            <TableCell>Símbolo</TableCell>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Tipo</TableCell>
                            <TableCell>Sector</TableCell>
                            <TableCell>Moneda</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredActivos.map((row) => (
                            <TableRow key={row.id} hover>
                                <TableCell>
                                    <Chip label={row.symbol} size="small" className={styles.chipSymbol} />
                                </TableCell>
                                <TableCell>{row.nombre}</TableCell>
                                <TableCell>{row.tipo}</TableCell>
                                <TableCell>
                                    {row.sector && <Chip label={row.sector} size="small" variant="outlined" />}
                                </TableCell>
                                <TableCell><Chip label={row.moneda} size="small" variant="outlined" /></TableCell>
                                <TableCell>
                                    <IconButton size="small" onClick={() => handleEditClick(row)}>
                                        <EditIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton
                                        size="small"
                                        color="error"
                                        onClick={() => handleDeleteClick(row.id)}
                                        title="Eliminar Activo"
                                    >
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <AssetFormDialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                onSave={handleSave}
                mode={dialogMode}
                initialData={selectedAsset}
            />

            <ConfirmDialog
                open={confirmOpen}
                title="Eliminar Activo"
                content="¿Estás seguro de que deseas eliminar este activo? Esta acción no se puede deshacer."
                onClose={() => setConfirmOpen(false)}
                onConfirm={handleConfirmDelete}
                confirmText="Eliminar"
                confirmColor="error"
            />
        </Box>
    );
}
