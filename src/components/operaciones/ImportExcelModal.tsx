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
    ListItemIcon
} from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
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
        retry
    } = useImportExcel(onSuccess);

    const handleClose = () => {
        reset();
        onClose();
    };

    const handleSuccessClose = () => {
        handleClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>Importar Operaciones desde Excel</DialogTitle>
            <DialogContent>
                <Box sx={{ mt: 2, minHeight: 200, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>

                    {step === "UPLOAD" && (
                        <Box sx={{ textAlign: 'center', width: '100%' }}>
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
                                        '&:hover': { bgcolor: 'action.hover' }
                                    }}
                                >
                                    <CloudUploadIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                                    <Typography color="text.secondary">
                                        {file ? file.name : "Click o arrastra tu Excel aquí"}
                                    </Typography>
                                </Box>
                            </label>
                            {errorMessage && (
                                <Alert severity="error" sx={{ mt: 2 }}>{errorMessage}</Alert>
                            )}
                        </Box>
                    )}

                    {step === "ANALYZING" && (
                        <Box sx={{ width: '100%', textAlign: 'center' }}>
                            <CircularProgress />
                            <Typography sx={{ mt: 2 }}>Analizando archivo con IA...</Typography>
                            <Typography variant="caption" color="text.secondary">Esto puede tomar unos segundos.</Typography>
                        </Box>
                    )}

                    {step === "PREVIEW" && previewData && (
                        <Box sx={{ width: '100%' }}>
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="subtitle1" gutterBottom>Resumen de Análisis:</Typography>
                                <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
                                    <Box sx={{ color: 'success.main', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <CheckCircleIcon fontSize="small" />
                                        <Typography variant="body2">{previewData.items.filter((i: ImportedItemPreviewDTO) => i.isValid).length} válidas</Typography>
                                    </Box>
                                    <Box sx={{ color: 'error.main', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <ErrorIcon fontSize="small" />
                                        <Typography variant="body2">{previewData.items.filter((i: ImportedItemPreviewDTO) => !i.isValid).length} con errores</Typography>
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

                            {/* Preview List (Condensed) */}
                            <List dense sx={{ maxHeight: 200, overflow: 'auto', bgcolor: 'background.paper', borderRadius: 1 }}>
                                {previewData.items.map((item: ImportedItemPreviewDTO, index: number) => (
                                    <ListItem key={index}>
                                        <ListItemIcon>
                                            {item.isValid ? <CheckCircleIcon color="success" fontSize="small" /> : <ErrorIcon color="error" fontSize="small" />}
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={`${item.tipoOperacion} ${item.cantidad} ${item.symbol}`}
                                            secondary={item.isValid ? `${item.moneda} $${item.precioUnitario}` : item.validationMessage}
                                            primaryTypographyProps={{ color: item.isValid ? 'text.primary' : 'text.secondary' }}
                                        />
                                    </ListItem>
                                ))}
                            </List>

                        </Box>
                    )}

                    {step === "CONFIRMING" && (
                        <Box sx={{ width: '100%', textAlign: 'center' }}>
                            <LinearProgress />
                            <Typography sx={{ mt: 2 }}>Guardando operaciones...</Typography>
                        </Box>
                    )}

                    {step === "SUCCESS" && (
                        <Box sx={{ textAlign: 'center' }}>
                            <CheckCircleIcon color="success" sx={{ fontSize: 64, mb: 2 }} />
                            <Typography variant="h6" gutterBottom>Importación Exitosa</Typography>
                            <Typography color="text.secondary">Tus operaciones han sido registradas.</Typography>
                        </Box>
                    )}

                    {step === "ERROR" && (
                        <Box sx={{ textAlign: 'center' }}>
                            <ErrorIcon color="error" sx={{ fontSize: 64, mb: 2 }} />
                            <Typography variant="h6" gutterBottom>Error</Typography>
                            <Typography color="error">{errorMessage}</Typography>
                        </Box>
                    )}

                </Box>
            </DialogContent>
            <DialogActions>
                {step === "UPLOAD" && (
                    <>
                        <Button onClick={handleClose}>Cancelar</Button>
                        <Button onClick={analyze} variant="contained" disabled={!file}>Analizar</Button>
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
                        >
                            Confirmar Importación
                        </Button>
                    </>
                )}
                {step === "SUCCESS" && (
                    <Button onClick={handleSuccessClose} variant="contained">Finalizar</Button>
                )}
                {step === "ERROR" && (
                    <Button onClick={retry}>Intentar de nuevo</Button>
                )}
            </DialogActions>
        </Dialog>
    );
}
