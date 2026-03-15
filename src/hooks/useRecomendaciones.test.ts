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
});
