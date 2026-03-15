import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useMyOperations } from './useMyOperations';
import { useAuth } from '@/hooks/useAuth';
import { getOperacionesByPersona } from '@/services/OperacionesService';
import { getCotizacionesDolar } from '@/services/DolarService';

vi.mock('@/hooks/useAuth', () => ({
    useAuth: vi.fn(() => ({ user: { id: 'u1' } })),
}));

vi.mock('@/services/OperacionesService', () => ({
    getOperacionesByPersona: vi.fn(),
}));

vi.mock('@/services/DolarService', () => ({
    getCotizacionesDolar: vi.fn(),
}));

describe('useMyOperations hook', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        (getOperacionesByPersona as any).mockResolvedValue([]);
        (getCotizacionesDolar as any).mockResolvedValue([{ nombre: 'CCL', venta: 1000, compra: 990 }]);
    });

    it('should load operations on mount', async () => {
        const { result } = renderHook(() => useMyOperations());

        await waitFor(() => expect(result.current.loading).toBe(false));

        expect(getOperacionesByPersona).toHaveBeenCalledWith('u1');
    });

    it('should filter operations', async () => {
        (getOperacionesByPersona as any).mockResolvedValue([
            { id: '1', tipo: 'Compra', fecha: '2024-01-01', precioUnitario: 100, totalOperado: 1000, moneda: 'ARS' },
            { id: '2', tipo: 'Venta', fecha: '2024-01-02', precioUnitario: 200, totalOperado: 2000, moneda: 'ARS' },
        ]);
        
        const { result } = renderHook(() => useMyOperations());

        await waitFor(() => expect(result.current.loading).toBe(false));

        act(() => {
            result.current.setFilterType('Compra');
        });

        expect(result.current.operaciones).toHaveLength(1);
        expect(result.current.operaciones[0].tipo).toBe('Compra');
    });
});
