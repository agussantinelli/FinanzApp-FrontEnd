import { useState, useCallback } from 'react';
import { AdminStatsDTO, AdminPortfolioStatsDTO } from '@/types/Admin';
import { UserDTO } from '@/types/Usuario';
import { OperacionResponseDTO } from '@/types/Operacion';
import { ActivoDTO } from '@/types/Activo';
import {
    getDashboardStats,
    getAdminPortfolioStats,
    getUsers,
    getAllOperations,
} from '@/services/AdminService';
import { getActivosNoMoneda } from '@/services/ActivosService';

export function useAdminData() {
    const [stats, setStats] = useState<AdminStatsDTO | null>(null);
    const [portfolioStats, setPortfolioStats] = useState<AdminPortfolioStatsDTO | null>(null);
    const [users, setUsers] = useState<UserDTO[]>([]);
    const [operations, setOperations] = useState<OperacionResponseDTO[]>([]);
    const [activos, setActivos] = useState<ActivoDTO[]>([]);
    const [loading, setLoading] = useState(false);

    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            const [statsData, portStatsData, usersData, opsData, activosData] = await Promise.all([
                getDashboardStats(),
                getAdminPortfolioStats(),
                getUsers(),
                getAllOperations(),
                getActivosNoMoneda(),
            ]);
            setStats(statsData);
            setPortfolioStats(portStatsData);
            setUsers(usersData);
            setOperations(opsData);
            setActivos(activosData);
        } catch (error) {
            console.error('Error loading admin data:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        stats,
        portfolioStats,
        users,
        operations,
        activos,
        loading,
        loadData,
    };
}
