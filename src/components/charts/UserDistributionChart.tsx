import React, { useMemo } from 'react';
import { Box, Skeleton, useTheme } from '@mui/material';
import { UserDTO } from '@/types/Usuario';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    ChartOptions
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

interface Props {
    users: UserDTO[];
}

export default function UserDistributionChart({ users }: Props) {
    const theme = useTheme();

    const userDistribution = useMemo(() => {
        if (!users) return [0, 0, 0];

        let adminCount = 0;
        let expertoCount = 0;
        let inversorCount = 0;

        users.forEach(u => {
            const role = u.rol?.toLowerCase();

            if (role === 'admin' || role === 'administrador') {
                adminCount++;
            } else if (role === 'experto') {
                expertoCount++;
            } else {
                inversorCount++;
            }
        });

        return [adminCount, expertoCount, inversorCount];
    }, [users]);

    const chartData = {
        labels: ['Administradores', 'Expertos', 'Inversores'],
        datasets: [
            {
                data: userDistribution,
                backgroundColor: [
                    '#FF4081',
                    '#7B1FA2',
                    '#2196F3',
                ],
                borderColor: theme.palette.background.paper,
                borderWidth: 2,
                hoverOffset: 4
            },
        ],
    };

    const chartOptions: ChartOptions<'doughnut'> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right' as const,
                labels: {
                    color: theme.palette.text.primary,
                    font: {
                        family: "'Inter', sans-serif",
                        size: 12
                    },
                    usePointStyle: true,
                    padding: 20
                }
            }
        },
        cutout: '70%',
    };

    if (!users || users.length === 0) {
        return <Skeleton variant="circular" width={200} height={200} />;
    }

    return (
        <Box sx={{ flexGrow: 1, position: 'relative', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
            <Doughnut data={chartData} options={chartOptions} />
        </Box>
    );
}
