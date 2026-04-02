import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useStocksData } from '../useStocksData';
import { getStockDuals } from '@/services/StocksService';
import { getCotizacionesDolar } from '@/services/DolarService';

vi.mock('@/services/StocksService', () => ({
    getStockDuals: vi.fn(),
}));

vi.mock('@/services/DolarService', () => ({
    getCotizacionesDolar: vi.fn(),
}));

describe('useStocksData hook', () => {
    const mockStocks = [
        { localSymbol: 'YPFD.BA', usedDollarRate: 1000 },
    ];

    beforeEach(() => {
        vi.clearAllMocks();
        (getStockDuals as any).mockResolvedValue(mockStocks);
        (getCotizacionesDolar as any).mockResolvedValue([]);
    });

    it('should load stocks on mount', async () => {
        const { result } = renderHook(() => useStocksData());

        await act(async () => { /* wait */ });

        expect(getStockDuals).toHaveBeenCalled();
        expect(result.current.rowsEnergetico).toHaveLength(1);
    });
});
