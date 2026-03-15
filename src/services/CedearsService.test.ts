import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getCedearDuals } from './CedearsService';
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

    it('getCedearDuals calls correct endpoint with params', async () => {
        (http.get as any).mockResolvedValue({ data: [] });
        await getCedearDuals('CCL');
        expect(http.get).toHaveBeenCalledWith('/api/cedears/duals', { params: { dolar: 'CCL' } });
    });
});
