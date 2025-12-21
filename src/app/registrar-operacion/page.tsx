"use client";

import { Box, Paper, Typography, Container, Button } from "@mui/material";
import PageHeader from "@/components/ui/PageHeader";
import { useRouter } from "next/navigation";

export default function RegistrarOperacionPage() {
    const router = useRouter();

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <PageHeader
                title="Registrar Operación"
                subtitle="Nueva Transacción"
                description="Selecciona un activo para registrar una compra o venta."
            />

            <Paper sx={{ p: 4, mt: 3, textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom>
                    Esta funcionalidad está en construcción.
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                    Próximamente podrás buscar activos y registrar tus operaciones de compra y venta manualmente aquí.
                </Typography>
                <Button variant="outlined" onClick={() => router.back()}>
                    Volver
                </Button>
            </Paper>
        </Container>
    );
}
