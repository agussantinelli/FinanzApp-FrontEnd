import { vi, describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@/test/test-utils';
import AdminDashboardPage from '@/app/dashboard-admin/page';
import { server } from '@/test/msw/server';
import { http, HttpResponse } from 'msw';

// Mock navigation
vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: vi.fn(),
    }),
}));

const mockUser = { id: 1, nombre: 'Admin', rol: 'ADMIN' };

// Mock AuthService so RoleGuard passes
vi.mock('@/services/AuthService', async (importOriginal) => {
    const original = await importOriginal<typeof import('@/services/AuthService')>();
    return {
        ...original,
        hasRole: vi.fn((role) => role === 'ADMIN'),
        getCurrentUser: vi.fn(() => mockUser),
    };
});

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
        });

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
