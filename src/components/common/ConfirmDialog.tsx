import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box
} from '@mui/material';

interface ConfirmDialogProps {
    open: boolean;
    title: string;
    content: string | React.ReactNode;
    onClose: () => void;
    onConfirm: () => void;
    confirmText?: string;
    cancelText?: string;
    confirmColor?: "primary" | "error" | "warning" | "success" | "info" | "secondary";
    loading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    open,
    title,
    content,
    onClose,
    onConfirm,
    confirmText = "Aceptar",
    cancelText = "Cancelar",
    confirmColor = "primary",
    loading = false
}) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="xs"
            fullWidth
            PaperProps={{
                sx: { borderRadius: 2 }
            }}
        >
            <DialogTitle sx={{ fontWeight: 600 }}>
                {title}
            </DialogTitle>
            <DialogContent>
                <Box sx={{ mt: 1 }}>
                    {typeof content === 'string' ? (
                        <Typography variant="body1" color="text.secondary">
                            {content}
                        </Typography>
                    ) : (
                        content
                    )}
                </Box>
            </DialogContent>
            <DialogActions sx={{ p: 2, pt: 1 }}>
                <Button
                    onClick={onClose}
                    color="inherit"
                    variant="text"
                    disabled={loading}
                >
                    {cancelText}
                </Button>
                <Button
                    onClick={onConfirm}
                    color={confirmColor}
                    variant="contained"
                    autoFocus
                    disabled={loading}
                    disableElevation
                >
                    {confirmText}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
