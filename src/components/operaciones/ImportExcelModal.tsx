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
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
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
    MenuItem
} from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import EditIcon from '@mui/icons-material/Edit';
import { ImportPreviewDTO, ImportedItemPreviewDTO } from "@/types/Import";
import { useImportExcel } from "@/hooks/useImportExcel";

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
        isEditing,
        editingItems,
        startEdit,
        cancelEdit,
        updateEditingItem,
        saveEdit
    } = useImportExcel(onSuccess);

    const handleClose = () => {
        reset();
        onClose();
    };

    const handleSuccessClose = () => {
        handleClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
            <DialogTitle>Importar Operaciones desde Excel</DialogTitle>
            <DialogContent>
                <Box sx={{ mt: 2, minHeight: 200, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>

                    {step === "UPLOAD" && (
                        <Box sx={{ textAlign: 'center', width: '100%' }}>
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
                                        transition: 'all 0.2s'
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
                            {!isEditing ? (
                                <>
                                    <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Box>
                                            <Typography variant="subtitle1" gutterBottom fontWeight="bold">Resumen de Análisis:</Typography>
                                            <Stack direction="row" spacing={2}>
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
                                        <Button variant="outlined" startIcon={<EditIcon />} onClick={startEdit} size="small">
                                            Editar Datos
                                        </Button>
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

                                    <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 300 }}>
                                        <Table size="small" stickyHeader>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Estado</TableCell>
                                                    <TableCell>Fecha</TableCell>
                                                    <TableCell>Operación</TableCell>
                                                    <TableCell>Activo</TableCell>
                                                    <TableCell align="right">Cantidad</TableCell>
                                                    <TableCell align="right">Precio</TableCell>
                                                    <TableCell>Moneda</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {previewData.items.map((item: ImportedItemPreviewDTO, index: number) => (
                                                    <TableRow key={index} sx={{ bgcolor: item.isValid ? 'inherit' : '#fff4f4' }}>
                                                        <TableCell>
                                                            {item.isValid ?
                                                                <Tooltip title="Válido"><CheckCircleIcon color="success" fontSize="small" /></Tooltip>
                                                                :
                                                                <Tooltip title={item.validationMessage || "Error"}><ErrorIcon color="error" fontSize="small" /></Tooltip>
                                                            }
                                                        </TableCell>
                                                        <TableCell>{new Date(item.fecha).toLocaleDateString()}</TableCell>
                                                        <TableCell>{item.tipoOperacion}</TableCell>
                                                        <TableCell>{item.symbol}</TableCell>
                                                        <TableCell align="right">{item.cantidad}</TableCell>
                                                        <TableCell align="right">{item.precioUnitario}</TableCell>
                                                        <TableCell>{item.moneda}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </>
                            ) : (
                                <>
                                    <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Typography variant="subtitle1" fontWeight="bold">Editando Operaciones</Typography>
                                        <Stack direction="row" spacing={1}>
                                            <Button variant="outlined" color="inherit" onClick={cancelEdit} size="small">
                                                Cancelar
                                            </Button>
                                            <Button variant="contained" color="primary" onClick={saveEdit} size="small">
                                                Confirmar Cambios
                                            </Button>
                                        </Stack>
                                    </Box>
                                    <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 400 }}>
                                        <Table size="small" stickyHeader>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Fecha</TableCell>
                                                    <TableCell>Tipo</TableCell>
                                                    <TableCell>Activo</TableCell>
                                                    <TableCell>Cantidad</TableCell>
                                                    <TableCell>Precio</TableCell>
                                                    <TableCell>Moneda</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {editingItems.map((item, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell sx={{ minWidth: 130 }}>
                                                            <TextField
                                                                type="datetime-local"
                                                                size="small"
                                                                value={item.fecha ? item.fecha.substring(0, 16) : ''}
                                                                onChange={(e) => updateEditingItem(index, 'fecha', e.target.value)}
                                                                InputLabelProps={{ shrink: true }}
                                                                fullWidth
                                                            />
                                                        </TableCell>
                                                        <TableCell sx={{ minWidth: 100 }}>
                                                            <Select
                                                                size="small"
                                                                value={item.tipoOperacion}
                                                                onChange={(e) => updateEditingItem(index, 'tipoOperacion', e.target.value)}
                                                                fullWidth
                                                            >
                                                                <MenuItem value="Compra">Compra</MenuItem>
                                                                <MenuItem value="Venta">Venta</MenuItem>
                                                            </Select>
                                                        </TableCell>
                                                        <TableCell sx={{ minWidth: 90 }}>
                                                            <TextField
                                                                size="small"
                                                                value={item.symbol}
                                                                onChange={(e) => updateEditingItem(index, 'symbol', e.target.value)}
                                                                fullWidth
                                                            />
                                                        </TableCell>
                                                        <TableCell sx={{ minWidth: 100 }}>
                                                            <TextField
                                                                type="number"
                                                                size="small"
                                                                value={item.cantidad}
                                                                onChange={(e) => updateEditingItem(index, 'cantidad', parseFloat(e.target.value))}
                                                                fullWidth
                                                            />
                                                        </TableCell>
                                                        <TableCell sx={{ minWidth: 100 }}>
                                                            <TextField
                                                                type="number"
                                                                size="small"
                                                                value={item.precioUnitario}
                                                                onChange={(e) => updateEditingItem(index, 'precioUnitario', parseFloat(e.target.value))}
                                                                fullWidth
                                                            />
                                                        </TableCell>
                                                        <TableCell sx={{ minWidth: 80 }}>
                                                            <Select
                                                                size="small"
                                                                value={item.moneda}
                                                                onChange={(e) => updateEditingItem(index, 'moneda', e.target.value)}
                                                                fullWidth
                                                            >
                                                                <MenuItem value="USD">USD</MenuItem>
                                                                <MenuItem value="ARS">ARS</MenuItem>
                                                                <MenuItem value="USDT">USDT</MenuItem>
                                                                <MenuItem value="USDC">USDC</MenuItem>
                                                            </Select>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </>
                            )}
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
                {step === "PREVIEW" && !isEditing && (
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
                {step === "PREVIEW" && isEditing && (
                    <Button disabled>Editando...</Button> // Placeholder, actual buttons are in top right
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
        </Dialog>
    );
}
