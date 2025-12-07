import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

import styles from './styles/NeonLoader.module.css';

interface NeonLoaderProps {
    message?: string;
    size?: number;
}

const NeonLoader: React.FC<NeonLoaderProps> = ({ message = "Cargando...", size = 60 }) => {
    return (
        <Box className={styles.container}>
            <Box className={styles.loaderWrapper}>
                {/* Outer glow effect */}
                <Box
                    className={styles.glowEffect}
                    sx={{ width: size, height: size }}
                />
                <CircularProgress
                    size={size}
                    thickness={4}
                    className={styles.circularProgress}
                    sx={{
                        '& .MuiCircularProgress-circle': { strokeLinecap: 'round' } // Keeping this specific nested selector in sx for safety alongside the class
                    }}
                />
            </Box>
            <Typography variant="h6" className={styles.loadingText}>
                {message}
            </Typography>
        </Box>
    );
};

export default NeonLoader;
