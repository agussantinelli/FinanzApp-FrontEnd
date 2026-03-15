import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
    getMisPortafolios, 
    getPortafolioValuado, 
    createPortafolio,
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

    it('getMisPortafolios calls correct endpoint', async () => {
        const mockData = [{ id: '1', nombre: 'Main' }];
        (http.get as any).mockResolvedValue({ data: mockData });

        const result = await getMisPortafolios();

        expect(http.get).toHaveBeenCalledWith('/api/portafolios/mis-portafolios');
        expect(result).toEqual(mockData);
    });

    it('getPortafolioValuado calls correct endpoint', async () => {
        const mockData = { id: '1', nombre: 'Main' };
        (http.get as any).mockResolvedValue({ data: mockData });

        const result = await getPortafolioValuado('1');

        expect(http.get).toHaveBeenCalledWith('/api/portafolios/1');
        expect(result).toEqual(mockData);
    });

    it('createPortafolio calls API', async () => {
        const mockDto = { nombre: 'New' };
        const mockResp = { id: '2', ...mockDto };
        (http.post as any).mockResolvedValue({ data: mockResp });

        const result = await createPortafolio(mockDto as any);

        expect(http.post).toHaveBeenCalledWith('/api/portafolios', mockDto);
        expect(result).toEqual(mockResp);
    });

});
