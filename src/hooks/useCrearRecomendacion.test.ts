import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCrearRecomendacion } from './useCrearRecomendacion';
import { getSectores } from '@/services/SectorService';
import { createRecomendacion } from '@/services/RecomendacionesService';
import { useAuth } from '@/hooks/useAuth';

vi.mock('@/services/SectorService', () => ({
    getSectores: vi.fn(),
}));

vi.mock('@/services/RecomendacionesService', () => ({
    createRecomendacion: vi.fn(),
}));

vi.mock('@/hooks/useAuth', () => ({
    useAuth: vi.fn(() => ({ user: { id: 'u1' } })),
}));

vi.mock('next/navigation', () => ({
    useRouter: vi.fn(() => ({
        push: vi.fn(),
    })),
}));

describe('useCrearRecomendacion hook', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        (getSectores as any).mockResolvedValue([]);
    });

    it('should initialize with one asset row', async () => {
        const { result } = renderHook(() => useCrearRecomendacion());
        expect(result.current.assetRows).toHaveLength(1);
    });

    it('should add and remove rows', () => {
        const { result } = renderHook(() => useCrearRecomendacion());
        
        act(() => {
            result.current.handleAddRow();
        });
        expect(result.current.assetRows).toHaveLength(2);

        const tempId = result.current.assetRows[0].tempId;
        act(() => {
            result.current.handleRemoveRow(tempId);
        });
        expect(result.current.assetRows).toHaveLength(1);
    });

    it('should validate before submit', async () => {
        const { result } = renderHook(() => useCrearRecomendacion());
        
        await act(async () => {
            await result.current.handleSubmit();
        });

        expect(result.current.errors.titulo).toBeDefined();
        expect(createRecomendacion).not.toHaveBeenCalled();
    });
});
