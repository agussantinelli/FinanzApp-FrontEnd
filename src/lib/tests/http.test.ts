import { describe, it, expect, vi, beforeEach } from 'vitest';
import { http } from '../http';
import { clearCache } from '@/lib/activos-cache';

vi.mock('@/lib/activos-cache', () => ({
    clearCache: vi.fn(),
}));

describe('http lib', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        sessionStorage.clear();
        // Mock window.location
        vi.stubGlobal('location', {
            href: '',
            pathname: '/',
        });
    });

    it('should add Authorization header if token exists in sessionStorage', async () => {
        sessionStorage.setItem('fa_token', 'mock-token');
        
        // We can't easily trigger a real request here without a mock adapter or nock, 
        // but we can check the interceptors array or mock axios internals.
        // Actually, let's just check the request config using interceptor directly.
        
        const requestInterceptor = (http.interceptors.request as any).handlers[0].fulfilled;
        const config = await requestInterceptor({ headers: {} });
        
        expect(config.headers.Authorization).toBe('Bearer mock-token');
    });

    it('should NOT add Authorization header if token is missing', async () => {
        const requestInterceptor = (http.interceptors.request as any).handlers[0].fulfilled;
        const config = await requestInterceptor({ headers: {} });
        
        expect(config.headers.Authorization).toBeUndefined();
    });

    it('should clear session and redirect on 401 if token existed', async () => {
        sessionStorage.setItem('fa_token', 'stale-token');
        
        const responseInterceptorError = (http.interceptors.response as any).handlers[0].rejected;
        
        const error = {
            response: { status: 401 }
        };

        try {
            await responseInterceptorError(error);
        } catch (e) {
            // rejection is expected
        }

        expect(sessionStorage.getItem('fa_token')).toBeNull();
        expect(clearCache).toHaveBeenCalled();
        expect(window.location.href).toContain('/auth/login?session=expired');
    });

    it('should NOT redirect on 401 if already on login page', async () => {
        sessionStorage.setItem('fa_token', 'stale-token');
        vi.stubGlobal('location', {
            href: '',
            pathname: '/auth/login',
        });
        
        const responseInterceptorError = (http.interceptors.response as any).handlers[0].rejected;
        
        const error = {
            response: { status: 401 }
        };

        try {
            await responseInterceptorError(error);
        } catch (e) {
            // rejection is expected
        }

        expect(window.location.href).toBe(''); // No change
    });
});
