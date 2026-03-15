import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getOperacionesAdmin, getOperacionesDeHoy, getPortafoliosAdmin } from './AdminConsultasService';
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

    it('getOperacionesAdmin calls correct endpoint with filters', async () => {
        (http.get as any).mockResolvedValue({ data: [] });
        const filters = { activoId: '1' };
        await getOperacionesAdmin(filters);
        expect(http.get).toHaveBeenCalledWith('/api/admin/consultas/operaciones', { params: filters });
    });

    it('getOperacionesDeHoy calls correct endpoint', async () => {
        (http.get as any).mockResolvedValue({ data: [] });
        await getOperacionesDeHoy();
        expect(http.get).toHaveBeenCalledWith('/api/admin/consultas/operaciones/hoy');
    });

    it('getPortafoliosAdmin calls correct endpoint with filters', async () => {
        (http.get as any).mockResolvedValue({ data: [] });
        const filters = { rol: 'Inversor' };
        await getPortafoliosAdmin(filters);
        expect(http.get).toHaveBeenCalledWith('/api/admin/consultas/portafolios', { params: filters });
    });
});
