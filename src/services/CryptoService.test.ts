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

    it('getTopCryptos calls correct endpoint with limit', async () => {
        (http.get as any).mockResolvedValue({ data: [] });
        await getTopCryptos(5);
        expect(http.get).toHaveBeenCalledWith('/api/crypto/top', { params: { limit: 5 } });
    });

    it('getCryptoBySymbol calls correct endpoint', async () => {
        (http.get as any).mockResolvedValue({ data: { symbol: 'BTC' } });
        await getCryptoBySymbol('BTC');
        expect(http.get).toHaveBeenCalledWith('/api/crypto/BTC');
    });
});
