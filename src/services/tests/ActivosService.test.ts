import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
    getActivos, 
    getActivoById,
    getActivoByTicker, 
    createActivo,
    updateActivo,
    deleteActivo,
    getActivosByTipoId,
    getActivosNoMoneda,
    getRankingActivos,
    searchActivos,
    getActivosBySector,
    getActivosByTipoAndSector,
    getActivosFavoritos,
    toggleSeguirActivo 
} from '../ActivosService';
import { http } from '@/lib/http';
import * as ActivosCache from '@/lib/activos-cache';

// Mock http client
vi.mock('@/lib/http', () => ({
    http: {
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
        delete: vi.fn(),
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

    it('createActivo calls API and caches data', async () => {
        const dto = { symbol: 'NEW', nombre: 'New Asset' } as any;
        const mockResp = { id: '1', ...dto };
        (http.post as any).mockResolvedValue({ data: mockResp });

        const result = await createActivo(dto);

        expect(http.post).toHaveBeenCalledWith('/api/activos', dto);
        expect(ActivosCache.cacheActivos).toHaveBeenCalledWith([mockResp]);
        expect(result).toEqual(mockResp);
    });

    it('updateActivo calls API and updates cache', async () => {
        const dto = { nombre: 'Updated Name' } as any;
        const mockResp = { id: '1', symbol: 'AAPL', ...dto };
        (http.put as any).mockResolvedValue({ data: mockResp });

        const result = await updateActivo('1', dto);

        expect(http.put).toHaveBeenCalledWith('/api/activos/1', dto);
        expect(ActivosCache.cacheActivos).toHaveBeenCalledWith([mockResp]);
        expect(result).toEqual(mockResp);
    });

    it('deleteActivo calls API', async () => {
        (http.delete as any).mockResolvedValue({});

        await deleteActivo('1');

        expect(http.delete).toHaveBeenCalledWith('/api/activos/1');
    });

    it('getActivos calls API with params and caches', async () => {
        const mockData = [{ symbol: 'AAPL' }];
        (http.get as any).mockResolvedValue({ data: mockData });

        const result = await getActivos('Accion');

        expect(http.get).toHaveBeenCalledWith('/api/activos', { params: { tipo: 'Accion' } });
        expect(ActivosCache.cacheActivos).toHaveBeenCalledWith(mockData, false);
        expect(result).toEqual(mockData);
    });

    it('getActivoById returns data', async () => {
        const mockData = { id: '1', symbol: 'AAPL' };
        (http.get as any).mockResolvedValue({ data: mockData });

        const result = await getActivoById('1');

        expect(http.get).toHaveBeenCalledWith('/api/activos/1');
        expect(result).toEqual(mockData);
    });

    it('getActivoByTicker returns data', async () => {
        const mockActivo = { symbol: 'AAPL', nombre: 'Apple' };
        (http.get as any).mockResolvedValue({ data: mockActivo });

        const result = await getActivoByTicker('AAPL');

        expect(http.get).toHaveBeenCalledWith('/api/activos/ticker/AAPL');
        expect(result).toEqual(mockActivo);
    });

    it('getActivosByTipoId calls API and caches', async () => {
        const mockData = [{ symbol: 'AAPL' }];
        (http.get as any).mockResolvedValue({ data: mockData });

        const result = await getActivosByTipoId(1);

        expect(http.get).toHaveBeenCalledWith('/api/activos/tipo/1');
        expect(ActivosCache.cacheActivos).toHaveBeenCalledWith(mockData);
        expect(result).toEqual(mockData);
    });

    it('getActivosNoMoneda calls API and caches', async () => {
        const mockData = [{ symbol: 'AAPL' }];
        (http.get as any).mockResolvedValue({ data: mockData });

        const result = await getActivosNoMoneda();

        expect(http.get).toHaveBeenCalledWith('/api/activos/no-monedas');
        expect(ActivosCache.cacheActivos).toHaveBeenCalledWith(mockData, true);
        expect(result).toEqual(mockData);
    });

    it('getRankingActivos calls API with params and caches', async () => {
        const mockData = [{ symbol: 'AAPL' }];
        (http.get as any).mockResolvedValue({ data: mockData });

        const result = await getRankingActivos('precio', false, 1);

        expect(http.get).toHaveBeenCalledWith('/api/activos/ranking', { 
            params: { criterio: 'precio', desc: false, tipoId: 1 } 
        });
        expect(ActivosCache.cacheActivos).toHaveBeenCalledWith(mockData, false);
        expect(result).toEqual(mockData);
    });

    it('searchActivos calls API with encoded query and caches', async () => {
        const mockData = [{ symbol: 'AAPL' }];
        (http.get as any).mockResolvedValue({ data: mockData });

        const result = await searchActivos('apple inc');

        expect(http.get).toHaveBeenCalledWith('/api/activos/buscar?q=apple%20inc');
        expect(ActivosCache.cacheActivos).toHaveBeenCalledWith(mockData);
        expect(result).toEqual(mockData);
    });

    it('getActivosBySector calls API and caches', async () => {
        const mockData = [{ symbol: 'AAPL' }];
        (http.get as any).mockResolvedValue({ data: mockData });

        const result = await getActivosBySector('Tech');

        expect(http.get).toHaveBeenCalledWith('/api/activos/sector/Tech');
        expect(ActivosCache.cacheActivos).toHaveBeenCalledWith(mockData);
        expect(result).toEqual(mockData);
    });

    it('getActivosByTipoAndSector calls API and caches', async () => {
        const mockData = [{ symbol: 'AAPL' }];
        (http.get as any).mockResolvedValue({ data: mockData });

        const result = await getActivosByTipoAndSector(1, 'Tech');

        expect(http.get).toHaveBeenCalledWith('/api/activos/tipo/1/sector/Tech');
        expect(ActivosCache.cacheActivos).toHaveBeenCalledWith(mockData);
        expect(result).toEqual(mockData);
    });

    it('getActivosFavoritos calls API and caches', async () => {
        const mockData = [{ symbol: 'AAPL' }];
        (http.get as any).mockResolvedValue({ data: mockData });

        const result = await getActivosFavoritos();

        expect(http.get).toHaveBeenCalledWith('/api/activos/favoritos');
        expect(ActivosCache.cacheActivos).toHaveBeenCalledWith(mockData, true);
        expect(result).toEqual(mockData);
    });

    it('toggleSeguirActivo calls post', async () => {
        (http.post as any).mockResolvedValue({});

        await toggleSeguirActivo('1');

        expect(http.post).toHaveBeenCalledWith('/api/activos/1/seguir');
    });
});
