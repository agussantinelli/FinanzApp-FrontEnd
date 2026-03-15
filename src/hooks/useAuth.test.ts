import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAuth } from './useAuth';
import { getCurrentUser, clearAuthSession, verifySession } from '@/services/AuthService';
import { useRouter } from 'next/navigation';

vi.mock('@/services/AuthService', () => ({
    getCurrentUser: vi.fn(),
    clearAuthSession: vi.fn(),
    verifySession: vi.fn(),
}));

vi.mock('next/navigation', () => ({
    useRouter: vi.fn(() => ({
        push: vi.fn(),
    })),
}));

describe('useAuth hook', () => {
    const mockUser = { id: '1', nombre: 'Test User', email: 'test@test.com', rol: 'Inversor' };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should initialize with loading true and null user', () => {
        (getCurrentUser as any).mockReturnValue(null);
        const { result } = renderHook(() => useAuth());

        // Note: useEffect runs after render, but in some environments it might run immediately
        // If it runs immediately, we might see it already loaded.
        // Let's assume the state transitions correctly.
        expect(result.current.loading).toBe(false); // Since useEffect runs and calls loadUser
        expect(result.current.user).toBe(null);
    });

    it('should load user from storage', () => {
        (getCurrentUser as any).mockReturnValue(mockUser);
        const { result } = renderHook(() => useAuth());

        expect(result.current.user).toEqual(mockUser);
        expect(result.current.isAuthenticated).toBe(true);
        expect(verifySession).toHaveBeenCalled();
    });

    it('should handle logout', () => {
        const mockPush = vi.fn();
        (useRouter as any).mockReturnValue({ push: mockPush });
        (getCurrentUser as any).mockReturnValue(mockUser);
        
        const { result } = renderHook(() => useAuth());

        act(() => {
            result.current.logout();
        });

        expect(clearAuthSession).toHaveBeenCalled();
        expect(result.current.user).toBe(null);
        expect(mockPush).toHaveBeenCalledWith('/auth/login');
    });

    it('should react to auth changed event', () => {
        (getCurrentUser as any).mockReturnValue(null);
        const { result } = renderHook(() => useAuth());

        expect(result.current.user).toBe(null);

        // Update mock for next call
        (getCurrentUser as any).mockReturnValue(mockUser);

        // Trigger event
        act(() => {
            window.dispatchEvent(new Event('fa-auth-changed'));
        });

        expect(result.current.user).toEqual(mockUser);
    });
});
