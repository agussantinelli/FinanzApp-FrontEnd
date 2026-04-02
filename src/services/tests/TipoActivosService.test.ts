import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getTiposActivo, getTiposActivoNoMoneda } from '../TipoActivosService';
import { http } from '@/lib/http';

vi.mock('@/lib/http', () => ({
    http: {
        get: vi.fn(),
    }
}));

describe('TipoActivosService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('getTiposActivo calls API', async () => {
        const mockData = [{ id: 1, nombre: 'Acción' }];
        (http.get as any).mockResolvedValue({ data: mockData });

        const result = await getTiposActivo();

        expect(http.get).toHaveBeenCalledWith('/api/tipos-activo');
        expect(result).toEqual(mockData);
    });

    it('getTiposActivoNoMoneda calls correct endpoint', async () => {
        const mockData = [{ id: 1, nombre: 'Acción' }];
        (http.get as any).mockResolvedValue({ data: mockData });

        const result = await getTiposActivoNoMoneda();

        expect(http.get).toHaveBeenCalledWith('/api/tipos-activo/no-moneda');
        expect(result).toEqual(mockData);
    });

    it('handles type service errors', async () => {
        (http.get as any).mockRejectedValue(new Error('Server Error'));
        await expect(getTiposActivo()).rejects.toThrow('Server Error');
    });
});
