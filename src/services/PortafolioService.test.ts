import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
    getPortafolios, 
    getPortafolioById, 
    createPortafolio,
    deletePortafolio,
    getValuacionPortafolio
} from './PortafolioService';
import { http } from '@/lib/http';

vi.mock('@/lib/http', () => ({
    http: {
        get: vi.fn(),
        post: vi.fn(),
        delete: vi.fn(),
    }
}));

describe('PortafolioService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('getPortafolios calls API', async () => {
        const mockData = [{ id: '1', nombre: 'Main' }];
        (http.get as any).mockResolvedValue({ data: mockData });

        const result = await getPortafolios();

        expect(http.get).toHaveBeenCalledWith('/api/portafolios');
        expect(result).toEqual(mockData);
    });

    it('getPortafolioById calls API', async () => {
        const mockData = { id: '1', nombre: 'Main' };
        (http.get as any).mockResolvedValue({ data: mockData });

        const result = await getPortafolioById('1');

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

    it('getValuacionPortafolio calls API', async () => {
        const mockVal = { totalPesos: 1000 };
        (http.get as any).mockResolvedValue({ data: mockVal });

        const result = await getValuacionPortafolio('1');

        expect(http.get).toHaveBeenCalledWith('/api/portafolios/1/valuacion');
        expect(result).toEqual(mockVal);
    });
});
