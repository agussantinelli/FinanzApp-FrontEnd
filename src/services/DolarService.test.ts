import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getCotizacionesDolar } from './DolarService';
import { http } from '@/lib/http';

vi.mock('@/lib/http', () => ({
    http: {
        get: vi.fn(),
    }
}));

describe('DolarService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('getCotizacionesDolar calls API with cache-control header', async () => {
        const mockData = [{ nombre: 'Oficial', compra: 800, venta: 850 }];
        (http.get as any).mockResolvedValue({ data: mockData });

        const result = await getCotizacionesDolar();

        expect(http.get).toHaveBeenCalledWith('/api/dolar/cotizaciones', {
            headers: { "Cache-Control": "no-cache" },
        });
        expect(result).toEqual(mockData);
    });

    it('getCotizacionesDolar returns empty array and logs error on failure', async () => {
        const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        (http.get as any).mockRejectedValue(new Error('Network Fail'));

        const result = await getCotizacionesDolar();

        expect(result).toEqual([]);
        expect(errorSpy).toHaveBeenCalled();
        errorSpy.mockRestore();
    });
});
