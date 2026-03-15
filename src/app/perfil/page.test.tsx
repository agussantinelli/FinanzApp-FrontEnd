import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import ProfilePage from './page';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAuth } from '@/hooks/useAuth';
import * as PersonaService from '@/services/PersonaService';
import { RolUsuario } from '@/types/Usuario';

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
        rol: RolUsuario.Inversor,
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
        (PersonaService.getPersonaById as any).mockResolvedValue(defaultUser);
    });

    it('renders loading state', () => {
        (PersonaService.getPersonaById as any).mockReturnValue(new Promise(() => {})); 
        render(<ProfilePage />);
        expect(screen.queryByRole('progressbar', { hidden: true }) || screen.queryByRole('progressbar')).toBeInTheDocument();
    });

    it('renders profile data correctly', async () => {
        render(<ProfilePage />);

        await waitFor(() => expect(screen.getByText(/Juan Perez/i)).toBeInTheDocument());
        expect(screen.getByText(/juan@test.com/i)).toBeInTheDocument();
        expect(screen.getByText(/Inversor/i)).toBeInTheDocument();
        expect(screen.getByText(/Buenos Aires/i)).toBeInTheDocument();
    });

    it('shows "Completar Perfil" when profile is incomplete', async () => {
        (PersonaService.getPersonaById as any).mockResolvedValue({ ...defaultUser, perfilCompletado: false });
        render(<ProfilePage />);

        await waitFor(() => expect(screen.getByText(/Completar Perfil/i)).toBeInTheDocument());
        expect(screen.queryByText(/Editar Perfil/i)).not.toBeInTheDocument();
    });

    it('handles photo upload', async () => {
        (PersonaService.uploadUserPhoto as any).mockResolvedValue({ url: 'new-photo.jpg' });
        render(<ProfilePage />);

        await waitFor(() => screen.getByText(/Juan Perez/i));
        
        const file = new File(['hello'], 'hello.png', { type: 'image/png' });
        const input = document.querySelector('input[type="file"]') as HTMLInputElement;

        if (input) {
            await act(async () => {
                fireEvent.change(input, { target: { files: [file] } });
            });
            await waitFor(() => expect(PersonaService.uploadUserPhoto).toHaveBeenCalled());
        }
    });
});
