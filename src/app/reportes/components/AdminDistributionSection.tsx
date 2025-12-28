import React from 'react';
import { Paper, Typography, Box, Skeleton } from '@mui/material';
import { useAdminUsers } from '@/hooks/useAdminUsers';
import UserDistributionChart from '@/components/charts/UserDistributionChart';
import styles from '../styles/Reportes.module.css';

export default function AdminDistributionSection() {
    const { users, loading } = useAdminUsers();

    if (loading && users.length === 0) {
        return (
            <Paper className={styles.gradientCard} sx={{ p: 3, height: '100%' }}>
                <Typography variant="h6" gutterBottom>Distribución de Usuarios</Typography>
                <Box display="flex" justifyContent="center" alignItems="center" height={300}>
                    <Skeleton variant="circular" width={200} height={200} />
                </Box>
            </Paper>
        );
    }

    return (
        <Paper className={styles.gradientCard} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>Distribución de Usuarios (Admin)</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Visualización exclusiva de la base de usuarios actual.
            </Typography>
            <Box sx={{ height: 300, display: 'flex', justifyContent: 'center' }}>
                <UserDistributionChart users={users} />
            </Box>
        </Paper>
    );
}
