import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useActivosFilters } from './useActivosFilters';
import * as ActivosService from '@/services/ActivosService';
import * as TipoActivosService from '@/services/TipoActivosService';
import * as SectorService from '@/services/SectorService';
import * as ActivosCache from '@/lib/activos-cache';

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
    getAllActivosFromCache: vi.fn(),
    cacheActivos: vi.fn(),
}));

describe('useActivosFilters hook', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.useRealTimers();
        (TipoActivosService.getTiposActivoNoMoneda as any).mockResolvedValue([]);
        (SectorService.getSectores as any).mockResolvedValue([]);
        (ActivosService.getActivosNoMoneda as any).mockResolvedValue([]);
        (ActivosService.getRankingActivos as any).mockResolvedValue([]);
        (ActivosService.getActivosFavoritos as any).mockResolvedValue([]);
        (ActivosService.getActivosByTipoId as any).mockResolvedValue([]);
        (ActivosService.getActivosBySector as any).mockResolvedValue([]);
        (ActivosService.getActivosByTipoAndSector as any).mockResolvedValue([]);
        (ActivosCache.getAllActivosFromCache as any).mockReturnValue([]);
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('should initial metadata and assets', async () => {
        const { result } = renderHook(() => useActivosFilters());

        await waitFor(() => {
            expect(TipoActivosService.getTiposActivoNoMoneda).toHaveBeenCalled();
            expect(SectorService.getSectores).toHaveBeenCalled();
        });
    });

    it('should handle search term debounced', async () => {
        // Use fake timers but don't use waitFor, manually advance and check
        vi.useFakeTimers();
        (ActivosService.searchActivos as any).mockResolvedValue([{ id: '1', symbol: 'AAPL' }]);
        
        const { result } = renderHook(() => useActivosFilters());

        act(() => {
            result.current.setSearchTerm('AA');
        });

        act(() => {
            vi.advanceTimersByTime(300);
        });

        // Use a small tick to allow promised from searchActivos to resolve
        await act(async () => {
            vi.runAllTicks();
        });

        expect(ActivosService.searchActivos).toHaveBeenCalledWith('AA');
    });

    it('should reset filters', async () => {
        const { result } = renderHook(() => useActivosFilters());

        act(() => {
            result.current.setSearchTerm('test');
            result.current.handleCurrencyChange({ target: { value: 'USD' } } as any);
        });

        expect(result.current.searchTerm).toBe('test');

        act(() => {
            result.current.resetFilters();
        });

        expect(result.current.searchTerm).toBe("");
        expect(result.current.selectedCurrency).toBe("Todos");
    });

    it('should sort assets by marketCap DESC and ASC', async () => {
        const mockAssets = [
            { id: '1', symbol: 'A', marketCap: 100 },
            { id: '2', symbol: 'B', marketCap: 200 }
        ] as any;
        (ActivosService.getRankingActivos as any).mockResolvedValue(mockAssets);
        
        const { result } = renderHook(() => useActivosFilters());
        
        await waitFor(() => {
            expect(result.current.activos).toHaveLength(2);
        });

        expect(result.current.activos[0].id).toBe('2'); 

        act(() => {
            result.current.handleRequestSort('marketCap');
        });
        
        await waitFor(() => {
            expect(result.current.activos[0].id).toBe('1');
        });
    });

    it('should sort assets by precio DESC and ASC', async () => {
        const mockAssets = [
            { id: '1', symbol: 'A', precioActual: 10, marketCap: 100 },
            { id: '2', symbol: 'B', precioActual: 50, marketCap: 100 }
        ] as any;
        (ActivosService.getRankingActivos as any).mockResolvedValue(mockAssets);
        
        const { result } = renderHook(() => useActivosFilters());
        await waitFor(() => expect(result.current.activos.length).toBeGreaterThan(0));

        act(() => {
            result.current.handleRequestSort('precio');
        });
        
        await waitFor(() => {
            expect(result.current.activos[0].id).toBe('2');
        });

        act(() => {
            result.current.handleRequestSort('precio');
        });
        
        await waitFor(() => {
            expect(result.current.activos[0].id).toBe('1');
        });
    });

    it('should filter by currency', async () => {
        const mockAssets = [
            { id: '1', symbol: 'USD_A', monedaBase: 'USD', marketCap: 100 },
            { id: '2', symbol: 'ARS_B', monedaBase: 'ARS', marketCap: 100 }
        ] as any;
        (ActivosService.getRankingActivos as any).mockResolvedValue(mockAssets);
        
        const { result } = renderHook(() => useActivosFilters());
        await waitFor(() => expect(result.current.activos.length).toBe(2));

        act(() => {
            result.current.handleCurrencyChange({ target: { value: 'USD' } } as any);
        });

        await waitFor(() => {
            expect(result.current.activos).toHaveLength(1);
            expect(result.current.activos[0].monedaBase).toBe('USD');
        });
    });

    it('should combine multiple filters (Type + Currency)', async () => {
        const mockTypes = [{ id: 1, nombre: 'Accion' }] as any;
        (TipoActivosService.getTiposActivoNoMoneda as any).mockResolvedValue(mockTypes);
        const mockAssets = [
            { id: '1', symbol: 'A', tipo: 'Accion', monedaBase: 'USD', marketCap: 100 },
        ] as any;
        // Hook calls getActivosByTipoId when selectedType is not "Todos"
        (ActivosService.getActivosByTipoId as any).mockResolvedValue(mockAssets);
        
        const { result } = renderHook(() => useActivosFilters());
        await waitFor(() => expect(result.current.tipos.length).toBeGreaterThan(0));

        act(() => {
            result.current.handleRequestSort('marketCap'); 
            result.current.handleTypeChange({ target: { value: 1 } } as any);
            result.current.handleCurrencyChange({ target: { value: 'USD' } } as any);
        });

        await waitFor(() => {
            expect(result.current.activos).toHaveLength(1);
            expect(result.current.activos[0].id).toBe('1');
        });
    });

    it('should use cache if available', async () => {
        (ActivosCache.getAllActivosFromCache as any).mockReturnValue([{ id: 'cached', symbol: 'CACHED', marketCap: 100 }]);
        
        const { result } = renderHook(() => useActivosFilters());
        
        await waitFor(() => {
            expect(result.current.activos.length).toBeGreaterThan(0);
        });
        
        expect(result.current.activos[0].symbol).toBe('CACHED');
        expect(ActivosService.getRankingActivos).not.toHaveBeenCalled();
    });

    it('should fallback to all assets if getFavorites fails', async () => {
        const fallbackData = [{ id: 'all', symbol: 'ALL', marketCap: 100 }];
        (ActivosService.getActivosFavoritos as any).mockRejectedValue(new Error('Auth failed'));
        (ActivosService.getActivosNoMoneda as any).mockResolvedValue(fallbackData);
        (ActivosService.getRankingActivos as any).mockResolvedValue(fallbackData);
        
        const { result } = renderHook(() => useActivosFilters());
        await waitFor(() => expect(result.current.loading).toBe(false));

        act(() => {
            result.current.setOnlyFavorites(true);
        });
        
        await waitFor(() => {
            expect(result.current.loading).toBe(false);
            expect(result.current.onlyFavorites).toBe(false);
            expect(result.current.activos.length).toBeGreaterThan(0);
        }, { timeout: 2000 });
        
        expect(result.current.activos[0].symbol).toBe('ALL');
    });

    it('should handle pagination', async () => {
        const mockAssets = Array.from({ length: 20 }, (_, i) => ({ id: `${i}`, symbol: `S${i}`, marketCap: 100 })) as any;
        (ActivosService.getRankingActivos as any).mockResolvedValue(mockAssets);
        
        const { result } = renderHook(() => useActivosFilters());
        await waitFor(() => expect(result.current.activos.length).toBe(20));

        expect(result.current.paginatedActivos).toHaveLength(12);
        expect(result.current.totalPages).toBe(2);

        act(() => {
            result.current.handlePageChange({} as any, 2);
        });

        await waitFor(() => {
            expect(result.current.page).toBe(2);
            expect(result.current.paginatedActivos).toHaveLength(8);
        });
    });

    it('should update specific asset in list and cache', async () => {
        const mockAssets = [{ id: '1', symbol: 'OLD', marketCap: 100 }] as any;
        (ActivosService.getRankingActivos as any).mockResolvedValue(mockAssets);
        
        const { result } = renderHook(() => useActivosFilters());
        await waitFor(() => expect(result.current.activos.length).toBe(1));

        const updated = { id: '1', symbol: 'NEW', marketCap: 100 } as any;
        act(() => {
            result.current.updateAssetInList(updated);
        });

        await waitFor(() => {
            expect(result.current.activos[0].symbol).toBe('NEW');
        });
        expect(ActivosCache.cacheActivos).toHaveBeenCalledWith([updated]);
    });
});
