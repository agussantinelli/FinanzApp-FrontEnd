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
        // Default to unauthenticated
        (useAuth as any).mockReturnValue({
            user: null,
            isAuthenticated: false,
            logout: mockLogout,
        });
    });

    it('renders public elements when unauthenticated', async () => {
        render(<Navbar />);

        // Check for basic logo
        expect(screen.getByText('FinanzApp')).toBeInTheDocument();
        // Check for public specific buttons
        expect(screen.getByText('Iniciar sesión')).toBeInTheDocument();
        expect(screen.getByText('Registrarse')).toBeInTheDocument();
    });

    it('renders authenticated elements when logged in', async () => {
        (useAuth as any).mockReturnValue({
            user: { nombre: 'Agus', apellido: 'Test', rol: 'Inversor' },
            isAuthenticated: true,
            logout: mockLogout,
        });

        render(<Navbar />);

        // Wait for mounted effect
        await waitFor(() => {
            expect(screen.getByText(/Agus Test/)).toBeInTheDocument();
        });

        expect(screen.queryByText('Iniciar sesión')).not.toBeInTheDocument();
        expect(screen.getByText('Dashboard')).toBeInTheDocument();
        expect(screen.getByText('Portafolio')).toBeInTheDocument();
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

        // Open menu
        const userButton = screen.getByText(/Agus Test/).closest('button');
        fireEvent.click(userButton!);

        // Check menu items
        expect(screen.getByText('Perfil')).toBeInTheDocument();
        const logoutButton = screen.getByText('Cerrar sesión');
        expect(logoutButton).toBeInTheDocument();

        // Click logout
        fireEvent.click(logoutButton);
        // Logout is delayed by 1000ms in component
        await waitFor(() => expect(mockLogout).toHaveBeenCalled(), { timeout: 1500 });
    });
});
