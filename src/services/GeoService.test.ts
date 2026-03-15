import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getRegisterGeoData } from './GeoService';
import { http } from '@/lib/http';

vi.mock('@/lib/http', () => ({
    http: {
        get: vi.fn(),
    }
}));

describe('GeoService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('getRegisterGeoData calls correct endpoint', async () => {
        (http.get as any).mockResolvedValue({ data: { paises: [] } });
        await getRegisterGeoData();
        expect(http.get).toHaveBeenCalledWith('/geo/register-data');
    });
});
