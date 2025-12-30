import { screen, fireEvent, waitFor } from '@testing-library/react';
import { render } from '@/test/test-utils';
import EditProfilePage from './page';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAuth } from '@/hooks/useAuth';
import { getPersonaById, updatePersona } from '@/services/PersonaService';
import { getRegisterGeoData } from '@/services/AuthService';

vi.mock('@/hooks/useAuth');
vi.mock('@/services/PersonaService');
vi.mock('@/services/AuthService');
vi.mock('next/navigation', () => ({
    useRouter: () => ({ back: vi.fn(), push: vi.fn() }),
}));

describe('EditProfilePage', () => {
    const defaultUser = {
        id: 1,
        nombre: 'Juan',
        apellido: 'Perez',
        fechaNacimiento: '1990-01-01T00:00:00',
        rol: 'Inversor',
        esResidenteArgentina: true,
        paisResidenciaId: 1,
        nacionalidadId: 1,
        localidadResidenciaId: 1,
        email: 'juan@test.com',
        urlFotoPerfil: ''
    };
    const defaultGeo = {
        paises: [{ id: 1, nombre: 'Argentina', esArgentina: true }, { id: 2, nombre: 'Uruguay', esArgentina: false }],
        provinciasArgentina: [{ id: 1, nombre: 'Buenos Aires', paisId: 1 }],
        localidadesArgentina: [{ id: 1, nombre: 'La Plata', provinciaId: 1 }]
    };

    beforeEach(() => {
        (useAuth as any).mockReturnValue({ user: { id: 1 } });
        (getPersonaById as any).mockResolvedValue(defaultUser);
        (getRegisterGeoData as any).mockResolvedValue(defaultGeo);
        window.alert = vi.fn();
    });

    it('renders form with user data', async () => {
        render(<EditProfilePage />);
        await waitFor(() => {
            expect((screen.getByLabelText(/Nombre/i) as HTMLInputElement).value).toBe('Juan');
        });
        expect((screen.getByLabelText(/Apellido/i) as HTMLInputElement).value).toBe('Perez');
    });

    it('updates user data on submit', async () => {
        render(<EditProfilePage />);
        await waitFor(() => {
            expect((screen.getByLabelText(/Nombre/i) as HTMLInputElement).value).toBe('Juan');
        });

        const nameInput = screen.getByLabelText(/Nombre/i);
        fireEvent.change(nameInput, { target: { value: 'Juan Carlos' } });

        const submitBtn = screen.getByText('Guardar Cambios');
        fireEvent.click(submitBtn);

        await waitFor(() => {
            expect(updatePersona).toHaveBeenCalledWith(1, expect.objectContaining({ nombre: 'Juan Carlos' }));
        });
    });

    it('handles switching residence to not Argentina', async () => {
        render(<EditProfilePage />);
        await waitFor(() => screen.getByLabelText('Resido en Argentina'));

        const switchControl = screen.getByLabelText('Resido en Argentina');
        fireEvent.click(switchControl);

        expect(await screen.findByLabelText(/País de Residencia/i)).toBeInTheDocument();

        expect(screen.queryByLabelText(/Provincia/i)).not.toBeInTheDocument();
    });
});
