"use client";

import React from 'react';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    ChartOptions
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { Box, Paper, Typography, useTheme } from '@mui/material';
import { ActivoEnPortafolioDTO } from '@/types/Portafolio';
import { formatARS, formatPercentage, formatUSD } from '@/utils/format';

ChartJS.register(ArcElement, Tooltip, Legend);

interface Props {
    activos: ActivoEnPortafolioDTO[];
    totalPesos?: number;
    totalDolares?: number;
}

export default function PortfolioCompositionChart({ activos, totalPesos, totalDolares }: Props) {
    const theme = useTheme();

    // Calculate Implied Exchange Rate (CCL)
    const ccl = (totalPesos && totalDolares) ? totalPesos / totalDolares : 1;

    // Normalize Data to USD
    const normalizedData = activos.map(a => {
        const currency = a.moneda || "ARS";
        const isUSD = currency === 'USD' || currency === 'USDT' || currency === 'USDC';

        if (isUSD) {
            return a.valorizadoNativo;
        } else {
            return ccl > 0 ? a.valorizadoNativo / ccl : 0;
        }
    });

    // Color Palette - Premium Gradients/Shades
    const colors = [
        '#2196F3', // Blue
        '#9C27B0', // Purple
        '#00BCD4', // Cyan
        '#FF4081', // Pink
        '#3F51B5', // Indigo
        '#4CAF50', // Green
        '#FFC107', // Amber
        '#607D8B', // Blue Grey
    ];

    const data = {
        labels: activos.map(a => `${a.symbol} (${formatPercentage(a.porcentajeCartera)}%)`),
        datasets: [
            {
                data: normalizedData,
                backgroundColor: colors.slice(0, activos.length),
                borderColor: theme.palette.background.paper,
                borderWidth: 2,
                hoverOffset: 12, // 3D-like pop effect
            },
        ],
    };

    const options: ChartOptions<'doughnut'> = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%', // Thinner ring for modern look
        plugins: {
            legend: {
                position: 'right' as const,
                labels: {
                    font: {
                        family: "'Inter', sans-serif",
                        size: 12,
                    },
                    padding: 20,
                    usePointStyle: true,
                    color: theme.palette.text.primary,
                },
            },
            tooltip: {
                backgroundColor: 'rgba(0,0,0,0.8)',
                padding: 12,
                titleFont: { size: 14, weight: 'bold' },
                bodyFont: { size: 13 },
                callbacks: {
                    label: (context) => {
                        // We show the normalized USD value for consistency
                        const val = context.raw as number;
                        return ` ${formatUSD(val)}`;
                    }
                }
            },
        },
        // Optional: add subtle animation
        animation: {
            animateScale: true,
            animateRotate: true
        }
    };

    // Calculate total value for center text if needed, or just strict chart
    // Center text is tricky in pure ChartJS without plugins, so we overlay a Box.

    return (
        <Paper
            elevation={0}
            variant="outlined"
            sx={{
                p: 3,
                height: 350,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative' // For overlay
            }}
        >
            <Typography variant="h6" gutterBottom align="left" width="100%" sx={{ fontWeight: 600, mb: 2 }}>
                Composición
            </Typography>

            <Box sx={{ position: 'relative', width: '100%', height: '100%', maxHeight: 250 }}>
                {activos.length > 0 ? (
                    <Doughnut data={data} options={options} />
                ) : (
                    <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                        <Typography variant="body2" color="text.secondary">Sin datos</Typography>
                    </Box>
                )}

                {/* Center Text (Total Value or Tag) - optional 3D effect */}
                {activos.length > 0 && (
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '0',
                            width: '100%', // Full width container
                            // But since legend is right, chart is centered in remaining space? 
                            // Actually ChartJS centers it generally. 
                            // We might skip center text to ensure alignment isn't messy with legend.
                            // Let's just do chart.
                            display: 'none'
                        }}
                    >
                    </Box>
                )}
            </Box>
        </Paper>
    );
}
