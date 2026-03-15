import { describe, it, expect, vi, beforeEach } from 'vitest';
import { analyzeFile, confirmImport } from './ImportService';
import { http } from '@/lib/http';

vi.mock('@/lib/http', () => ({
    http: {
        post: vi.fn(),
    }
}));

describe('ImportService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('analyzeFile sends FormData', async () => {
        const mockFile = new File([''], 'test.csv');
        (http.post as any).mockResolvedValue({ data: {} });
        await analyzeFile(mockFile);
        expect(http.post).toHaveBeenCalled();
        const call = (http.post as any).mock.calls[0];
        expect(call[0]).toBe('/api/import/analyze');
        expect(call[1]).toBeInstanceOf(FormData);
    });

    it('confirmImport calls post', async () => {
        const mockDto = { token: 't', operations: [] };
        (http.post as any).mockResolvedValue({ data: { message: 'ok' } });
        await confirmImport(mockDto as any);
        expect(http.post).toHaveBeenCalledWith('/api/import/confirm', mockDto);
    });
});
