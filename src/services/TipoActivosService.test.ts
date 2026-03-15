import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getTiposActivo, getTiposActivoNoMoneda } from './TipoActivosService';
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

    it('getTiposActivo calls correct endpoint', async () => {
        (http.get as any).mockResolvedValue({ data: [] });
        await getTiposActivo();
        expect(http.get).toHaveBeenCalledWith('/api/tipos-activo');
    });

    it('getTiposActivoNoMoneda calls correct endpoint', async () => {
        (http.get as any).mockResolvedValue({ data: [] });
        await getTiposActivoNoMoneda();
        expect(http.get).toHaveBeenCalledWith('/api/tipos-activo/no-moneda');
    });
});
