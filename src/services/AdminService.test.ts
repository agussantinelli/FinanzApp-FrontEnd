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
        (http.get as any).mockResolvedValue({ data: { totalUsuarios: 10 } });
        const res = await getDashboardStats();
        expect(http.get).toHaveBeenCalledWith('/api/dashboard/admin/stats');
        expect(res.totalUsuarios).toBe(10);
    });

    it('getAdminPortfolioStats calls correct endpoint', async () => {
        (http.get as any).mockResolvedValue({ data: { totalPortafolios: 5 } });
        await getAdminPortfolioStats();
        expect(http.get).toHaveBeenCalledWith('/api/dashboard/admin/portafolios/stats');
    });

    it('getAllOperations calls correct endpoint', async () => {
        (http.get as any).mockResolvedValue({ data: [] });
        await getAllOperations();
        expect(http.get).toHaveBeenCalledWith('/api/operaciones');
    });
});
