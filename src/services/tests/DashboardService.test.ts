import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
    getInversorStats, 
    getExpertoStats, 
    getAdminStats, 
    getAdminPortfolioStats 
} from '../DashboardService';
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

    it('getInversorStats calls API and returns data', async () => {
        const mockData = { valorTotal: 1000 };
        (http.get as any).mockResolvedValue({ data: mockData });

        const result = await getInversorStats();

        expect(http.get).toHaveBeenCalledWith('/api/dashboard/inversor/stats');
        expect(result).toEqual(mockData);
    });

    it('getInversorStats handles 401 error', async () => {
        const error = { response: { status: 401 } };
        (http.get as any).mockRejectedValue(error);

        await expect(getInversorStats()).rejects.toEqual(error);
    });

    it('getExpertoStats calls API and returns data', async () => {
        const mockData = { totalRecomendaciones: 5 };
        (http.get as any).mockResolvedValue({ data: mockData });

        const result = await getExpertoStats();

        expect(http.get).toHaveBeenCalledWith('/api/dashboard/experto/stats');
        expect(result).toEqual(mockData);
    });

    it('getExpertoStats handles 500 server error', async () => {
        (http.get as any).mockRejectedValue(new Error('Internal Server Error'));
        await expect(getExpertoStats()).rejects.toThrow('Internal Server Error');
    });

    it('getAdminStats calls API and returns data', async () => {
        const mockData = { totalUsuarios: 100 };
        (http.get as any).mockResolvedValue({ data: mockData });

        const result = await getAdminStats();

        expect(http.get).toHaveBeenCalledWith('/api/dashboard/admin/stats');
        expect(result).toEqual(mockData);
    });

    it('getAdminStats handles empty response', async () => {
        (http.get as any).mockResolvedValue({ data: null });
        const result = await getAdminStats();
        expect(result).toBeNull();
    });

    it('getAdminPortfolioStats calls API and returns data', async () => {
        const mockData = { valorGlobalPesos: 1000000 };
        (http.get as any).mockResolvedValue({ data: mockData });

        const result = await getAdminPortfolioStats();

        expect(http.get).toHaveBeenCalledWith('/api/dashboard/admin/portafolios/stats');
        expect(result).toEqual(mockData);
    });

    it('getAdminPortfolioStats handles 403 Forbidden', async () => {
        const error = { response: { status: 403 } };
        (http.get as any).mockRejectedValue(error);
        await expect(getAdminPortfolioStats()).rejects.toEqual(error);
    });
});
