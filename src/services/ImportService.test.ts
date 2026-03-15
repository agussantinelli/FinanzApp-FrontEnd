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

    it('analyzeFile sends FormData and returns preview', async () => {
        const mockData = { rows: [] };
        (http.post as any).mockResolvedValue({ data: mockData });
        const mockFile = new File([''], 'test.xlsx');

        const result = await analyzeFile(mockFile);

        expect(http.post).toHaveBeenCalledWith(
            '/api/import/analyze', 
            expect.any(FormData),
            expect.objectContaining({ headers: { 'Content-Type': 'multipart/form-data' } })
        );
        expect(result).toEqual(mockData);
    });

    it('confirmImport calls post with DTO', async () => {
        const mockResp = { message: 'Success' };
        (http.post as any).mockResolvedValue({ data: mockResp });
        const dto = { operaciones: [] } as any;

        const result = await confirmImport(dto);

        expect(http.post).toHaveBeenCalledWith('/api/import/confirm', dto);
        expect(result).toEqual(mockResp);
    });

    it('handles import errors', async () => {
        (http.post as any).mockRejectedValue(new Error('Format error'));
        await expect(confirmImport({} as any)).rejects.toThrow('Format error');
    });
});
