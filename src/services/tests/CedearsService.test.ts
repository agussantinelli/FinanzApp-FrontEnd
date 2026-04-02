import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getCedearDuals } from '../CedearsService';
import { http } from '@/lib/http';

vi.mock('@/lib/http', () => ({
    http: {
        get: vi.fn(),
    }
}));

describe('CedearsService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('getCedearDuals calls API with dolar param', async () => {
        const mockData = [{ ticker: 'AAPL', ratio: 10 }];
        (http.get as any).mockResolvedValue({ data: mockData });

        const result = await getCedearDuals('MEP');

        expect(http.get).toHaveBeenCalledWith('/api/cedears/duals', {
            params: { dolar: 'MEP' },
        });
        expect(result).toEqual(mockData);
    });

    it('getCedearDuals defaults to CCL', async () => {
        (http.get as any).mockResolvedValue({ data: [] });
        await getCedearDuals();
        expect(http.get).toHaveBeenCalledWith('/api/cedears/duals', {
            params: { dolar: 'CCL' },
        });
    });

    it('handles cedear API errors', async () => {
        (http.get as any).mockRejectedValue(new Error('Timeout'));
        await expect(getCedearDuals()).rejects.toThrow('Timeout');
    });
});
