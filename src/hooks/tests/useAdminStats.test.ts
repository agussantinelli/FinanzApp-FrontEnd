import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAdminStats } from '../useAdminStats';
import { getDashboardStats, getAdminPortfolioStats } from '@/services/AdminService';

vi.mock('@/services/AdminService', () => ({
    getDashboardStats: vi.fn(),
    getAdminPortfolioStats: vi.fn(),
}));

describe('useAdminStats hook', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should load stats on mount', async () => {
        (getDashboardStats as any).mockResolvedValue({ totalUsers: 5 });
        (getAdminPortfolioStats as any).mockResolvedValue({ globalValuation: 500 });
        
        const { result } = renderHook(() => useAdminStats());

        await act(async () => { /* wait */ });

        expect(getDashboardStats).toHaveBeenCalled();
        expect(getAdminPortfolioStats).toHaveBeenCalled();
        expect(result.current.params.stats).toBeDefined();
    });
});
