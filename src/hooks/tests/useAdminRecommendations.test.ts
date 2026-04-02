import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAdminRecommendations } from '../useAdminRecommendations';
import { getRecomendacionesAdmin, destacarRecomendacion, aprobarRecomendacion } from '@/services/RecomendacionesService';

vi.mock('@/services/RecomendacionesService', () => ({
    getRecomendacionesAdmin: vi.fn(),
    destacarRecomendacion: vi.fn(),
    resolverRecomendacion: vi.fn(),
    aprobarRecomendacion: vi.fn(),
    rechazarRecomendacion: vi.fn(),
}));

describe('useAdminRecommendations hook', () => {
    const mockRecs = [{ id: 'r1', activoSymbol: 'AAPL' }];

    beforeEach(() => {
        vi.clearAllMocks();
        (getRecomendacionesAdmin as any).mockResolvedValue(mockRecs);
    });

    it('should load recommendations on mount', async () => {
        const { result } = renderHook(() => useAdminRecommendations());

        await act(async () => { /* wait */ });

        expect(getRecomendacionesAdmin).toHaveBeenCalled();
        expect(result.current.recommendations).toEqual(mockRecs);
    });

    it('should approve recommendation', async () => {
        const { result } = renderHook(() => useAdminRecommendations());

        await act(async () => {
            await result.current.aprobar('r1');
        });

        expect(aprobarRecomendacion).toHaveBeenCalledWith('r1');
    });

    it('should handle filter changes', async () => {
        const { result } = renderHook(() => useAdminRecommendations());

        await act(async () => {
            result.current.setFilter(1);
        });

        expect(getRecomendacionesAdmin).toHaveBeenLastCalledWith(1);
    });
});
