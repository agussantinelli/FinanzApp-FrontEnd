import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
    downloadPortfolioPdf, 
    downloadPortfolioExcel,
    downloadMisOperacionesPdf 
} from './ReportesService';
import { http } from '@/lib/http';

vi.mock('@/lib/http', () => ({
    http: {
        get: vi.fn(),
    }
}));

// Mock URL.createObjectURL and other DOM things
global.URL.createObjectURL = vi.fn();
global.URL.revokeObjectURL = vi.fn();

describe('ReportesService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Mock document.createElement
        document.body.appendChild = vi.fn();
        document.createElement = vi.fn().mockReturnValue({
            click: vi.fn(),
            remove: vi.fn(),
            setAttribute: vi.fn(),
        });
    });

    it('downloadPortfolioPdf calls correct endpoint and triggers download', async () => {
        (http.get as any).mockResolvedValue({ data: new Blob() });
        await downloadPortfolioPdf('1');
        expect(http.get).toHaveBeenCalledWith('/api/portafolios/1/reporte/pdf', { responseType: 'blob' });
        expect(document.createElement).toHaveBeenCalledWith('a');
    });

    it('downloadMisOperacionesPdf calls correct endpoint', async () => {
        (http.get as any).mockResolvedValue({ data: new Blob() });
        await downloadMisOperacionesPdf();
        expect(http.get).toHaveBeenCalledWith('/api/operaciones/reporte/pdf', { responseType: 'blob' });
    });
});
