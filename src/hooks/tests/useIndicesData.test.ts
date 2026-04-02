import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useIndicesData } from '../useIndicesData';
import { getIndices } from '@/services/StocksService';

vi.mock('@/services/StocksService', () => ({
    getIndices: vi.fn(),
}));

describe('useIndicesData hook', () => {
    const mockIndices = [
        { usSymbol: 'SPY', localSymbol: 'SPY', dollarRateName: 'SPY' },
        { localSymbol: 'MERVAL' },
    ];

    beforeEach(() => {
        vi.clearAllMocks();
        (getIndices as any).mockResolvedValue(mockIndices);
    });

    it('should load indices on mount', async () => {
        const { result } = renderHook(() => useIndicesData());

        await act(async () => { /* wait */ });

        expect(getIndices).toHaveBeenCalled();
        expect(result.current.row1).toHaveLength(1);
        expect(result.current.national).toHaveLength(1);
    });
});
