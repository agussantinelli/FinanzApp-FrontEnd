import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getStockDuals, getIndices } from './StocksService';
import { http } from '@/lib/http';

vi.mock('@/lib/http', () => ({
    http: {
        get: vi.fn(),
        post: vi.fn(),
    }
}));

describe('StocksService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('getStockDuals calls post with params', async () => {
        const pairs = [{ localBA: 'AAPL', usa: 'AAPL' }];
        (http.post as any).mockResolvedValue({ data: [] });
        await getStockDuals(pairs, 'MEP');
        expect(http.post).toHaveBeenCalledWith('/api/stocks/duals', pairs, { params: { dolar: 'MEP' } });
    });

    it('getIndices calls correct endpoint', async () => {
        (http.get as any).mockResolvedValue({ data: [] });
        await getIndices();
        expect(http.get).toHaveBeenCalledWith('/api/stocks/indices');
    });
});
