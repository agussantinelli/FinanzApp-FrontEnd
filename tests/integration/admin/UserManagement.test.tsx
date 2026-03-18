import { vi, describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@/test/test-utils';
import AdminDashboardPage from '@/app/dashboard-admin/page';
import { server } from '@/test/msw/server';
import { http, HttpResponse } from 'msw';
import { RolUsuario } from '@/types/Usuario';

// Mock navigation
vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: vi.fn(),
        replace: vi.fn(),
        prefetch: vi.fn(),
        back: vi.fn(),
    }),
}));

const mockUser = { id: 1, nombre: 'Admin', rol: RolUsuario.Admin };

// Mock AuthService so RoleGuard passes
vi.mock('@/services/AuthService', () => ({
    hasRole: vi.fn((role) => role === RolUsuario.Admin),
    getCurrentUser: vi.fn(() => mockUser),
    getToken: vi.fn(() => 'fake-token'),
}));

// Mock useAuth hook directly to ensure it returns the admin user
vi.mock('@/hooks/useAuth', () => ({
    useAuth: () => ({
        user: mockUser,
        isAuthenticated: true,
        loading: false,
    }),
}));

describe('UserManagement Integration', () => {
    beforeEach(() => {
        server.use(
            http.get('*/api/admin/users', () => {
                return HttpResponse.json([
                    { id: '1', nombre: 'Test User', apellido: 'One', email: 'test@example.com', rol: 'INVERSOR', estado: 'ACTIVO' }
                ]);
            }),
            http.get('*/api/admin/stats', () => {
                return HttpResponse.json({ totalUsuarios: 1, usuariosActivos: 1 });
            })
        );
    });

    it('should list users in the admin dashboard', async () => {
        render(<AdminDashboardPage />);

        // Wait for dashboard load
        await waitFor(() => {
            expect(screen.getByText(/Panel Administrador/i)).toBeInTheDocument();
        }, { timeout: 5000 });

        // Switch to Users tab
        const usersTab = screen.getByRole('tab', { name: /Usuarios/i });
        fireEvent.click(usersTab);

        // Verify user list
        await waitFor(() => {
            expect(screen.getByText(/test@example.com/i)).toBeInTheDocument();
            expect(screen.getByText(/Test User/i)).toBeInTheDocument();
        });
    });
});
