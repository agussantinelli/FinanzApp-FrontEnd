import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getSectores, getSectorById } from '../SectorService';
import { http } from '@/lib/http';

vi.mock('@/lib/http', () => ({
    http: {
        get: vi.fn(),
    }
}));

describe('SectorService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('getSectores calls API', async () => {
        const mockData = [{ id: '1', nombre: 'Tecnología' }];
        (http.get as any).mockResolvedValue({ data: mockData });

        const result = await getSectores();

        expect(http.get).toHaveBeenCalledWith('/api/sectores');
        expect(result).toEqual(mockData);
    });

    it('getSectorById calls correct endpoint', async () => {
        const mockData = { id: '1', nombre: 'Tecnología' };
        (http.get as any).mockResolvedValue({ data: mockData });

        const result = await getSectorById('1');

        expect(http.get).toHaveBeenCalledWith('/api/sectores/1');
        expect(result).toEqual(mockData);
    });

    it('handles sector service errors', async () => {
        (http.get as any).mockRejectedValue(new Error('Fetch failed'));
        await expect(getSectores()).rejects.toThrow('Fetch failed');
    });
});
