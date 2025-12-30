"use client";
import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Typography,
    CircularProgress,
    Stack,
    Alert,
    LinearProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Tooltip,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel
} from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { ImportedItemPreviewDTO } from "@/types/Import";
import { useImportExcel } from "@/hooks/useImportExcel";
import FloatingMessage from "@/components/ui/FloatingMessage";

interface ImportExcelModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function ImportExcelModal({ open, onClose, onSuccess }: ImportExcelModalProps) {
    const {
        step,
        file,
        previewData,
        errorMessage,
        handleFileChange,
        analyze,
        confirm,
        reset,
        setStep,
        retry,
        updateItem,
        deleteItem,
        setErrorMessage
    } = useImportExcel(onSuccess);

    const [editItemIndex, setEditItemIndex] = React.useState<number | null>(null);
    const [editItemData, setEditItemData] = React.useState<ImportedItemPreviewDTO | null>(null);

    const handleClose = () => {
        reset();
        onClose();
    };

    const handleSuccessClose = () => {
        handleClose();
    };

    const handleEditClick = (item: ImportedItemPreviewDTO, index: number) => {
        setEditItemIndex(index);
        setEditItemData({ ...item });
    };

    const handleEditSave = () => {
        if (editItemIndex !== null && editItemData) {
            updateItem(editItemIndex, editItemData);
            setEditItemIndex(null);
            setEditItemData(null);
        }
    };

