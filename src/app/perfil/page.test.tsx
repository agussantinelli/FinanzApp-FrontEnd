import { render, screen, waitFor } from '@testing-library/react';
import ProfilePage from './page';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAuth } from '@/hooks/useAuth';
import { getPersonaById } from '@/services/PersonaService';

vi.mock('@/hooks/useAuth');
vi.mock('@/services/PersonaService');
vi.mock('next/link', () => ({
    default: ({ children }: any) => <a>{children}</a>,
}));

describe('ProfilePage', () => {
    const defaultUser = {
        id: 1,
        nombre: 'Juan',
        apellido: 'Perez',
        rol: 'Inversor',
        email: 'juan@test.com',
        urlFotoPerfil: 'http://example.com/photo.jpg',
        fechaNacimiento: '1990-01-01',
        nacionalidadNombre: 'Argentina',
        paisResidenciaNombre: 'Argentina',
        provinciaResidenciaNombre: 'Buenos Aires',
        localidadResidenciaNombre: 'La Plata'
    };

    beforeEach(() => {
        (useAuth as any).mockReturnValue({ user: { id: 1 }, logout: vi.fn() });
        (getPersonaById as any).mockResolvedValue(defaultUser);
    });

    it('renders profile information', async () => {
        render(<ProfilePage />);
        expect(await screen.findByText('Juan Perez')).toBeInTheDocument();
        expect(screen.getByText('Inversor')).toBeInTheDocument();
        expect(screen.getByText('juan@test.com')).toBeInTheDocument();
        expect(screen.getByText('La Plata')).toBeInTheDocument();
    });

    it('renders loading state', () => {
        render(<ProfilePage />);
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });
});
