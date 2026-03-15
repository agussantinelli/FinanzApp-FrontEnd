import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
    getMisPortafolios, 
    getPortafoliosDestacados,
    getPortafolioValuado, 
    getReportePdf,
    getReporteExcel,
    updatePortafolio,
    marcarComoPrincipal,
    createPortafolio,
    getPortafoliosAdmin,
    toggleDestacado,
    toggleTopPortafolio,
    deletePortafolio
} from './PortafolioService';
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

describe('PortafolioService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('getMisPortafolios calls API', async () => {
        const mockData = [{ id: '1', nombre: 'Main' }];
        (http.get as any).mockResolvedValue({ data: mockData });
        const result = await getMisPortafolios();
        expect(http.get).toHaveBeenCalledWith('/api/portafolios/mis-portafolios');
        expect(result).toEqual(mockData);
    });

    it('getPortafoliosDestacados calls API', async () => {
        const mockData = [{ id: '1', nombre: 'Destacado' }];
        (http.get as any).mockResolvedValue({ data: mockData });
        const result = await getPortafoliosDestacados();
        expect(http.get).toHaveBeenCalledWith('/api/portafolios/destacados');
        expect(result).toEqual(mockData);
    });

    it('getPortafolioValuado calls API', async () => {
        const mockData = { id: '1', nombre: 'Main' };
        (http.get as any).mockResolvedValue({ data: mockData });
        const result = await getPortafolioValuado('1');
        expect(http.get).toHaveBeenCalledWith('/api/portafolios/1');
        expect(result).toEqual(mockData);
    });

    it('getReportePdf returns blob', async () => {
        const mockBlob = new Blob(['pdf-data'], { type: 'application/pdf' });
        (http.get as any).mockResolvedValue({ data: mockBlob });
        const result = await getReportePdf('1');
        expect(http.get).toHaveBeenCalledWith('/api/portafolios/1/reporte/pdf', { responseType: 'blob' });
        expect(result).toBeInstanceOf(Blob);
    });

    it('getReporteExcel returns blob', async () => {
        const mockBlob = new Blob(['excel-data'], { type: 'application/vnd.ms-excel' });
        (http.get as any).mockResolvedValue({ data: mockBlob });
        const result = await getReporteExcel('1');
        expect(http.get).toHaveBeenCalledWith('/api/portafolios/1/reporte/excel', { responseType: 'blob' });
        expect(result).toBeInstanceOf(Blob);
    });

    it('updatePortafolio calls put', async () => {
        (http.put as any).mockResolvedValue({});
        const result = await updatePortafolio('1', 'New Name', 'Desc');
        expect(http.put).toHaveBeenCalledWith('/api/portafolios/1', { nombre: 'New Name', descripcion: 'Desc' });
        expect(result).toBe(true);
    });

    it('marcarComoPrincipal calls patch', async () => {
        (http.patch as any).mockResolvedValue({});
        const result = await marcarComoPrincipal('1');
        expect(http.patch).toHaveBeenCalledWith('/api/portafolios/1/principal', {});
        expect(result).toBe(true);
    });

    it('createPortafolio calls post', async () => {
        const mockDto = { nombre: 'New' };
        const mockResp = { id: '2', ...mockDto };
        (http.post as any).mockResolvedValue({ data: mockResp });
        const result = await createPortafolio(mockDto as any);
        expect(http.post).toHaveBeenCalledWith('/api/portafolios', mockDto);
        expect(result).toEqual(mockResp);
    });

    it('getPortafoliosAdmin calls API', async () => {
        const mockData = [{ id: 'admin-1' }];
        (http.get as any).mockResolvedValue({ data: mockData });
        const result = await getPortafoliosAdmin();
        expect(http.get).toHaveBeenCalledWith('/api/portafolios/admin/todos');
        expect(result).toEqual(mockData);
    });

    it('toggleDestacado calls patch', async () => {
        (http.patch as any).mockResolvedValue({});
        const result = await toggleDestacado('1', true);
        expect(http.patch).toHaveBeenCalledWith('/api/portafolios/1/destacar?destacar=true', {});
        expect(result).toBe(true);
    });

    it('toggleTopPortafolio calls patch', async () => {
        (http.patch as any).mockResolvedValue({});
        const result = await toggleTopPortafolio('1', false);
        expect(http.patch).toHaveBeenCalledWith('/api/portafolios/1/top?esTop=false', {});
        expect(result).toBe(true);
    });

    it('deletePortafolio calls delete', async () => {
        (http.delete as any).mockResolvedValue({});
        await deletePortafolio('1');
        expect(http.delete).toHaveBeenCalledWith('/api/portafolios/1');
    });

    it('handles server errors gracefully', async () => {
        (http.get as any).mockRejectedValue(new Error('API Failure'));
        await expect(getMisPortafolios()).rejects.toThrow('API Failure');
    });
});
