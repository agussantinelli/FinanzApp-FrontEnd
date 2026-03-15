import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getTopCryptos, getCryptoBySymbol } from './CryptoService';
import { http } from '@/lib/http';

vi.mock('@/lib/http', () => ({
    http: {
        get: vi.fn(),
    }
}));

describe('CryptoService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('getTopCryptos calls API with default limit', async () => {
        const mockData = [{ symbol: 'BTC', price: 60000 }];
        (http.get as any).mockResolvedValue({ data: mockData });

        const result = await getTopCryptos();

        expect(http.get).toHaveBeenCalledWith('/api/crypto/top', {
            params: { limit: 10 },
        });
        expect(result).toEqual(mockData);
    });

    it('getTopCryptos calls API with custom limit', async () => {
        await getTopCryptos(5);
        expect(http.get).toHaveBeenCalledWith('/api/crypto/top', {
            params: { limit: 5 },
        });
    });

    it('getCryptoBySymbol calls correct endpoint', async () => {
        const mockData = { symbol: 'ETH', price: 3000 };
        (http.get as any).mockResolvedValue({ data: mockData });

        const result = await getCryptoBySymbol('ETH');

        expect(http.get).toHaveBeenCalledWith('/api/crypto/ETH');
        expect(result).toEqual(mockData);
    });

    it('handles crypto API errors', async () => {
        (http.get as any).mockRejectedValue(new Error('API Error'));
        await expect(getCryptoBySymbol('BTC')).rejects.toThrow('API Error');
    });
});
