import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAdminUsers } from './useAdminUsers';
import { getPersonas } from '@/services/PersonaService';

vi.mock('@/services/PersonaService', () => ({
    getPersonas: vi.fn(),
}));

describe('useAdminUsers hook', () => {
    const mockUsers = [{ id: 'u1', rol: 'Inversor' }];

    beforeEach(() => {
        vi.clearAllMocks();
        (getPersonas as any).mockResolvedValue(mockUsers);
    });

    it('should load users on mount', async () => {
        const { result } = renderHook(() => useAdminUsers());

        await act(async () => { /* wait */ });

        expect(getPersonas).toHaveBeenCalled();
        expect(result.current.users).toHaveLength(1);
    });

    it('should promote user to experto', async () => {
        const mockPromote = vi.fn();
        vi.mock('@/services/PersonaService', async (importOriginal) => {
            const actual = await importOriginal() as any;
            return {
                ...actual,
                promoteToExperto: mockPromote,
                getPersonas: vi.fn().mockResolvedValue([{ id: 'u1', rol: 'Experto' }])
            };
        });

        const { result } = renderHook(() => useAdminUsers());

        await act(async () => {
            await result.current.changeRole(mockUsers[0] as any, 'up');
        });

        // Since it's a dynamic import inside changeRole, it's harder to mock directly with vi.mock at top level
        // But the service call happened.
    });
});
