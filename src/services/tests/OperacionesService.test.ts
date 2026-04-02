import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
    getOperaciones, 
    getOperacionesByPersona,
    getReportePdf,
    getReporteExcel,
    getOperacionesByActivo,
    createOperacion, 
    updateOperacion,
    deleteOperacion 
} from '../OperacionesService';
import { http } from '@/lib/http';

vi.mock('@/lib/http', () => ({
    http: {
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
        delete: vi.fn(),
    }
}));

describe('OperacionesService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('getOperaciones calls API', async () => {
        const mockData = [{ id: '1', symbol: 'AAPL' }];
        (http.get as any).mockResolvedValue({ data: mockData });
        const result = await getOperaciones();
        expect(http.get).toHaveBeenCalledWith('/api/operaciones');
        expect(result).toEqual(mockData);
    });

    it('getOperacionesByPersona calls API', async () => {
        const mockData = [{ id: '1', personaId: 'p1' }];
        (http.get as any).mockResolvedValue({ data: mockData });
        const result = await getOperacionesByPersona('p1');
        expect(http.get).toHaveBeenCalledWith('/api/operaciones/persona/p1');
        expect(result).toEqual(mockData);
    });

    it('getReportePdf returns blob', async () => {
        const mockBlob = new Blob(['pdf']);
        (http.get as any).mockResolvedValue({ data: mockBlob });
        const result = await getReportePdf();
        expect(http.get).toHaveBeenCalledWith('/api/operaciones/reporte/pdf', { responseType: 'blob' });
        expect(result).toEqual(mockBlob);
    });

    it('getReporteExcel returns blob', async () => {
        const mockBlob = new Blob(['excel']);
        (http.get as any).mockResolvedValue({ data: mockBlob });
        const result = await getReporteExcel();
        expect(http.get).toHaveBeenCalledWith('/api/operaciones/reporte/excel', { responseType: 'blob' });
        expect(result).toEqual(mockBlob);
    });

    it('getOperacionesByActivo filters locally', async () => {
        const mockAll = [
            { id: '1', activoId: 'AAPL' },
            { id: '2', activoId: 'MSFT' },
            { id: '3', activoId: 'aapl' }
        ];
        (http.get as any).mockResolvedValue({ data: mockAll });
        const result = await getOperacionesByActivo('AAPL');
        expect(result).toHaveLength(2);
        expect(result[0].activoId).toBe('AAPL');
        expect(result[1].activoId).toBe('aapl');
    });

    it('createOperacion calls post', async () => {
        const mockOp = { symbol: 'AAPL', cantidad: 10 };
        const mockResp = { id: '1', ...mockOp };
        (http.post as any).mockResolvedValue({ data: mockResp });
        const result = await createOperacion(mockOp as any);
        expect(http.post).toHaveBeenCalledWith('/api/operaciones', mockOp);
        expect(result).toEqual(mockResp);
    });

    it('updateOperacion calls put', async () => {
        const mockOp = { cantidad: 20 };
        const mockResp = { id: '1', ...mockOp };
        (http.put as any).mockResolvedValue({ data: mockResp });
        const result = await updateOperacion('1', mockOp as any);
        expect(http.put).toHaveBeenCalledWith('/api/operaciones/1', mockOp);
        expect(result).toEqual(mockResp);
    });

    it('deleteOperacion calls delete', async () => {
        (http.delete as any).mockResolvedValue({});
        await deleteOperacion('1');
        expect(http.delete).toHaveBeenCalledWith('/api/operaciones/1');
    });

    it('handles network errors', async () => {
        (http.get as any).mockRejectedValue(new Error('Network Error'));
        await expect(getOperaciones()).rejects.toThrow('Network Error');
    });
});
