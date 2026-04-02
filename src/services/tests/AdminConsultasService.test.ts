import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
    getOperacionesAdmin, 
    getOperacionesDeHoy, 
    getPortafoliosAdmin 
} from '../AdminConsultasService';
import { http } from '@/lib/http';

vi.mock('@/lib/http', () => ({
    http: {
        get: vi.fn(),
    }
}));

describe('AdminConsultasService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('getOperacionesAdmin calls API with filters', async () => {
        const filters = { activoId: 'AAPL', soloHoy: true };
        const mockData = [{ id: '1', symbol: 'AAPL' }];
        (http.get as any).mockResolvedValue({ data: mockData });

        const result = await getOperacionesAdmin(filters);

        expect(http.get).toHaveBeenCalledWith('/api/admin/consultas/operaciones', { params: filters });
        expect(result).toEqual(mockData);
    });

    it('getOperacionesDeHoy calls API', async () => {
        const mockData = [{ id: '1', fecha: '2024-01-01' }];
        (http.get as any).mockResolvedValue({ data: mockData });

        const result = await getOperacionesDeHoy();

        expect(http.get).toHaveBeenCalledWith('/api/admin/consultas/operaciones/hoy');
        expect(result).toEqual(mockData);
    });

    it('getPortafoliosAdmin calls API with user/rol filters', async () => {
        const filters = { usuarioId: 'u1', rol: 'Inversor' };
        const mockData = [{ id: 'p1', nombre: 'Test Port' }];
        (http.get as any).mockResolvedValue({ data: mockData });

        const result = await getPortafoliosAdmin(filters);

        expect(http.get).toHaveBeenCalledWith('/api/admin/consultas/portafolios', { params: filters });
        expect(result).toEqual(mockData);
    });

    it('handles API errors in consultations', async () => {
        (http.get as any).mockRejectedValue(new Error('Auth failed'));
        await expect(getOperacionesDeHoy()).rejects.toThrow('Auth failed');
    });
});
