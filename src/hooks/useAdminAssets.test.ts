import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAdminAssets } from './useAdminAssets';
import { getActivosNoMoneda, createActivo, updateActivo, deleteActivo } from '@/services/ActivosService';

vi.mock('@/services/ActivosService', () => ({
    getActivosNoMoneda: vi.fn(),
    createActivo: vi.fn(),
    updateActivo: vi.fn(),
    deleteActivo: vi.fn(),
}));

describe('useAdminAssets hook', () => {
    const mockActivos = [{ id: '1', symbol: 'AAPL' }];

    beforeEach(() => {
        vi.clearAllMocks();
        (getActivosNoMoneda as any).mockResolvedValue(mockActivos);
    });

    it('should load assets on mount', async () => {
        const { result } = renderHook(() => useAdminAssets());

        await act(async () => { /* wait items load */ });

        expect(getActivosNoMoneda).toHaveBeenCalled();
        expect(result.current.activos).toEqual(mockActivos);
    });

    it('should add asset and reload', async () => {
        const { result } = renderHook(() => useAdminAssets());
        const newAsset = { symbol: 'MSFT' } as any;

        await act(async () => {
            await result.current.addAsset(newAsset);
        });

        expect(createActivo).toHaveBeenCalledWith(newAsset);
        expect(getActivosNoMoneda).toHaveBeenCalledTimes(2);
    });

    it('should handle errors when loading', async () => {
        (getActivosNoMoneda as any).mockRejectedValue(new Error('Fail'));
        const { result } = renderHook(() => useAdminAssets());

        await act(async () => { /* wait */ });

        expect(result.current.error).toBe("Error al cargar la lista de activos.");
    });
});
