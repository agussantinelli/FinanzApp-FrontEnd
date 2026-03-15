import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useActivosFilters } from './useActivosFilters';
import { getActivosNoMoneda, searchActivos } from '@/services/ActivosService';
import { getTiposActivoNoMoneda } from '@/services/TipoActivosService';
import { getSectores } from '@/services/SectorService';

vi.mock('@/services/ActivosService', () => ({
    getActivosNoMoneda: vi.fn(),
    getActivosByTipoId: vi.fn(),
    getActivosBySector: vi.fn(),
    getActivosByTipoAndSector: vi.fn(),
    searchActivos: vi.fn(),
    getRankingActivos: vi.fn(),
    getActivosFavoritos: vi.fn(),
}));

vi.mock('@/services/TipoActivosService', () => ({
    getTiposActivoNoMoneda: vi.fn(),
}));

vi.mock('@/services/SectorService', () => ({
    getSectores: vi.fn(),
}));

vi.mock('@/lib/activos-cache', () => ({
    getAllActivosFromCache: vi.fn(() => []),
    cacheActivos: vi.fn(),
}));

describe('useActivosFilters hook', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        (getTiposActivoNoMoneda as any).mockResolvedValue([]);
        (getSectores as any).mockResolvedValue([]);
        (getActivosNoMoneda as any).mockResolvedValue([]);
        (getRankingActivos as any).mockResolvedValue([]);
    });

    it('should initial metadata and assets', async () => {
        const { result } = renderHook(() => useActivosFilters());

        await act(async () => {
            // Wait for useEffects
        });

        expect(getTiposActivoNoMoneda).toHaveBeenCalled();
        expect(getSectores).toHaveBeenCalled();
        expect(getRankingActivos).toHaveBeenCalled();
    });

    it('should handle search term debounced', async () => {
        vi.useFakeTimers();
        (searchActivos as any).mockResolvedValue([{ id: '1', symbol: 'AAPL' }]);
        
        const { result } = renderHook(() => useActivosFilters());

        act(() => {
            result.current.setSearchTerm('AA');
        });

        act(() => {
            vi.advanceTimersByTime(300);
        });

        expect(searchActivos).toHaveBeenCalledWith('AA');
        vi.useRealTimers();
    });

    it('should reset filters', async () => {
        const { result } = renderHook(() => useActivosFilters());

        act(() => {
            result.current.setSearchTerm('test');
            result.current.setSelectedCurrency('USD');
        });

        expect(result.current.searchTerm).toBe('test');

        act(() => {
            result.current.resetFilters();
        });

        expect(result.current.searchTerm).toBe("");
        expect(result.current.selectedCurrency).toBe("Todos");
    });
});
