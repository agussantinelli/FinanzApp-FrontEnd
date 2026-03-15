import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import ProfilePage from './page';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAuth } from '@/hooks/useAuth';
import { getPersonaById, uploadUserPhoto } from '@/services/PersonaService';

vi.mock('@/hooks/useAuth');
vi.mock('@/services/PersonaService');
vi.mock('next/link', () => ({
    default: ({ children, href }: any) => <a href={href}>{children}</a>,
}));

describe('ProfilePage', () => {
    const defaultUser = {
        id: 'u1',
        nombre: 'Juan',
        apellido: 'Perez',
        rol: 'Inversor',
        email: 'juan@test.com',
        urlFotoPerfil: 'http://example.com/photo.jpg',
        fechaNacimiento: '1990-01-01',
        nacionalidadNombre: 'Argentina',
        paisResidenciaNombre: 'Argentina',
        provinciaResidenciaNombre: 'Buenos Aires',
        localidadResidenciaNombre: 'La Plata',
        perfilCompletado: true,
        tieneContrasenaConfigurada: true
    };

    beforeEach(() => {
        vi.clearAllMocks();
        (useAuth as any).mockReturnValue({ user: { id: 'u1' }, logout: vi.fn() });
        (getPersonaById as any).mockResolvedValue(defaultUser);
    });

    it('renders loading state', () => {
        (getPersonaById as any).mockReturnValue(new Promise(() => {})); // Never resolves
        render(<ProfilePage />);
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('renders profile data correctly', async () => {
        render(<ProfilePage />);

        await waitFor(() => expect(screen.getByText('Juan Perez')).toBeInTheDocument());
        expect(screen.getByText('juan@test.com')).toBeInTheDocument();
        expect(screen.getByText('Inversor')).toBeInTheDocument();
        expect(screen.getByText('Buenos Aires')).toBeInTheDocument();
    });

    it('shows "Completar Perfil" when profile is incomplete', async () => {
        (getPersonaById as any).mockResolvedValue({ ...defaultUser, perfilCompletado: false });
        render(<ProfilePage />);

        await waitFor(() => expect(screen.getByText('Completar Perfil')).toBeInTheDocument());
        expect(screen.queryByText('Editar Perfil')).not.toBeInTheDocument();
    });

    it('shows "Establecer Contraseña" when not configured', async () => {
        (getPersonaById as any).mockResolvedValue({ ...defaultUser, tieneContrasenaConfigurada: false });
        render(<ProfilePage />);

        await waitFor(() => expect(screen.getByText('Establecer Contraseña')).toBeInTheDocument());
    });

    it('handles photo upload', async () => {
        (uploadUserPhoto as any).mockResolvedValue({ url: 'new-photo.jpg' });
        render(<ProfilePage />);

        await waitFor(() => screen.getByText('Juan Perez'));
        
        const file = new File(['hello'], 'hello.png', { type: 'image/png' });
        const input = screen.getByLabelText('', { selector: 'input[type="file"]' });

        fireEvent.change(input, { target: { files: [file] } });

        await waitFor(() => expect(uploadUserPhoto).toHaveBeenCalled());
    });
});
