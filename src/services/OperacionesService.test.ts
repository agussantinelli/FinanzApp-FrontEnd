import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
    getOperaciones, 
    getOperacionesByPersona,
    createOperacion, 
    deleteOperacion 
} from './OperacionesService';
import { http } from '@/lib/http';

vi.mock('@/lib/http', () => ({
    http: {
        get: vi.fn(),
        post: vi.fn(),
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

    it('createOperacion calls API', async () => {
        const mockOp = { symbol: 'AAPL', cantidad: 10 };
        const mockResp = { id: '1', ...mockOp };
        (http.post as any).mockResolvedValue({ data: mockResp });

        const result = await createOperacion(mockOp as any);

        expect(http.post).toHaveBeenCalledWith('/api/operaciones', mockOp);
        expect(result).toEqual(mockResp);
    });

    it('deleteOperacion calls API', async () => {
        (http.delete as any).mockResolvedValue({});

        await deleteOperacion('1');

        expect(http.delete).toHaveBeenCalledWith('/api/operaciones/1');
    });
});
