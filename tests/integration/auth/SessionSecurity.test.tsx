import { vi, describe, it, expect } from 'vitest';
import { render, waitFor } from '@/test/test-utils';
import PortfolioPage from '@/app/portfolio/page';
import { server } from '@/test/msw/server';
import { http, HttpResponse } from 'msw';
import { clearAuthSession } from '@/services/AuthService';

// Mock navigation
vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: vi.fn(),
        replace: vi.fn(),
        prefetch: vi.fn(),
        back: vi.fn(),
    }),
    useSearchParams: () => new URLSearchParams(),
}));

const mockUser = { id: 1, nombre: 'Agus', rol: 'INVERSOR' };

// Mock AuthService
vi.mock('@/services/AuthService', async (importOriginal) => {
    const original = await importOriginal<typeof import('@/services/AuthService')>();
    return {
        ...original,
        hasRole: vi.fn(() => true),
        getCurrentUser: vi.fn(() => mockUser),
        clearAuthSession: vi.fn(),
    };
});

describe('SessionSecurity Integration', () => {
    it('should handle 401 Unauthorized by clearing session', async () => {
        // Intercept any call and return 401
        server.use(
            http.get('*/portafolios/mis-portafolios', () => {
                return new HttpResponse(null, { status: 401 });
            })
        );

        if (typeof window !== 'undefined') {
            sessionStorage.setItem('fa_token', 'fake-token');
        }

        const clearSpy = vi.spyOn(Storage.prototype, 'clear');

        render(<PortfolioPage />);

        await waitFor(() => {
            expect(clearSpy).toHaveBeenCalled();
        });
    });
});
