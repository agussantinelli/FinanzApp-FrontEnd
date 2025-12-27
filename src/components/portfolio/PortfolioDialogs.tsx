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
    Checkbox,
    Box,
    Typography,
    Divider
} from '@mui/material';
import { createPortafolio, updatePortafolio, deletePortafolio, marcarComoPrincipal } from '@/services/PortafolioService';

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
    onSuccess: (deleted?: boolean) => void;
    portfolio: { id: string; nombre: string; descripcion: string; esPrincipal: boolean } | null;
}

export function EditPortfolioDialog({ open, onClose, onSuccess, portfolio }: EditPortfolioDialogProps) {
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [esPrincipal, setEsPrincipal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);

    useEffect(() => {
        if (portfolio) {
            setNombre(portfolio.nombre);
            setDescripcion(portfolio.descripcion || '');
            setEsPrincipal(portfolio.esPrincipal || false);
            setConfirmDelete(false);
        }
    }, [portfolio]);

    const handleSubmit = async () => {
        if (!portfolio || !nombre.trim()) return;
        setLoading(true);
        try {
            // 1. Update basic info
            await updatePortafolio(portfolio.id, nombre, descripcion);

            // 2. Update principal status if changed to TRUE (we can't uncheck principal directly? usually one sets another as principal. 
            // The endpoint is "markAsPrincipal". If user unchecks it, we probably do nothing or warn them they have to select another one as principal.
            // Assuming for now we only call it if set to true and it wasn't before.
            if (esPrincipal && !portfolio.esPrincipal) {
                await marcarComoPrincipal(portfolio.id);
            }

            onSuccess();
            onClose();
        } catch (error) {
            console.error("Error updating portfolio", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!portfolio) return;
        if (!confirmDelete) {
            setConfirmDelete(true);
            return;
        }

        setLoading(true);
        try {
            await deletePortafolio(portfolio.id);
            onSuccess(true); // Param true indicates deletion
            onClose();
        } catch (error) {
            console.error("Error deleting portfolio", error);
            // Could set an error state here specifically for delete failure (e.g. if it's the principal one)
        } finally {
            setLoading(false);
        }
    }

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
                    sx={{ mb: 2 }}
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={esPrincipal}
                            onChange={(e) => setEsPrincipal(e.target.checked)}
                            // If it was already principal, maybe we shouldn't allow unchecking it here?
                            // The backend logic usually ensures there is always one principal.
                            // If I uncheck it, which one becomes principal?
                            // Usually you set another one as principal to unset this one.
                            // But for UI simplicity, let's allow "checking" it.
                            disabled={portfolio?.esPrincipal || loading}
                        />
                    }
                    label={portfolio?.esPrincipal ? "Es tu portafolio principal" : "Definir como principal"}
                />

                <Box sx={{ mt: 4 }}>
                    <Divider sx={{ mb: 2 }} />
                    <Typography variant="subtitle2" color="error" gutterBottom sx={{ fontWeight: 'bold' }}>
                        Zona de Peligro
                    </Typography>
                    {confirmDelete ? (
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                            <Typography variant="body2" color="error">
                                ¿Estás seguro? Esta acción no se puede deshacer.
                            </Typography>
                            <Button
                                variant="contained"
                                color="error"
                                size="small"
                                onClick={handleDelete}
                                disabled={loading}
                            >
                                Confirmar Eliminación
                            </Button>
                            <Button size="small" onClick={() => setConfirmDelete(false)}>Cancelar</Button>
                        </Box>
                    ) : (
                        <Button
                            variant="outlined"
                            color="error"
                            onClick={handleDelete}
                            disabled={loading || portfolio?.esPrincipal}
                        // Disable delete if it is principal (backend rule)
                        >
                            Eliminar Portafolio
                        </Button>
                    )}
                    {portfolio?.esPrincipal && (
                        <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                            No puedes eliminar tu portafolio principal. Define otro como principal primero.
                        </Typography>
                    )}
                </Box>
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
