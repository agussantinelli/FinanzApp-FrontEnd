import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePortfolioData } from '../usePortfolioData';
import { useAuth } from '@/hooks/useAuth';
import { getMisPortafolios, getPortafolioValuado } from '@/services/PortafolioService';

vi.mock('@/hooks/useAuth', () => ({
    useAuth: vi.fn(() => ({ isAuthenticated: true })),
}));

vi.mock('@/services/PortafolioService', () => ({
    getMisPortafolios: vi.fn(),
    getPortafolioValuado: vi.fn(),
}));

describe('usePortfolioData hook', () => {
    const mockPortfolios = [{ id: 'p1', nombre: 'P1' }];

    beforeEach(() => {
        vi.clearAllMocks();
        (getMisPortafolios as any).mockResolvedValue(mockPortfolios);
        (getPortafolioValuado as any).mockResolvedValue({ id: 'p1', totalDolares: 100 });
    });

    it('should load portfolios on mount and select first', async () => {
        const { result } = renderHook(() => usePortfolioData());

        await act(async () => { /* wait */ });

        expect(getMisPortafolios).toHaveBeenCalled();
        expect(result.current.selectedId).toBe('p1');
        expect(getPortafolioValuado).toHaveBeenCalledWith('p1');
    });

    it('should change portfolio', async () => {
        const { result } = renderHook(() => usePortfolioData());

        await act(async () => { /* wait initial load */ });

        await act(async () => {
            result.current.handlePortfolioChange('p2');
        });

        expect(result.current.selectedId).toBe('p2');
        expect(getPortafolioValuado).toHaveBeenCalledWith('p2');
    });
});
