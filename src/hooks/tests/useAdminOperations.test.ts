import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAdminOperations } from '../useAdminOperations';
import { getAllOperations } from '@/services/AdminService';

vi.mock('@/services/AdminService', () => ({
    getAllOperations: vi.fn(),
}));

describe('useAdminOperations hook', () => {
    const mockOps = [{ id: '1', symbol: 'AAPL' }];

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should load operations on mount', async () => {
        (getAllOperations as any).mockResolvedValue(mockOps);
        const { result } = renderHook(() => useAdminOperations());

        await act(async () => { /* wait items load */ });

        expect(getAllOperations).toHaveBeenCalled();
        expect(result.current.operations).toEqual(mockOps);
    });
});
