import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

interface NeonLoaderProps {
    message?: string;
    size?: number;
}

const NeonLoader: React.FC<NeonLoaderProps> = ({ message = "Cargando...", size = 60 }) => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '200px',
                width: '100%',
                p: 4,
            }}
        >
            <Box
                sx={{
                    position: 'relative',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                {/* Outer glow effect */}
                <Box
                    sx={{
                        position: 'absolute',
                        width: size,
                        height: size,
                        borderRadius: '50%',
                        boxShadow: '0 0 20px #39FF14, 0 0 40px #39FF14', // Neon Green Glow
                        opacity: 0.6,
                        animation: 'pulse 1.5s ease-in-out infinite',
                        '@keyframes pulse': {
                            '0%': { transform: 'scale(0.95)', opacity: 0.5 },
                            '50%': { transform: 'scale(1.1)', opacity: 0.8 },
                            '100%': { transform: 'scale(0.95)', opacity: 0.5 },
                        },
                    }}
                />
                <CircularProgress
                    size={size}
                    thickness={4}
                    sx={{
                        color: '#39FF14', // Neon Green
                        filter: 'drop-shadow(0 0 5px #39FF14)',
                        zIndex: 1,
                        '& .MuiCircularProgress-circle': {
                            strokeLinecap: 'round',
                        }
                    }}
                />
            </Box>
            <Typography
                variant="h6"
                sx={{
                    mt: 3,
                    color: '#39FF14', // Neon Green Text
                    fontWeight: 'bold',
                    textShadow: '0 0 10px rgba(57, 255, 20, 0.5)',
                    letterSpacing: 1,
                    animation: 'blink 2s linear infinite',
                    '@keyframes blink': {
                        '0%, 100%': { opacity: 1 },
                        '50%': { opacity: 0.6 },
                    },
                }}
            >
                {message}
            </Typography>
        </Box>
    );
};

export default NeonLoader;
