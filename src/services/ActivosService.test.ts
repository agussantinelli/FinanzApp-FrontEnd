import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
    getActivos, 
    getActivoByTicker, 
    toggleSeguirActivo 
} from './ActivosService';
import { getTiposActivo } from './TipoActivosService';
import { http } from '@/lib/http';

// Mock http client
vi.mock('@/lib/http', () => ({
    http: {
        get: vi.fn(),
        post: vi.fn(),
    }
}));

// Mock activos-cache
vi.mock('@/lib/activos-cache', () => ({
    cacheActivos: vi.fn(),
}));

describe('ActivosService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('getActivos calls API and returns data', async () => {
        const mockData = [{ symbol: 'AAPL', nombre: 'Apple' }];
        (http.get as any).mockResolvedValue({ data: mockData });

        const result = await getActivos();

        expect(http.get).toHaveBeenCalledWith('/api/activos', { params: {} });
        expect(result).toEqual(mockData);
    });

    it('getActivoByTicker calls specific API endpoint', async () => {
        const mockActivo = { symbol: 'AAPL', nombre: 'Apple' };
        (http.get as any).mockResolvedValue({ data: mockActivo });

        const result = await getActivoByTicker('AAPL');

        expect(http.get).toHaveBeenCalledWith('/api/activos/ticker/AAPL');
        expect(result).toEqual(mockActivo);
    });

    it('getTiposActivo returns list of types', async () => {
        const mockTypes = [{ id: 1, nombre: 'Accion' }];
        (http.get as any).mockResolvedValue({ data: mockTypes });

        const result = await getTiposActivo();

        expect(http.get).toHaveBeenCalledWith('/api/tipos-activo');
        expect(result).toEqual(mockTypes);
    });

    it('toggleSeguirActivo calls post to follow/unfollow', async () => {
        (http.post as any).mockResolvedValue({ data: { success: true } });

        await toggleSeguirActivo('1');

        expect(http.post).toHaveBeenCalledWith('/api/activos/1/seguir');
    });
});
