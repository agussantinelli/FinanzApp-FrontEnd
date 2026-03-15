import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useRecomendaciones } from './useRecomendaciones';
import * as service from '@/services/RecomendacionesService';

vi.mock('@/services/RecomendacionesService', () => ({
    getRecomendacionesBySector: vi.fn(),
    getRecomendacionesEnCursoByAutor: vi.fn(),
    getRecomendacionesByAutor: vi.fn(),
    getRecomendacionesByActivo: vi.fn(),
    getRecomendacionesByHorizonte: vi.fn(),
    getRecomendacionesByRiesgo: vi.fn(),
    getRecomendacionesActivasPendientes: vi.fn(),
    getRecomendacionesAdmin: vi.fn(),
    getRecomendaciones: vi.fn(),
    getRecomendacionesRecientes: vi.fn(),
}));

vi.mock('@/lib/recomendaciones-cache', () => ({
    cacheRecomendaciones: vi.fn(),
    getAllRecomendacionesFromCache: vi.fn(() => []),
}));

describe('useRecomendaciones hook', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should load generic recommendations on mount', async () => {
        (service.getRecomendaciones as any).mockResolvedValue([{ id: '1' }]);
        const { result } = renderHook(() => useRecomendaciones());

        await act(async () => { /* wait */ });

        expect(service.getRecomendaciones).toHaveBeenCalledWith(true);
        expect(result.current.data).toHaveLength(1);
    });

    it('should apply filters and reload', async () => {
        (service.getRecomendaciones as any).mockResolvedValue([]);
        (service.getRecomendacionesBySector as any).mockResolvedValue([{ id: 'sec-1' }]);
        
        const { result } = renderHook(() => useRecomendaciones());

        await act(async () => {
            result.current.applyFilters({ sectorId: '1' });
        });

        expect(service.getRecomendacionesBySector).toHaveBeenCalledWith('1', true);
    });

    it('should filter by horizonte and reload', async () => {
        (service.getRecomendacionesByHorizonte as any).mockResolvedValue([{ id: 'h-1' }]);
        const { result } = renderHook(() => useRecomendaciones());

        await act(async () => {
            result.current.applyFilters({ horizonteId: 1 });
        });

        expect(service.getRecomendacionesByHorizonte).toHaveBeenCalledWith(1, true);
        expect(result.current.data[0].id).toBe('h-1');
    });

    it('should filter by autor and reload', async () => {
        (service.getRecomendacionesByAutor as any).mockResolvedValue([{ id: 'a-1' }]);
        const { result } = renderHook(() => useRecomendaciones());

        await act(async () => {
            result.current.applyFilters({ autorId: 'expert-1' });
        });

        expect(service.getRecomendacionesByAutor).toHaveBeenCalledWith('expert-1', true);
    });

    it('should handle errors during fetch gracefully', async () => {
        (service.getRecomendaciones as any).mockRejectedValue(new Error('Network Error'));
        const { result } = renderHook(() => useRecomendaciones());

        await act(async () => { /* wait */ });

        expect(result.current.error).toBe('No se pudieron cargar las recomendaciones.');
        expect(result.current.loading).toBe(false);
    });

    it('should clear filters and reload default', async () => {
        (service.getRecomendacionesBySector as any).mockResolvedValue([{ id: 'sec-1' }]);
        (service.getRecomendaciones as any).mockResolvedValue([{ id: 'def-1' }]);

        const { result } = renderHook(() => useRecomendaciones());
        await act(async () => {
            result.current.applyFilters({ sectorId: '1' });
        });
        
        expect(result.current.data[0].id).toBe('sec-1');

        await act(async () => {
            result.current.clearFilters();
        });

        expect(service.getRecomendaciones).toHaveBeenCalledTimes(2); // Mount + Clear
        expect(result.current.data[0].id).toBe('def-1');
    });
});
