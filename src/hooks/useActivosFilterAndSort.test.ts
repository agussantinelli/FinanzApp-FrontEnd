import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
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
        (getTiposActivoNoMoneda as any).mockResolvedValue([{ id: 1, nombre: 'Accion' }]);
        (getSectores as any).mockResolvedValue([{ id: '1', nombre: 'Tecnologia' }]);
    });

    it('should filter by search term', async () => {
        const { result } = renderHook(() => useActivosFilterAndSort(mockActivos as any));

        await act(async () => {
            result.current.setSearchTerm('btc');
        });

        expect(result.current.filteredAndSortedActivos).toHaveLength(1);
        expect(result.current.filteredAndSortedActivos[0].symbol).toBe('BTC');
    });

    it('should filter by type', async () => {
        const { result } = renderHook(() => useActivosFilterAndSort(mockActivos as any));

        // Wait until metadata is loaded into state
        await waitFor(() => expect(result.current.tipos).toHaveLength(1));

        await act(async () => {
            result.current.setSelectedType(1);
        });

        expect(result.current.filteredAndSortedActivos).toHaveLength(1);
        expect(result.current.filteredAndSortedActivos[0].symbol).toBe('AAPL');
    });

    it('should sort assets', async () => {
        const { result } = renderHook(() => useActivosFilterAndSort(mockActivos as any));

        // Initial sort is symbol asc: AAPL, BTC
        expect(result.current.filteredAndSortedActivos[0].symbol).toBe('AAPL');

        await act(async () => {
            result.current.handleRequestSort('symbol'); // Toggles to desc
        });

        expect(result.current.filteredAndSortedActivos[0].symbol).toBe('BTC');
    });
});
