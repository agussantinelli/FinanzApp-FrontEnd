import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDolarData } from './useDolarData';
import { getCotizacionesDolar } from '@/services/DolarService';

vi.mock('@/services/DolarService', () => ({
    getCotizacionesDolar: vi.fn(),
}));

describe('useDolarData hook', () => {
    const mockDolar = [
        { nombre: 'Dólar Blue', venta: 1200 },
        { nombre: 'Dólar Oficial', venta: 800 },
    ];

    beforeEach(() => {
        vi.clearAllMocks();
        (getCotizacionesDolar as any).mockResolvedValue(mockDolar);
    });

    it('should load dolar quotes on mount', async () => {
        const { result } = renderHook(() => useDolarData());

        await act(async () => { /* wait */ });

        expect(getCotizacionesDolar).toHaveBeenCalled();
        expect(result.current.firstRow[0].nombre).toBe('Blue');
    });

    it('should normalize names', () => {
        const { result } = renderHook(() => useDolarData());
        expect(result.current.normalizeName('CONTADO CON LIQUI')).toBe('CCL');
        expect(result.current.normalizeName('Dolar BLUE')).toBe('Blue');
    });
});
