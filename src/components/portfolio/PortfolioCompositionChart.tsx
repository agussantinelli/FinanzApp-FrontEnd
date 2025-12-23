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
    currency: 'ARS' | 'USD';
}

export default function PortfolioCompositionChart({ activos, totalPesos, totalDolares, currency }: Props) {
    const theme = useTheme();

    // Calculate Implied Exchange Rate (CCL)
    const ccl = (totalPesos && totalDolares) ? totalPesos / totalDolares : 1;

    // Normalize Data based on selected currency
    const normalizedData = activos.map(a => {
        const assetCurrency = a.moneda || "ARS";
        const isAssetUSD = assetCurrency === 'USD' || assetCurrency === 'USDT' || assetCurrency === 'USDC';

        if (currency === 'USD') {
            // Target is USD
            if (isAssetUSD) return a.valorizadoNativo;
            return ccl > 0 ? a.valorizadoNativo / ccl : 0;
        } else {
            // Target is ARS
            if (!isAssetUSD) return a.valorizadoNativo;
            return a.valorizadoNativo * ccl;
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
                        size: 15, // Increased from 12
                        weight: 500
                    },
                    padding: 25, // Increased padding for better spacing
                    usePointStyle: true,
                    color: theme.palette.text.primary,
                },
            },
            tooltip: {
                backgroundColor: 'rgba(0,0,0,0.8)',
                padding: 14,
                titleFont: { size: 16, weight: 'bold' },
                bodyFont: { size: 15 },
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
                height: 450, // Slightly reduced from 500
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative' // For overlay
            }}
        >
            <Typography variant="h6" gutterBottom align="left" width="100%" sx={{ fontWeight: 600, mb: 2, fontSize: '1.2rem' }}>
                Grafico de la composición del portafolio
            </Typography>

            <Box sx={{ position: 'relative', width: '100%', height: '100%', maxHeight: 350 }}> {/* Reduced from 400 */}
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
