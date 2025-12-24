import { useState, useCallback, useEffect } from 'react';
import { AdminStatsDTO, AdminPortfolioStatsDTO } from '@/types/Admin';
import { getDashboardStats, getAdminPortfolioStats } from '@/services/AdminService';

export function useAdminStats() {
    const [stats, setStats] = useState<AdminStatsDTO | null>(null);
    const [portfolioStats, setPortfolioStats] = useState<AdminPortfolioStatsDTO | null>(null);
    const [loading, setLoading] = useState(false);

    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            const [statsData, portStatsData] = await Promise.all([
                getDashboardStats(),
                getAdminPortfolioStats(),
            ]);
            setStats(statsData);
            setPortfolioStats(portStatsData);
        } catch (error) {
            console.error('Error loading admin stats:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    return { params: { stats, portfolioStats, loading, loadData } };
}
