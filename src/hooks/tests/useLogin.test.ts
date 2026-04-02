import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLogin } from '../useLogin';
import { login, googleLogin, getHomePathForRole } from '@/services/AuthService';
import { useRouter, useSearchParams } from 'next/navigation';

vi.mock('@/services/AuthService', () => ({
    login: vi.fn(),
    googleLogin: vi.fn(),
    getHomePathForRole: vi.fn(),
}));

vi.mock('next/navigation', () => ({
    useRouter: vi.fn(),
    useSearchParams: vi.fn(),
}));

describe('useLogin hook', () => {
    const mockPush = vi.fn();
    const mockGet = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        (useRouter as any).mockReturnValue({ push: mockPush });
        (useSearchParams as any).mockReturnValue({ get: mockGet });
    });

    it('should initialize with email from search params', () => {
        mockGet.mockReturnValue('test@example.com');
        const { result } = renderHook(() => useLogin());
        expect(result.current.email).toBe('test@example.com');
    });

    it('should validate empty fields', async () => {
        mockGet.mockReturnValue(null); // Ensure empty email
        const { result } = renderHook(() => useLogin());
        
        await act(async () => {
            await result.current.handleSubmit({ preventDefault: vi.fn() } as any);
        });

        expect(result.current.fieldErrors.email).toBeDefined();
        expect(result.current.fieldErrors.password).toBeDefined();
        expect(login).not.toHaveBeenCalled();
    });

    it('should handle successful login', async () => {
        vi.useFakeTimers();
        (login as any).mockResolvedValue({ rol: 'Inversor' });
        (getHomePathForRole as any).mockReturnValue('/dashboard');
        
        const { result } = renderHook(() => useLogin());
        
        act(() => {
            result.current.setEmail('test@test.com');
            result.current.setPassword('password');
        });

        await act(async () => {
            await result.current.handleSubmit({ preventDefault: vi.fn() } as any);
        });

        expect(result.current.loading).toBe(true);
        expect(result.current.successMessage).toContain('Inicio de sesión correcto');
        
        act(() => {
            vi.runAllTimers();
        });

        expect(mockPush).toHaveBeenCalledWith('/dashboard');
        vi.useRealTimers();
    });

    it('should handle failed login', async () => {
        (login as any).mockRejectedValue(new Error('Fail'));
        const { result } = renderHook(() => useLogin());
        
        act(() => {
            result.current.setEmail('test@test.com');
            result.current.setPassword('password');
        });

        await act(async () => {
            await result.current.handleSubmit({ preventDefault: vi.fn() } as any);
        });

        expect(result.current.serverError).toBe('Email o contraseña incorrectos.');
        expect(result.current.loading).toBe(false);
    });

    it('should open google login window', () => {
        const spy = vi.spyOn(window, 'open').mockImplementation(() => null);
        process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID = 'test-id';
        const { result } = renderHook(() => useLogin());
        
        act(() => {
            result.current.handleGoogleLogin();
        });

        expect(spy).toHaveBeenCalled();
    });
});