    const handleEditCancel = () => {
        setEditItemIndex(null);
        setEditItemData(null);
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="xl"
            fullWidth
            PaperProps={{
                sx: {
                    border: '1px solid #00ff00',
                    boxShadow: '0 0 20px rgba(0, 255, 0, 0.3)',
                    borderRadius: 2
                }
            }}
        >
            <DialogTitle sx={{ textAlign: 'center', m: 2, fontWeight: 'bold' }}>
                Importar Operaciones desde Excel
            </DialogTitle>
            <DialogContent>
                <Box sx={{ mt: 2, minHeight: 200, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>

                    {step === "UPLOAD" && (
                        <Box sx={{ textAlign: 'center', width: '100%', maxWidth: 600, mx: 'auto' }}>
                            <Alert severity="info" sx={{ mb: 2, textAlign: 'left' }}>
                                Importante: Asegúrate de que el archivo tenga los campos claros y los activos estén identificados por su Ticker (Símbolo).
                            </Alert>
                            <input
                                accept=".xlsx, .xls"
                                style={{ display: 'none' }}
                                id="excel-upload-input"
                                type="file"
                                onChange={handleFileChange}
                            />
                            <label htmlFor="excel-upload-input">
                                <Box
                                    sx={{
                                        border: '2px dashed',
                                        borderColor: 'text.secondary',
                                        borderRadius: 2,
                                        p: 4,
                                        cursor: 'pointer',
                                        '&:hover': { bgcolor: 'action.hover' },
                                        transition: 'all 0.2s',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center'
                                    }}
                                >
                                    <CloudUploadIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                                    <Typography color="text.secondary" variant="h6">
                                        {file ? file.name : "Click o arrastra tu Excel aquí"}
                                    </Typography>
                                    <Typography variant="caption" color="text.disabled">
                                        Formatos soportados: .xlsx, .xls
                                    </Typography>
                                </Box>
                            </label>
                            {errorMessage && (
                                <Alert severity="error" sx={{ mt: 2 }}>{errorMessage}</Alert>
                            )}
                        </Box>
                    )}

                    {step === "ANALYZING" && (
                        <Box sx={{ width: '100%', textAlign: 'center', py: 4 }}>
                            <CircularProgress size={40} />
                            <Typography sx={{ mt: 2, fontWeight: 500 }}>Analizando archivo con IA...</Typography>
                            <Typography variant="caption" color="text.secondary">Esto puede tomar unos segundos.</Typography>
                        </Box>
                    )}

                    {step === "PREVIEW" && previewData && (
                        <Box sx={{ width: '100%' }}>
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="subtitle1" gutterBottom fontWeight="bold">Resumen de Análisis:</Typography>
                                <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
                                    <Box sx={{ color: 'success.main', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <CheckCircleIcon fontSize="small" />
                                        <Typography variant="body2" fontWeight="bold">{previewData.items.filter((i: ImportedItemPreviewDTO) => i.isValid).length} válidas</Typography>
                                    </Box>
                                    <Box sx={{ color: 'error.main', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <ErrorIcon fontSize="small" />
                                        <Typography variant="body2" fontWeight="bold">{previewData.items.filter((i: ImportedItemPreviewDTO) => !i.isValid).length} con errores</Typography>
                                    </Box>
                                </Stack>
                            </Box>

                            {previewData.globalErrors && previewData.globalErrors.length > 0 && (
                                <Alert severity="error" sx={{ mb: 2 }}>
                                    <ul style={{ margin: 0, paddingLeft: 16 }}>
                                        {previewData.globalErrors.map((e: string, idx: number) => <li key={idx}>{e}</li>)}
                                    </ul>
                                </Alert>
                            )}

                            {!previewData.canImport && previewData.items.length === 0 && (
                                <Alert severity="warning">No se detectaron operaciones válidas.</Alert>
                            )}

                            <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 500 }}>
                                <Table size="small" stickyHeader>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Estado</TableCell>
                                            <TableCell align="left">Fecha</TableCell>
                                            <TableCell align="left">Operación</TableCell>
                                            <TableCell align="left">Activo</TableCell>
                                            <TableCell align="left">Cantidad</TableCell>
                                            <TableCell align="left">Precio Unitario</TableCell>
                                            <TableCell align="left">Moneda</TableCell>
                                            <TableCell align="center">Acciones</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {previewData.items.map((item: ImportedItemPreviewDTO, index: number) => (
                                            <TableRow key={index} sx={{ bgcolor: item.isValid ? 'inherit' : '#fff0f0' }}>
                                                <TableCell>
                                                    {item.isValid ?
                                                        <Tooltip title="Válido"><CheckCircleIcon color="success" fontSize="small" /></Tooltip>
                                                        :
                                                        <Tooltip title={item.validationMessage || "Error"}><ErrorIcon color="error" fontSize="small" /></Tooltip>
                                                    }
                                                </TableCell>
                                                <TableCell align="left">{item.fecha ? new Date(item.fecha).toLocaleDateString() : '-'}</TableCell>
                                                <TableCell align="left">{item.tipoOperacion}</TableCell>
                                                <TableCell align="left">{item.symbol}</TableCell>
                                                <TableCell align="left">{item.cantidad}</TableCell>
                                                <TableCell align="left">{item.precioUnitario?.toLocaleString()}</TableCell>
                                                <TableCell align="left" sx={{ fontWeight: 'bold' }}>
                                                    {(item.cantidad * item.precioUnitario).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                </TableCell>
                                                <TableCell align="left">{item.moneda}</TableCell>
                                                <TableCell align="center">
                                                    <Tooltip title="Editar">
                                                        <Button size="small" onClick={() => handleEditClick(item, index)} sx={{ minWidth: 30 }}>
                                                            <EditIcon fontSize="small" />
                                                        </Button>
                                                    </Tooltip>
                                                    <Tooltip title="Eliminar">
                                                        <Button size="small" onClick={() => deleteItem(index)} color="error" sx={{ minWidth: 30 }}>
                                                            <DeleteIcon fontSize="small" />
                                                        </Button>
                                                    </Tooltip>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    )}

                    {step === "CONFIRMING" && (
                        <Box sx={{ width: '100%', textAlign: 'center', py: 4 }}>
                            <LinearProgress sx={{ mb: 2 }} />
                            <Typography fontWeight={500}>Guardando operaciones...</Typography>
                            <Typography variant="body2" color="text.secondary">Validando consistencia en el servidor.</Typography>
                        </Box>
                    )}

                    {step === "SUCCESS" && (
                        <Box sx={{ textAlign: 'center', py: 4 }}>
                            <CheckCircleIcon color="success" sx={{ fontSize: 64, mb: 2 }} />
                            <Typography variant="h5" gutterBottom fontWeight="bold">Importación Exitosa</Typography>
                            <Typography color="text.secondary">Tus operaciones han sido registradas correctamente.</Typography>
                        </Box>
                    )}

                    {step === "ERROR" && (
                        <Box sx={{ textAlign: 'center', py: 4 }}>
                            <ErrorIcon color="error" sx={{ fontSize: 64, mb: 2 }} />
                            <Typography variant="h6" gutterBottom color="error">Error de Importación</Typography>
                            <Typography color="text.secondary" sx={{ mb: 2 }}>{errorMessage}</Typography>
                        </Box>
                    )}

                </Box>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
                {step === "UPLOAD" && (
                    <>
                        <Button onClick={handleClose} color="inherit">Cancelar</Button>
                        <Button onClick={analyze} variant="contained" disabled={!file}>Analizar Archivo</Button>
                    </>
                )}
                {step === "PREVIEW" && (
                    <>
                        <Button onClick={() => setStep("UPLOAD")}>Atrás</Button>
                        <Button
                            onClick={confirm}
                            variant="contained"
                            disabled={!previewData?.items.some((i: ImportedItemPreviewDTO) => i.isValid)}
                            color="primary"
                            sx={{ fontWeight: 'bold' }}
                        >
                            Confirmar Importación
                        </Button>
                    </>
                )}
                {step === "SUCCESS" && (
                    <Button onClick={handleSuccessClose} variant="contained" fullWidth>Finalizar</Button>
                )}
                {step === "ERROR" && (
                    <>
                        <Button onClick={handleClose}>Cerrar</Button>
                        <Button onClick={retry} variant="contained">Intentar de nuevo</Button>
                    </>
                )}
            </DialogActions>

            {/* Editing Modal */}
            <Dialog open={editItemIndex !== null} onClose={handleEditCancel} maxWidth="xs" fullWidth>
                <DialogTitle>Editar Operación</DialogTitle>
                <DialogContent>
                    {editItemData && (
                        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <TextField
                                label="Fecha"
                                type="datetime-local"
                                size="small"
                                value={editItemData.fecha ? editItemData.fecha.substring(0, 16) : ''}
                                onChange={(e) => setEditItemData({ ...editItemData, fecha: e.target.value })}
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                            />
                            <FormControl fullWidth size="small">
                                <InputLabel>Tipo</InputLabel>
                                <Select
                                    label="Tipo"
                                    value={editItemData.tipoOperacion}
                                    onChange={(e) => setEditItemData({ ...editItemData, tipoOperacion: e.target.value })}
                                >
                                    <MenuItem value="Compra">Compra</MenuItem>
                                    <MenuItem value="Venta">Venta</MenuItem>
                                </Select>
                            </FormControl>
                            <TextField
                                label="Activo (Ticker)"
                                size="small"
                                value={editItemData.symbol}
                                disabled
                                fullWidth
                            />
                            <TextField
                                label="Cantidad"
                                type="number"
                                size="small"
                                value={editItemData.cantidad}
                                onChange={(e) => setEditItemData({ ...editItemData, cantidad: parseFloat(e.target.value) })}
                                fullWidth
                            />
                            <TextField
                                label="Precio"
                                type="number"
                                size="small"
                                value={editItemData.precioUnitario}
                                onChange={(e) => setEditItemData({ ...editItemData, precioUnitario: parseFloat(e.target.value) })}
                                fullWidth
                            />
                            <FormControl fullWidth size="small">
                                <InputLabel>Moneda</InputLabel>
                                <Select
                                    label="Moneda"
                                    value={editItemData.moneda}
                                    onChange={(e) => setEditItemData({ ...editItemData, moneda: e.target.value })}
                                >
                                    <MenuItem value="USD">USD</MenuItem>
                                    <MenuItem value="ARS">ARS</MenuItem>
                                    <MenuItem value="USDT">USDT</MenuItem>
                                    <MenuItem value="USDC">USDC</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={handleEditCancel} color="inherit">Cancelar</Button>
                    <Button onClick={handleEditSave} variant="contained" color="primary">Confirmar</Button>
                </DialogActions>
            </Dialog>
            <FloatingMessage
                open={!!errorMessage}
                message={errorMessage}
                severity="error"
                onClose={() => setErrorMessage(null)}
            />
        </Dialog>
    );
}
