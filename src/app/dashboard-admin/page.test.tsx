import { render, screen, fireEvent } from '@testing-library/react';
import AdminDashboardPage from './page';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAuth } from '@/hooks/useAuth';

vi.mock('@/hooks/useAuth');
vi.mock('@/components/auth/RoleGuard', () => ({
    RoleGuard: ({ children }: any) => <div>{children}</div>
}));

// Mock child tabs
vi.mock('./components/ResumenTab', () => ({ default: () => <div>Resumen Tab Content</div> }));
vi.mock('./components/UsuariosTab', () => ({ default: () => <div>Usuarios Tab Content</div> }));
vi.mock('./components/OperacionesTab', () => ({ default: () => <div>Operaciones Tab Content</div> }));
vi.mock('./components/ActivosTab', () => ({ default: () => <div>Activos Tab Content</div> }));
vi.mock('./components/RecomendacionesTab', () => ({ default: () => <div>Recomendaciones Tab Content</div> }));
vi.mock('./components/PortafolioTab', () => ({ default: () => <div>Portafolio Tab Content</div> }));

describe('AdminDashboardPage', () => {
    beforeEach(() => {
        (useAuth as any).mockReturnValue({
            user: { nombre: 'SuperAdmin', rol: 'Admin' }
        });
    });

    it('renders header and tabs', () => {
        render(<AdminDashboardPage />);
        expect(screen.getByText('Panel Administrador')).toBeInTheDocument();
        expect(screen.getByText('Bienvenido, SuperAdmin. Gestiona usuarios, activos y monitorea operaciones.')).toBeInTheDocument();

        expect(screen.getByText('Resumen')).toBeInTheDocument();
        expect(screen.getByText('Usuarios')).toBeInTheDocument();
    });

    it('shows default tab content (Resumen)', () => {
        render(<AdminDashboardPage />);
        expect(screen.getByText('Resumen Tab Content')).toBeInTheDocument();
        expect(screen.queryByText('Usuarios Tab Content')).not.toBeInTheDocument();
    });

    it('switches tabs correctly', () => {
        render(<AdminDashboardPage />);
        const usersTab = screen.getByText('Usuarios');
        fireEvent.click(usersTab);
        expect(screen.getByText('Usuarios Tab Content')).toBeInTheDocument();
        expect(screen.queryByText('Resumen Tab Content')).not.toBeInTheDocument();
    });

    it('reloads page on refresh button click', () => {
        const reloadMock = vi.fn();
        Object.defineProperty(window, 'location', {
            value: { reload: reloadMock }
        });

        render(<AdminDashboardPage />);
        const refreshBtn = screen.getByText('Recargar');
        fireEvent.click(refreshBtn);
        expect(reloadMock).toHaveBeenCalled();
    });
});
