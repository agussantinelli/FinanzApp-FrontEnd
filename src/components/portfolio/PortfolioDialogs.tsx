import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    CircularProgress,
    FormControlLabel,
    Checkbox
} from '@mui/material';
import { createPortafolio, updatePortafolio } from '@/services/PortafolioService';

interface CreatePortfolioDialogProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function CreatePortfolioDialog({ open, onClose, onSuccess }: CreatePortfolioDialogProps) {
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [esPrincipal, setEsPrincipal] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!nombre.trim()) return;
        setLoading(true);
        try {
            await createPortafolio({ nombre, descripcion, esPrincipal });
            onSuccess();
            setNombre('');
            setDescripcion('');
            setEsPrincipal(false);
            onClose();
        } catch (error) {
            console.error("Error creating portfolio", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Crear Nuevo Portafolio</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Nombre"
                    fullWidth
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    disabled={loading}
                />
                <TextField
                    margin="dense"
                    label="Descripción (Opcional)"
                    fullWidth
                    multiline
                    rows={3}
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    disabled={loading}
                    sx={{ mb: 2 }}
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={esPrincipal}
                            onChange={(e) => setEsPrincipal(e.target.checked)}
                            disabled={loading}
                        />
                    }
                    label="Definir como principal"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={loading}>Cancelar</Button>
                <Button onClick={handleSubmit} variant="contained" disabled={!nombre.trim() || loading}>
                    {loading ? <CircularProgress size={24} /> : "Crear"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

interface EditPortfolioDialogProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
    portfolio: { id: string; nombre: string; descripcion: string } | null;
}

export function EditPortfolioDialog({ open, onClose, onSuccess, portfolio }: EditPortfolioDialogProps) {
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (portfolio) {
            setNombre(portfolio.nombre);
            setDescripcion(portfolio.descripcion || '');
        }
    }, [portfolio]);

    const handleSubmit = async () => {
        if (!portfolio || !nombre.trim()) return;
        setLoading(true);
        try {
            await updatePortafolio(portfolio.id, nombre, descripcion);
            onSuccess();
            onClose();
        } catch (error) {
            console.error("Error updating portfolio", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Editar Portafolio</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Nombre"
                    fullWidth
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    disabled={loading}
                />
                <TextField
                    margin="dense"
                    label="Descripción (Opcional)"
                    fullWidth
                    multiline
                    rows={3}
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    disabled={loading}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={loading}>Cancelar</Button>
                <Button onClick={handleSubmit} variant="contained" disabled={!nombre.trim() || loading}>
                    {loading ? <CircularProgress size={24} /> : "Guardar Cambios"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
