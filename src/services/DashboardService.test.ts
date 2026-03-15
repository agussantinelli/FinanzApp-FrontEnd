import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
    getInversorStats, 
    getExpertoStats, 
    getAdminStats, 
    getAdminPortfolioStats 
} from './DashboardService';
import { http } from '@/lib/http';

vi.mock('@/lib/http', () => ({
    http: {
        get: vi.fn(),
    }
}));

describe('DashboardService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('getInversorStats calls API', async () => {
        const mockData = { valorTotal: 1000 };
        (http.get as any).mockResolvedValue({ data: mockData });

        const result = await getInversorStats();

        expect(http.get).toHaveBeenCalledWith('/api/dashboard/inversor/stats');
        expect(result).toEqual(mockData);
    });

    it('getExpertoStats calls API', async () => {
        const mockData = { totalRecomendaciones: 5 };
        (http.get as any).mockResolvedValue({ data: mockData });

        const result = await getExpertoStats();

        expect(http.get).toHaveBeenCalledWith('/api/dashboard/experto/stats');
        expect(result).toEqual(mockData);
    });

    it('getAdminStats calls API', async () => {
        const mockData = { totalUsuarios: 100 };
        (http.get as any).mockResolvedValue({ data: mockData });

        const result = await getAdminStats();

        expect(http.get).toHaveBeenCalledWith('/api/dashboard/admin/stats');
        expect(result).toEqual(mockData);
    });

    it('getAdminPortfolioStats calls API', async () => {
        const mockData = { valorGlobalPesos: 1000000 };
        (http.get as any).mockResolvedValue({ data: mockData });

        const result = await getAdminPortfolioStats();

        expect(http.get).toHaveBeenCalledWith('/api/dashboard/admin/portafolios/stats');
        expect(result).toEqual(mockData);
    });
});
