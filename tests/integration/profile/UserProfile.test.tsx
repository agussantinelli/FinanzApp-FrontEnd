import { vi, describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@/test/test-utils';
import UserProfilePage from '@/app/perfil/editar/page';
import { server } from '@/test/msw/server';
import { http, HttpResponse } from 'msw';

// Mock navigation
vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: vi.fn(),
        back: vi.fn(),
    }),
}));

// Mock useAuth
vi.mock('@/hooks/useAuth', () => ({
    useAuth: () => ({
        isAuthenticated: true,
        user: { id: 1, nombre: 'Agus' }
    })
}));

describe('UserProfile Integration', () => {
    const mockPersona = {
        id: 1,
        nombre: 'Agus',
        apellido: 'Santinelli',
        fechaNacimiento: '1995-01-01T00:00:00',
        rol: 'Inversor',
        esResidenteArgentina: true,
        paisResidenciaId: 1,
        nacionalidadId: 1,
        localidadResidenciaId: 10,
        nacionalidadNombre: 'Argentina'
    };

    const mockGeoData = {
        paises: [{ id: 1, nombre: 'Argentina', esArgentina: true }, { id: 2, nombre: 'Uruguay', esArgentina: false }],
        provinciasArgentina: [{ id: 5, nombre: 'Buenos Aires' }],
        localidadesArgentina: [{ id: 10, nombre: 'La Plata', provinciaId: 5 }]
    };

    beforeEach(() => {
        server.use(
            http.get('**/api/persona/1', () => HttpResponse.json(mockPersona)),
            http.get('**/api/auth/geo-data', () => HttpResponse.json(mockGeoData)),
            http.put('**/api/persona/1', () => HttpResponse.json({ success: true }))
        );
    });

    it('should render profile data and allow editing', async () => {
        render(<UserProfilePage />);

        // Wait for data to load
        await waitFor(() => {
            expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
        });

        // Check initial values
        expect(screen.getByLabelText(/Nombre/i)).toHaveValue('Agus');
        expect(screen.getByLabelText(/Apellido/i)).toHaveValue('Santinelli');

        // Edit name
        fireEvent.change(screen.getByLabelText(/Nombre/i), { target: { value: 'Agustin' } });
        
        // Submit
        const submitButton = screen.getByRole('button', { name: /Guardar Cambios/i });
        fireEvent.click(submitButton);

        // Verify success
        await screen.findByText(/Perfil actualizado correctamente/i);
    });

    it('should toggle residency fields correctly', async () => {
        render(<UserProfilePage />);

        await waitFor(() => {
            expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
        });

        // Currently resident in Argentina (Switch is checked)
        const residencySwitch = screen.getByLabelText(/Resido en Argentina/i);
        expect(residencySwitch).toBeChecked();

        // Toggle to NON-resident
        fireEvent.click(residencySwitch);
        
        // Should show Country selector and hide Province/Locality (or at least hide the ones for Argentina)
        await waitFor(() => {
            expect(screen.getByLabelText(/País de Residencia/i)).toBeInTheDocument();
        });
    });
});
