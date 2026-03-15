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

    it('getRegisterGeoData calls API', async () => {
        const mockData = { paises: [] };
        (http.get as any).mockResolvedValue({ data: mockData });

        const result = await getRegisterGeoData();

        expect(http.get).toHaveBeenCalledWith('/geo/register-data');
        expect(result).toEqual(mockData);
    });

    it('handles geo API error', async () => {
        (http.get as any).mockRejectedValue(new Error('Service Unavailable'));
        await expect(getRegisterGeoData()).rejects.toThrow('Service Unavailable');
    });
});
