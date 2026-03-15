import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
    aprobarRecomendacion,
    rechazarRecomendacion,
    getRecomendaciones,
    createRecomendacion,
    getRecomendacionById
} from './RecomendacionesService';
import { http } from '@/lib/http';

vi.mock('@/lib/http', () => ({
    http: {
        get: vi.fn(),
        post: vi.fn(),
        patch: vi.fn(),
        put: vi.fn(),
        delete: vi.fn(),
    }
}));

describe('RecomendacionesService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('aprobarRecomendacion calls patch', async () => {
        await aprobarRecomendacion('1');
        expect(http.patch).toHaveBeenCalledWith('/api/recomendaciones/1/aceptar');
    });

    it('getRecomendaciones calls GET with params', async () => {
        (http.get as any).mockResolvedValue({ data: [] });
        await getRecomendaciones(false);
        expect(http.get).toHaveBeenCalledWith('/api/recomendaciones', { params: { soloActivas: false } });
    });

    it('getRecomendacionById calls correct endpoint', async () => {
        (http.get as any).mockResolvedValue({ data: { id: '1' } });
        await getRecomendacionById('1');
        expect(http.get).toHaveBeenCalledWith('/api/recomendaciones/1');
    });

    it('createRecomendacion calls post', async () => {
        const mockDto = { activoId: '1', comentario: 'buy' };
        (http.post as any).mockResolvedValue({ data: { id: '1' } });
        await createRecomendacion(mockDto as any);
        expect(http.post).toHaveBeenCalledWith('/api/recomendaciones', mockDto);
    });
});
