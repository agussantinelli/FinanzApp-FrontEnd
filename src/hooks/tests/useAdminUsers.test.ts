import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAdminUsers } from '../useAdminUsers';
import { getPersonas, promoteToExperto, demoteToInversor } from '@/services/PersonaService';

vi.mock('@/services/PersonaService', () => ({
    getPersonas: vi.fn(),
    promoteToExperto: vi.fn(),
    demoteToInversor: vi.fn(),
}));

describe('useAdminUsers hook', () => {
    const mockUsers = [{ id: 'u1', rol: 'Inversor' }];

    beforeEach(() => {
        vi.clearAllMocks();
        (getPersonas as any).mockResolvedValue(mockUsers);
    });

    it('should load users on mount', async () => {
        const { result } = renderHook(() => useAdminUsers());

        await act(async () => { /* wait metadata */ });

        expect(getPersonas).toHaveBeenCalled();
        expect(result.current.users).toHaveLength(1);
    });

    it('should promote user to experto', async () => {
        const { result } = renderHook(() => useAdminUsers());

        await act(async () => {
            await result.current.changeRole(mockUsers[0] as any, 'up');
        });

        expect(promoteToExperto).toHaveBeenCalledWith('u1');
    });

    it('should demote user to inversor', async () => {
        const experto = { id: 'u1', rol: 'Experto' };
        const { result } = renderHook(() => useAdminUsers());

        await act(async () => {
            await result.current.changeRole(experto as any, 'down');
        });

        expect(demoteToInversor).toHaveBeenCalledWith('u1');
    });
});
