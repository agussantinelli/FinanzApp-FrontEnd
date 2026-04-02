import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useImportExcel } from '../useImportExcel';
import { analyzeFile, confirmImport } from '@/services/ImportService';
import { usePortfolioData } from '@/hooks/usePortfolioData';

vi.mock('@/services/ImportService', () => ({
    analyzeFile: vi.fn(),
    confirmImport: vi.fn(),
}));

vi.mock('@/hooks/usePortfolioData', () => ({
    usePortfolioData: vi.fn(() => ({
        selectedId: 'p1',
        valuacion: { activos: [] },
    })),
}));

describe('useImportExcel hook', () => {
    const mockFile = new File([''], 'test.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should start at UPLOAD step', () => {
        const { result } = renderHook(() => useImportExcel());
        expect(result.current.step).toBe('UPLOAD');
    });

    it('should handle file change', () => {
        const { result } = renderHook(() => useImportExcel());
        const event = { target: { files: [mockFile] } } as any;

        act(() => {
            result.current.handleFileChange(event);
        });

        expect(result.current.file).toEqual(mockFile);
    });

    it('should analyze file', async () => {
        (analyzeFile as any).mockResolvedValue({ items: [] });
        const { result } = renderHook(() => useImportExcel());
        
        act(() => {
            result.current.handleFileChange({ target: { files: [mockFile] } } as any);
        });

        await act(async () => {
            await result.current.analyze();
        });

        expect(analyzeFile).toHaveBeenCalledWith(mockFile);
        expect(result.current.step).toBe('PREVIEW');
    });
});
