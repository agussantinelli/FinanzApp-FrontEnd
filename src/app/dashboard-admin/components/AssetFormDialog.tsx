import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormControlLabel,
    Checkbox,
    Stack,
    Box,
    Alert
} from '@mui/material';
import { ActivoDTO, ActivoCreateDTO, ActivoUpdateDTO } from '@/types/Activo';
import { TipoActivoDTO } from '@/types/TipoActivo';
import { SectorDTO } from '@/types/Sector';
import { getTiposActivoNoMoneda } from '@/services/TipoActivosService';
import { getSectores } from '@/services/SectorService';

interface AssetFormDialogProps {
    open: boolean;
    onClose: () => void;
    onSave: (data: ActivoCreateDTO | ActivoUpdateDTO) => Promise<void>;
    initialData?: ActivoDTO | null;
    mode: 'create' | 'edit';
}

export default function AssetFormDialog({ open, onClose, onSave, initialData, mode }: AssetFormDialogProps) {
    const [formData, setFormData] = useState<ActivoCreateDTO>({
        symbol: '',
        nombre: '',
        tipoActivoId: 0,
        monedaBase: 'USD',
        esLocal: false,
        sectorId: null,
        descripcion: ''
    });

    const [types, setTypes] = useState<TipoActivoDTO[]>([]);
    const [sectors, setSectors] = useState<SectorDTO[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadMetadata = async () => {
            try {
                const [t, s] = await Promise.all([getTiposActivoNoMoneda(), getSectores()]);
                setTypes(t);
                setSectors(s);
            } catch (err) {
                console.error("Error loading metadata", err);
            }
        };
        if (open) {
            loadMetadata();
        }
    }, [open]);

    useEffect(() => {
        if (initialData && mode === 'edit') {
            setFormData({
                symbol: initialData.symbol,
                nombre: initialData.nombre,
                tipoActivoId: initialData.tipoActivoId,
                monedaBase: initialData.monedaBase,
                esLocal: initialData.esLocal,
                sectorId: initialData.sectorId || null as any,
                descripcion: initialData.descripcion
            });
        } else {
            setFormData({
                symbol: '',
                nombre: '',
                tipoActivoId: 0,
                monedaBase: 'USD',
                esLocal: false,
                sectorId: null as any,
                descripcion: ''
            });
        }
        setError(null);
    }, [initialData, mode, open]);

    const handleChange = (field: keyof ActivoCreateDTO, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async () => {
        if (!formData.nombre || !formData.tipoActivoId || !formData.monedaBase || !formData.descripcion) {
            setError("Por favor completa los campos obligatorios.");
            return;
        }
        if (mode === 'create' && !formData.symbol) {
            setError("El símbolo es obligatorio para nuevos activos.");
            return;
        }

        setLoading(true);
        setError(null);
        try {
            await onSave(formData);
            onClose();
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Error al guardar el activo.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{mode === 'create' ? 'Nuevo Activo' : `Editar ${initialData?.symbol || 'Activo'}`}</DialogTitle>
            <DialogContent dividers>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                <Stack spacing={2} sx={{ mt: 1 }}>
                    <TextField
                        label="Símbolo (Ticker)"
                        value={formData.symbol}
                        onChange={(e) => handleChange('symbol', e.target.value.toUpperCase())}
                        disabled={mode === 'edit'}
                        required
                        fullWidth
                    />
                    <TextField
                        label="Nombre"
                        value={formData.nombre}
                        onChange={(e) => handleChange('nombre', e.target.value)}
                        required
                        fullWidth
                    />
                    <FormControl fullWidth required>
                        <InputLabel>Tipo de Activo</InputLabel>
                        <Select
                            value={formData.tipoActivoId || ''}
                            label="Tipo de Activo"
                            onChange={(e) => handleChange('tipoActivoId', Number(e.target.value))}
                        >
                            {types.map(t => (
                                <MenuItem key={t.id} value={t.id}>{t.nombre}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth>
                        <InputLabel>Sector</InputLabel>
                        <Select
                            value={formData.sectorId || ''}
                            label="Sector"
                            onChange={(e) => handleChange('sectorId', e.target.value || null)}
                        >
                            <MenuItem value=""><em>Ninguno</em></MenuItem>
                            {sectors.map(s => (
                                <MenuItem key={s.id} value={s.id}>{s.nombre}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth required>
                        <InputLabel>Moneda Base</InputLabel>
                        <Select
                            value={formData.monedaBase}
                            label="Moneda Base"
                            onChange={(e) => handleChange('monedaBase', e.target.value)}
                        >
                            <MenuItem value="USD">Dólares (USD)</MenuItem>
                            <MenuItem value="ARS">Pesos (ARS)</MenuItem>
                        </Select>
                    </FormControl>

                    <TextField
                        label="Descripción"
                        value={formData.descripcion}
                        onChange={(e) => handleChange('descripcion', e.target.value)}
                        multiline
                        rows={3}
                        required
                        fullWidth
                    />

                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={formData.esLocal}
                                onChange={(e) => handleChange('esLocal', e.target.checked)}
                            />
                        }
                        label="Es Activo Local (Argentina)"
                    />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={loading}>Cancelar</Button>
                <Button onClick={handleSubmit} variant="contained" disabled={loading}>
                    {loading ? 'Guardando...' : 'Guardar'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
