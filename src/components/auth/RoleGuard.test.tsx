import { render, screen, waitFor } from '@testing-library/react';
import { RoleGuard } from './RoleGuard';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAuth } from '@/hooks/useAuth';
import { hasRole } from '@/services/AuthService';
import { useRouter } from 'next/navigation';

vi.mock('@/hooks/useAuth');
vi.mock('@/services/AuthService');
vi.mock('next/navigation', () => ({
    useRouter: () => ({ replace: vi.fn() })
}));

describe('RoleGuard', () => {
    const mockReplace = vi.fn();

    beforeEach(() => {
        (useRouter as any).mockReturnValue({ replace: mockReplace });
    });

    it('renders children if allowed', () => {
        (useAuth as any).mockReturnValue({ user: { id: 1 }, loading: false });
        (hasRole as any).mockReturnValue(true);

        render(<RoleGuard allowedRoles={['Admin' as any]}><div>Protected</div></RoleGuard>);
        expect(screen.getByText('Protected')).toBeInTheDocument();
    });

    it('redirects if not logged in', () => {
        (useAuth as any).mockReturnValue({ user: null, loading: false });

        render(<RoleGuard><div>Protected</div></RoleGuard>);
        expect(mockReplace).toHaveBeenCalledWith('/auth/login');
    });

    it('redirects if unauthorized', () => {
        (useAuth as any).mockReturnValue({ user: { id: 1 }, loading: false });
        (hasRole as any).mockReturnValue(false);

        render(<RoleGuard allowedRoles={['Admin' as any]}><div>Protected</div></RoleGuard>);
        expect(mockReplace).toHaveBeenCalledWith('/access-denied');
    });

    it('shows loading', () => {
        (useAuth as any).mockReturnValue({ user: null, loading: true });
        render(<RoleGuard><div>Protected</div></RoleGuard>);
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });
});
