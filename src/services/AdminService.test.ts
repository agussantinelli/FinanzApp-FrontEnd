import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
    getDashboardStats, 
    getAdminPortfolioStats, 
    getAllOperations 
} from './AdminService';
import { http } from '@/lib/http';

vi.mock('@/lib/http', () => ({
    http: {
        get: vi.fn(),
    }
}));

describe('AdminService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('getDashboardStats calls correct endpoint', async () => {
        const mockData = { totalUsuarios: 10 };
        (http.get as any).mockResolvedValue({ data: mockData });

        const result = await getDashboardStats();

        expect(http.get).toHaveBeenCalledWith('/api/dashboard/admin/stats');
        expect(result).toEqual(mockData);
    });

    it('getAdminPortfolioStats calls correct endpoint', async () => {
        const mockData = { valorGlobalPesos: 123456 };
        (http.get as any).mockResolvedValue({ data: mockData });

        const result = await getAdminPortfolioStats();

        expect(http.get).toHaveBeenCalledWith('/api/dashboard/admin/portafolios/stats');
        expect(result).toEqual(mockData);
    });

    it('getAllOperations calls correct endpoint', async () => {
        const mockData = [{ id: 'op1', symbol: 'BTC' }];
        (http.get as any).mockResolvedValue({ data: mockData });

        const result = await getAllOperations();

        expect(http.get).toHaveBeenCalledWith('/api/operaciones');
        expect(result).toEqual(mockData);
    });

    it('handles failure in admin operations', async () => {
        (http.get as any).mockRejectedValue(new Error('Forbidden'));
        await expect(getAllOperations()).rejects.toThrow('Forbidden');
    });
});
