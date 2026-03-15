import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useActivoDetail } from './useActivoDetail';
import { getActivoById, getActivoByTicker } from '@/services/ActivosService';
import { getRecomendacionesByActivo, getRecomendacionById } from '@/services/RecomendacionesService';
import { getActivoFromCache } from '@/lib/activos-cache';
import { getCurrentUser } from '@/services/AuthService';

vi.mock('@/services/ActivosService', () => ({
    getActivoById: vi.fn(),
    getActivoByTicker: vi.fn(),
    searchActivos: vi.fn(),
}));

vi.mock('@/services/RecomendacionesService', () => ({
    getRecomendacionesByActivo: vi.fn(),
    getRecomendacionById: vi.fn(),
}));

vi.mock('@/lib/activos-cache', () => ({
    getActivoFromCache: vi.fn(),
}));

vi.mock('@/services/AuthService', () => ({
    getCurrentUser: vi.fn(),
}));

vi.mock('next/navigation', () => ({
    useRouter: vi.fn(() => ({
        push: vi.fn(),
    })),
}));

describe('useActivoDetail hook', () => {
    const mockId = '123e4567-e89b-12d3-a456-426614174000'; // UUID
    const mockActivo = { id: 'id-1', symbol: 'AAPL', nombre: 'Apple' };
    const mockUser = { id: 'u1' };

    beforeEach(() => {
        vi.clearAllMocks();
        (getCurrentUser as any).mockReturnValue(mockUser);
    });

    it('should load asset from cache if available', async () => {
        (getActivoFromCache as any).mockReturnValue(mockActivo);
        (getRecomendacionesByActivo as any).mockResolvedValue([]);

        const { result } = renderHook(() => useActivoDetail(mockId));

        await act(async () => {
             // Wait for useEffect
        });

        expect(getActivoFromCache).toHaveBeenCalledWith(mockId);
        expect(result.current.activo).toEqual(mockActivo);
    });

    it('should load asset from API if not in cache', async () => {
        (getActivoFromCache as any).mockReturnValue(null);
        (getActivoById as any).mockResolvedValue(mockActivo);
        (getRecomendacionesByActivo as any).mockResolvedValue([]);

        const { result } = renderHook(() => useActivoDetail(mockId));

        await act(async () => {
             // Wait for useEffect
        });

        expect(getActivoById).toHaveBeenCalledWith(mockId);
        expect(result.current.activo).toEqual(mockActivo);
    });

    it('should load recommendations if user is logged in', async () => {
        (getActivoFromCache as any).mockReturnValue(mockActivo);
        const mockRecs = [{ id: 'r1' }];
        (getRecomendacionesByActivo as any).mockResolvedValue(mockRecs);
        (getRecomendacionById as any).mockResolvedValue({ id: 'r1', detalles: [{ activoId: 'id-1', opinion: 'Buy' }] });

        const { result } = renderHook(() => useActivoDetail(mockId));

        await act(async () => {
             // Wait for useEffect
        });

        expect(getRecomendacionesByActivo).toHaveBeenCalledWith('id-1', true);
        expect(result.current.activeRecommendations).toHaveLength(1);
    });
});
