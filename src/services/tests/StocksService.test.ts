import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getStockDuals, getIndices } from '../StocksService';
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

    it('getStockDuals calls post with pairs and dolar param', async () => {
        const pairs = [{ localBA: 'AAPL', usa: 'AAPL' }];
        const mockData = [{ ticker: 'AAPL', priceLocal: 1000 }];
        (http.post as any).mockResolvedValue({ data: mockData });

        const result = await getStockDuals(pairs, 'MEP');

        expect(http.post).toHaveBeenCalledWith('/api/stocks/duals', pairs, {
            params: { dolar: 'MEP' },
        });
        expect(result).toEqual(mockData);
    });

    it('getStockDuals defaults to CCL', async () => {
        const pairs = [{ localBA: 'AAPL', usa: 'AAPL' }];
        (http.post as any).mockResolvedValue({ data: [] });

        await getStockDuals(pairs);

        expect(http.post).toHaveBeenCalledWith('/api/stocks/duals', pairs, {
            params: { dolar: 'CCL' },
        });
    });

    it('getIndices calls API', async () => {
        const mockData = [{ ticker: 'MERV' }];
        (http.get as any).mockResolvedValue({ data: mockData });

        const result = await getIndices();

        expect(http.get).toHaveBeenCalledWith('/api/stocks/indices');
        expect(result).toEqual(mockData);
    });

    it('handles stock API failures', async () => {
        (http.get as any).mockRejectedValue(new Error('Server Error'));
        await expect(getIndices()).rejects.toThrow('Server Error');
    });
});
