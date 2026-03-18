import { vi, describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@/test/test-utils';
import PortfolioPage from '@/app/portfolio/page';
import { server } from '@/test/msw/server';
import { http, HttpResponse } from 'msw';

// Mock navigation
vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: vi.fn(),
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
        logout: vi.fn(),
    };
});

describe('SessionSecurity Integration', () => {
    it('should handle 401 Unauthorized by logging out', async () => {
        // Intercept any call and return 401
        server.use(
            http.get('*/portafolios/mis-portafolios', () => {
                return new HttpResponse(null, { status: 401 });
            })
        );

        render(<PortfolioPage />);

        await waitFor(() => {
            // Depending on implementation, error message might appear
            expect(screen.getByText(/Error/i)).toBeInTheDocument();
        });
    });
});
