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

    it('getCotizacionesDolar calls correct endpoint with no-cache', async () => {
        (http.get as any).mockResolvedValue({ data: [] });
        await getCotizacionesDolar();
        expect(http.get).toHaveBeenCalledWith('/api/dolar/cotizaciones', {
            headers: { "Cache-Control": "no-cache" }
        });
    });

    it('returns empty array on error', async () => {
        (http.get as any).mockRejectedValue(new Error('Fail'));
        const res = await getCotizacionesDolar();
        expect(res).toEqual([]);
    });
});
