import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getSectores, getSectorById } from './SectorService';
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

    it('getSectores calls correct endpoint', async () => {
        (http.get as any).mockResolvedValue({ data: [{ id: '1', nombre: 'Tech' }] });
        const res = await getSectores();
        expect(http.get).toHaveBeenCalledWith('/api/sectores');
        expect(res).toHaveLength(1);
    });

    it('getSectorById calls correct endpoint', async () => {
        (http.get as any).mockResolvedValue({ data: { id: '1' } });
        await getSectorById('1');
        expect(http.get).toHaveBeenCalledWith('/api/sectores/1');
    });
});
