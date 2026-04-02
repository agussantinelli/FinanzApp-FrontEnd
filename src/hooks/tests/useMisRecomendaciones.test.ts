import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useMisRecomendaciones } from '../useMisRecomendaciones';
import { useAuth } from '@/hooks/useAuth';
import { useRecomendaciones } from '@/hooks/useRecomendaciones';
import { getSectores } from '@/services/SectorService';

vi.mock('@/hooks/useAuth', () => ({
    useAuth: vi.fn(() => ({ user: { id: 'u1' } })),
}));

vi.mock('@/hooks/useRecomendaciones', () => ({
    useRecomendaciones: vi.fn(() => ({
        data: [],
        loading: false,
        error: null,
        applyFilters: vi.fn(),
    })),
}));

vi.mock('@/services/SectorService', () => ({
    getSectores: vi.fn().mockResolvedValue([]),
}));

describe('useMisRecomendaciones hook', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should call applyFilters with user id', () => {
        const mockApplyFilters = vi.fn();
        (useRecomendaciones as any).mockReturnValue({
            data: [],
            loading: false,
            error: null,
            applyFilters: mockApplyFilters,
        });

        renderHook(() => useMisRecomendaciones());

        expect(mockApplyFilters).toHaveBeenCalledWith(expect.objectContaining({ autorId: 'u1' }));
    });
});
