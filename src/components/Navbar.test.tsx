import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Navbar from './Navbar';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAuth } from '@/hooks/useAuth';

// Mocks
vi.mock('@/hooks/useAuth');
vi.mock('next/navigation', () => ({
    useRouter: () => ({ push: vi.fn() }),
    usePathname: () => '/',
}));
vi.mock('next/link', () => ({
    default: ({ children, href, onClick }: any) => (
        <a href={href} onClick={onClick}>{children}</a>
    ),
}));
vi.mock('next/image', () => ({
    default: ({ src, alt }: any) => <img src={src} alt={alt} />,
}));
vi.mock('@/components/ui/FloatingMessage', () => ({
    default: () => null,
}));

describe('Navbar', () => {
    const mockLogout = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        (useAuth as any).mockReturnValue({
            user: null,
            isAuthenticated: false,
            logout: mockLogout,
        });
    });

    it('renders public elements when unauthenticated', async () => {
        render(<Navbar />);

        expect(screen.getByText('FinanzApp')).toBeInTheDocument();
        expect(screen.getByText('Iniciar sesión')).toBeInTheDocument();
        expect(screen.getByText('Registrarse')).toBeInTheDocument();
    });

    it('renders authenticated elements when logged in as Inversor', async () => {
        (useAuth as any).mockReturnValue({
            user: { nombre: 'Agus', apellido: 'Test', rol: 'Inversor' },
            isAuthenticated: true,
            logout: mockLogout,
        });

        render(<Navbar />);

        await waitFor(() => {
            expect(screen.getByText(/Agus Test/)).toBeInTheDocument();
        });

        expect(screen.queryByText('Iniciar sesión')).not.toBeInTheDocument();
        expect(screen.getByText('Dashboard')).toBeInTheDocument();
        expect(screen.getByText('Portafolio')).toBeInTheDocument();
        expect(screen.queryByText('Admin Panel')).not.toBeInTheDocument();
    });

    it('renders admin elements when logged in as Admin', async () => {
        (useAuth as any).mockReturnValue({
            user: { nombre: 'Admin', apellido: 'User', rol: 'Admin' },
            isAuthenticated: true,
            logout: mockLogout,
        });

        render(<Navbar />);

        await waitFor(() => {
            expect(screen.getByText('Dashboard')).toBeInTheDocument();
        });

        // We could add checks for admin specific links if they existed in the navbar
        // For now, confirming base auth links are there
        expect(screen.getByText(/Admin User/)).toBeInTheDocument();
    });

    it('opens user menu and verifies logout', async () => {
        (useAuth as any).mockReturnValue({
            user: { nombre: 'Agus', apellido: 'Test', rol: 'Admin' },
            isAuthenticated: true,
            logout: mockLogout,
        });

        render(<Navbar />);
        await waitFor(() => {
            expect(screen.getByText(/Admin/)).toBeInTheDocument();
        });

        const userButton = screen.getByText(/Agus Test/).closest('button');
        fireEvent.click(userButton!);

        expect(screen.getByText('Perfil')).toBeInTheDocument();
        const logoutButton = screen.getByText('Cerrar sesión');
        expect(logoutButton).toBeInTheDocument();

        fireEvent.click(logoutButton);
        await waitFor(() => expect(mockLogout).toHaveBeenCalled(), { timeout: 1500 });
    });

    it('opens and closes the "Mas" menu', async () => {
        (useAuth as any).mockReturnValue({
            user: { nombre: 'Agus', apellido: 'Test', rol: 'Inversor' },
            isAuthenticated: true,
            logout: mockLogout,
        });

        render(<Navbar />);
        await waitFor(() => {
            expect(screen.getByText('Más')).toBeInTheDocument();
        });

        const moreButton = screen.getByText('Más');
        fireEvent.click(moreButton);

        expect(screen.getByText('Mis Operaciones')).toBeInTheDocument();
    });

    it('opens mobile drawer on menu icon click', async () => {
        render(<Navbar />);
        const menuIcon = screen.getByLabelText('menu');
        fireEvent.click(menuIcon);

        // Drawer items (unauth)
        expect(screen.getAllByText('Inicio')).toHaveLength(2); // One in desktop, one in mobile
        expect(screen.getAllByText('Activos')).toHaveLength(2);
    });

    it('navigates to login when clicking "Iniciar sesión"', () => {
        render(<Navbar />);
        
        const loginBtn = screen.getByText('Iniciar sesión');
        expect(loginBtn.closest('a')).toHaveAttribute('href', '/auth/login');
    });

    it('shows Experto label when user is Experto', async () => {
        (useAuth as any).mockReturnValue({
            user: { nombre: 'Exp', apellido: 'User', rol: 'Experto' },
            isAuthenticated: true,
            logout: mockLogout,
        });

        render(<Navbar />);
        await waitFor(() => {
            expect(screen.getByText(/Experto •/)).toBeInTheDocument();
        });
    });

    it('redirects to correct home path based on role logo click', async () => {
        (useAuth as any).mockReturnValue({
            user: { nombre: 'Adm', apellido: 'User', rol: 'Admin' },
            isAuthenticated: true,
            logout: mockLogout,
        });
        
        render(<Navbar />);
        const logoLink = screen.getByText('FinanzApp').closest('a');
        // Based on getHomePathForRole mock
        expect(logoLink).toHaveAttribute('href', '/dashboard-admin');
    });

    it('verifies mobile drawer contains auth items for Inversor', async () => {
        (useAuth as any).mockReturnValue({
            user: { nombre: 'Agus', apellido: 'Test', rol: 'Inversor' },
            isAuthenticated: true,
            logout: mockLogout,
        });

        render(<Navbar />);
        const menuIcon = screen.getByLabelText('menu');
        fireEvent.click(menuIcon);

        // Auth more items in mobile
        expect(screen.getByText('Mis Operaciones')).toBeInTheDocument();
        expect(screen.getAllByText('Cerrar sesión')).toHaveLength(1);
    });
});
