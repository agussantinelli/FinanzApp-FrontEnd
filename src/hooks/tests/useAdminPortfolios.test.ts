import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAdminPortfolios } from '../useAdminPortfolios';
import { getPortafoliosAdmin, getPortafolioValuado, toggleDestacado, deletePortafolio } from '@/services/PortafolioService';

vi.mock('@/services/PortafolioService', () => ({
    getPortafoliosAdmin: vi.fn(),
    getPortafolioValuado: vi.fn(),
    toggleDestacado: vi.fn(),
    deletePortafolio: vi.fn(),
    toggleTopPortafolio: vi.fn(),
}));

describe('useAdminPortfolios hook', () => {
    const mockPortfolios = [{ id: 'p1', nombre: 'P1' }];
    const mockDetail = { totalPesos: 1000, totalDolares: 10, gananciaPesos: 100, gananciaDolares: 1 };

    beforeEach(() => {
        vi.clearAllMocks();
        (getPortafoliosAdmin as any).mockResolvedValue(mockPortfolios);
        (getPortafolioValuado as any).mockResolvedValue(mockDetail);
    });

    it('should load portfolios and their details', async () => {
        const { result } = renderHook(() => useAdminPortfolios());

        await act(async () => { /* wait items load */ });

        expect(getPortafoliosAdmin).toHaveBeenCalled();
        expect(getPortafolioValuado).toHaveBeenCalledWith('p1');
        expect(result.current.portfolios[0].totalValuadoARS).toBe(1000);
    });

    it('should toggle destacado status', async () => {
        const { result } = renderHook(() => useAdminPortfolios());

        await act(async () => { /* wait items load */ });

        await act(async () => {
            await result.current.toggleDestacado('p1', false);
        });

        expect(toggleDestacado).toHaveBeenCalledWith('p1', true);
        expect(result.current.portfolios[0].esDestacado).toBe(true);
    });

    it('should handle deletion', async () => {
        window.confirm = vi.fn(() => true);
        const { result } = renderHook(() => useAdminPortfolios());

        await act(async () => { /* wait items load */ });

        await act(async () => {
            await result.current.deletePortafolio('p1');
        });

        expect(deletePortafolio).toHaveBeenCalledWith('p1');
        expect(result.current.portfolios).toHaveLength(0);
    });
});
