import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAdminData } from '../useAdminData';
import { getDashboardStats, getAdminPortfolioStats, getAllOperations } from '@/services/AdminService';
import { getPersonas } from '@/services/PersonaService';
import { getActivosNoMoneda } from '@/services/ActivosService';

vi.mock('@/services/AdminService', () => ({
    getDashboardStats: vi.fn(),
    getAdminPortfolioStats: vi.fn(),
    getAllOperations: vi.fn(),
}));

vi.mock('@/services/PersonaService', () => ({
    getPersonas: vi.fn(),
}));

vi.mock('@/services/ActivosService', () => ({
    getActivosNoMoneda: vi.fn(),
}));

describe('useAdminData hook', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should load all admin data', async () => {
        (getDashboardStats as any).mockResolvedValue({ totalUsers: 10 });
        (getAdminPortfolioStats as any).mockResolvedValue({ totalValuation: 100 });
        (getPersonas as any).mockResolvedValue([{ id: '1' }]);
        (getAllOperations as any).mockResolvedValue([]);
        (getActivosNoMoneda as any).mockResolvedValue([]);

        const { result } = renderHook(() => useAdminData());

        await act(async () => {
            await result.current.loadData();
        });

        expect(getDashboardStats).toHaveBeenCalled();
        expect(getAdminPortfolioStats).toHaveBeenCalled();
        expect(getPersonas).toHaveBeenCalled();
        expect(result.current.stats).toBeDefined();
        expect(result.current.loading).toBe(false);
    });
});
