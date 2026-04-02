import { render, screen, waitFor } from '@/test/test-utils';
import { RoleGuard } from '../RoleGuard';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAuth } from '@/hooks/useAuth';
import { hasRole } from '@/services/AuthService';
import { RolUsuario } from '@/types/Usuario';

vi.mock('@/hooks/useAuth');
vi.mock('@/services/AuthService');

const mockReplace = vi.fn();
vi.mock('next/navigation', () => ({
    useRouter: () => ({ replace: mockReplace })
}));

describe('RoleGuard', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders loading state', () => {
        (useAuth as any).mockReturnValue({ loading: true });
        render(<RoleGuard>Content</RoleGuard>);
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('redirects to login if not authenticated', async () => {
        (useAuth as any).mockReturnValue({ user: null, loading: false });
        render(<RoleGuard>Content</RoleGuard>);
        expect(mockReplace).toHaveBeenCalledWith('/auth/login');
    });

    it('redirects to access-denied if role not allowed', () => {
        (useAuth as any).mockReturnValue({ user: { rol: 'Inversor' }, loading: false });
        (hasRole as any).mockReturnValue(false); // No allowed roles overlap
        
        render(<RoleGuard allowedRoles={[RolUsuario.Admin]}>Content</RoleGuard>);
        expect(mockReplace).toHaveBeenCalledWith('/access-denied');
    });

    it('renders children if authenticated and role allowed', () => {
        (useAuth as any).mockReturnValue({ user: { rol: 'Admin' }, loading: false });
        (hasRole as any).mockReturnValue(true);
        
        render(<RoleGuard allowedRoles={[RolUsuario.Admin]}>Content</RoleGuard>);
        expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('renders children if authenticated and no specific roles required', () => {
        (useAuth as any).mockReturnValue({ user: { rol: 'Inversor' }, loading: false });
        
        render(<RoleGuard>Content</RoleGuard>);
        expect(screen.getByText('Content')).toBeInTheDocument();
    });
});
