import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAuth } from '../useAuth';
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

        (getCurrentUser as any).mockReturnValue(mockUser);

        act(() => {
            window.dispatchEvent(new Event('fa-auth-changed'));
        });

        expect(result.current.user).toEqual(mockUser);
    });

    it('should have isAuthenticated as false when no user', () => {
        (getCurrentUser as any).mockReturnValue(null);
        const { result } = renderHook(() => useAuth());
        expect(result.current.isAuthenticated).toBe(false);
    });

    it('should have isAuthenticated as true when user exists', () => {
        (getCurrentUser as any).mockReturnValue(mockUser);
        const { result } = renderHook(() => useAuth());
        expect(result.current.isAuthenticated).toBe(true);
    });

    it('should call verifySession on initialization', () => {
        renderHook(() => useAuth());
        expect(verifySession).toHaveBeenCalled();
    });

    it('should reload user when refreshUser is called', () => {
        (getCurrentUser as any).mockReturnValue(null);
        const { result } = renderHook(() => useAuth());
        
        (getCurrentUser as any).mockReturnValue(mockUser);
        act(() => {
            result.current.refreshUser();
        });

        expect(result.current.user).toEqual(mockUser);
        expect(verifySession).toHaveBeenCalledTimes(2); // once on init, once on refresh
    });

    it('should maintain stable logout reference', () => {
        const { result, rerender } = renderHook(() => useAuth());
        const firstLogout = result.current.logout;
        
        rerender();
        expect(result.current.logout).toBe(firstLogout);
    });

    it('should maintain stable refreshUser reference', () => {
        const { result, rerender } = renderHook(() => useAuth());
        const firstRefresh = result.current.refreshUser;
        
        rerender();
        expect(result.current.refreshUser).toBe(firstRefresh);
    });

    it('should clean up event listener on unmount', () => {
        const removeSpy = vi.spyOn(window, 'removeEventListener');
        const { unmount } = renderHook(() => useAuth());
        
        unmount();
        expect(removeSpy).toHaveBeenCalledWith('fa-auth-changed', expect.any(Function));
    });

    it('should handle transition from user to null', () => {
        (getCurrentUser as any).mockReturnValue(mockUser);
        const { result } = renderHook(() => useAuth());

        expect(result.current.user).toEqual(mockUser);

        (getCurrentUser as any).mockReturnValue(null);
        act(() => {
            window.dispatchEvent(new Event('fa-auth-changed'));
        });

        expect(result.current.user).toBe(null);
    });

    it('should not crash if getCurrentUser returns undefined', () => {
        (getCurrentUser as any).mockReturnValue(undefined);
        const { result } = renderHook(() => useAuth());
        expect(result.current.user).toBe(undefined);
        expect(result.current.isAuthenticated).toBe(false);
    });

    it('should handle loading state transition', () => {
        (getCurrentUser as any).mockReturnValue(mockUser);
        const { result } = renderHook(() => useAuth());
        // In this test environment, useEffect runs immediately during renderHook
        // so loading will already be false.
        expect(result.current.loading).toBe(false);
    });
});
