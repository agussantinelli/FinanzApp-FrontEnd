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

    const ccl = (totalPesos && totalDolares) ? totalPesos / totalDolares : 1;

    const normalizedData = activos.map(a => {
        const assetCurrency = a.moneda || "ARS";
        const isAssetUSD = assetCurrency === 'USD' || assetCurrency === 'USDT' || assetCurrency === 'USDC';

        if (currency === 'USD') {
            if (isAssetUSD) return a.valorizadoNativo;
            return ccl > 0 ? a.valorizadoNativo / ccl : 0;
        } else {
            if (!isAssetUSD) return a.valorizadoNativo;
            return a.valorizadoNativo * ccl;
        }
    });

    const colors = [
        '#2196F3',
        '#9C27B0',
        '#00BCD4',
        '#FF4081',
        '#3F51B5',
        '#4CAF50',
        '#FFC107',
        '#607D8B',
    ];

    const data = {
        labels: activos.map(a => `${a.symbol} (${formatPercentage(a.porcentajeCartera)}%)`),
        datasets: [
            {
                data: normalizedData,
                backgroundColor: colors.slice(0, activos.length),
                borderColor: theme.palette.background.paper,
                borderWidth: 2,
                hoverOffset: 12,
            },
        ],
    };

    const options: ChartOptions<'doughnut'> = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%',
        plugins: {
            legend: {
                position: 'right' as const,
                labels: {
                    font: {
                        family: "'Inter', sans-serif",
                        size: 15,
                        weight: 500
                    },
                    padding: 25,
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
                        const val = context.raw as number;
                        return ` ${formatUSD(val)}`;
                    }
                }
            },
        },
        animation: {
            animateScale: true,
            animateRotate: true
        }
    };

    return (
        <Paper
            elevation={0}
            variant="outlined"
            sx={{
                p: 3,
                height: 450,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
            }}
        >
            <Typography variant="h6" gutterBottom align="left" width="100%" sx={{ fontWeight: 700, mb: 2, fontSize: '1.5rem' }}>
                Distribución de Activos
            </Typography>

            <Box sx={{ position: 'relative', width: '100%', height: '100%', maxHeight: 350 }}> {/* Reduced from 400 */}
                {activos.length > 0 ? (
                    <Doughnut data={data} options={options} />
                ) : (
                    <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                        <Typography variant="body2" color="text.secondary">Sin datos</Typography>
                    </Box>
                )}

                {activos.length > 0 && (
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '0',
                            width: '100%',
                            display: 'none'
                        }}
                    >
                    </Box>
                )}
            </Box>
        </Paper>
    );
}
