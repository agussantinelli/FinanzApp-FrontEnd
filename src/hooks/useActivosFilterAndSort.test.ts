import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useActivosFilterAndSort } from './useActivosFilterAndSort';
import { getTiposActivoNoMoneda } from '@/services/TipoActivosService';
import { getSectores } from '@/services/SectorService';

vi.mock('@/services/TipoActivosService', () => ({
    getTiposActivoNoMoneda: vi.fn(),
}));

vi.mock('@/services/SectorService', () => ({
    getSectores: vi.fn(),
}));

describe('useActivosFilterAndSort hook', () => {
    const mockActivos = [
        { id: '1', symbol: 'AAPL', nombre: 'Apple', tipo: 'Accion', sector: 'Tecnologia' },
        { id: '2', symbol: 'BTC', nombre: 'Bitcoin', tipo: 'Cripto', sector: 'Finanzas' },
    ];

    beforeEach(() => {
        vi.clearAllMocks();
        (getTiposActivoNoMoneda as any).mockResolvedValue([]);
        (getSectores as any).mockResolvedValue([]);
    });

    it('should filter by search term', () => {
        const { result } = renderHook(() => useActivosFilterAndSort(mockActivos as any));

        act(() => {
            result.current.setSearchTerm('btc');
        });

        expect(result.current.filteredAndSortedActivos).toHaveLength(1);
        expect(result.current.filteredAndSortedActivos[0].symbol).toBe('BTC');
    });

    it('should filter by type', async () => {
        const mockTipos = [{ id: 1, nombre: 'Accion' }];
        (getTiposActivoNoMoneda as any).mockResolvedValue(mockTipos);

        const { result } = renderHook(() => useActivosFilterAndSort(mockActivos as any));

        await act(async () => {
            // Wait for metadata load
        });

        act(() => {
            result.current.setSelectedType(1);
        });

        expect(result.current.filteredAndSortedActivos).toHaveLength(1);
        expect(result.current.filteredAndSortedActivos[0].tipo).toBe('Accion');
    });

    it('should sort assets', () => {
        const { result } = renderHook(() => useActivosFilterAndSort(mockActivos as any));

        act(() => {
            result.current.handleRequestSort('symbol'); // desc
        });

        expect(result.current.filteredAndSortedActivos[0].symbol).toBe('BTC');
        expect(result.current.order).toBe('desc');
    });
});
