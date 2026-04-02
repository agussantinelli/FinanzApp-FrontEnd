import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
    downloadPortfolioPdf, 
    downloadPortfolioExcel, 
    downloadMisOperacionesPdf, 
    downloadMisOperacionesExcel 
} from '../ReportesService';
import { http } from '@/lib/http';

vi.mock('@/lib/http', () => ({
    http: {
        get: vi.fn(),
    }
}));

describe('ReportesService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        
        // Mock URL and Revoke
        global.URL.createObjectURL = vi.fn(() => 'mock-url');
        global.URL.revokeObjectURL = vi.fn();
        
        // Mock document methods
        document.createElement = vi.fn().mockReturnValue({
            style: {},
            setAttribute: vi.fn(),
            click: vi.fn(),
            remove: vi.fn(),
        });
        document.body.appendChild = vi.fn();
    });

    it('downloadPortfolioPdf calls API and triggers download', async () => {
        (http.get as any).mockResolvedValue({ data: new Blob() });
        await downloadPortfolioPdf('1');
        expect(http.get).toHaveBeenCalledWith('/api/portafolios/1/reporte/pdf', { responseType: 'blob' });
        expect(document.createElement).toHaveBeenCalledWith('a');
    });

    it('downloadPortfolioExcel calls API and triggers download', async () => {
        (http.get as any).mockResolvedValue({ data: new Blob() });
        await downloadPortfolioExcel('1');
        expect(http.get).toHaveBeenCalledWith('/api/portafolios/1/reporte/excel', { responseType: 'blob' });
    });

    it('downloadMisOperacionesPdf calls API', async () => {
        (http.get as any).mockResolvedValue({ data: new Blob() });
        await downloadMisOperacionesPdf();
        expect(http.get).toHaveBeenCalledWith('/api/operaciones/reporte/pdf', { responseType: 'blob' });
    });

    it('downloadMisOperacionesExcel calls API', async () => {
        (http.get as any).mockResolvedValue({ data: new Blob() });
        await downloadMisOperacionesExcel();
        expect(http.get).toHaveBeenCalledWith('/api/operaciones/reporte/excel', { responseType: 'blob' });
    });
});
