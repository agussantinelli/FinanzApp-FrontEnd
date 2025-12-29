import { render, screen, fireEvent, waitFor } from '@/test/test-utils';
import RegisterPage from './page';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useRegister } from '@/hooks/useRegister';

vi.mock('@/hooks/useRegister');
vi.mock('next/link', () => ({
    default: ({ children }: any) => <a>{children}</a>,
}));
vi.mock('@/components/ui/FloatingMessage', () => ({
    default: () => null,
}));

describe('RegisterPage', () => {
    const mockHandleSubmit = vi.fn((e) => e.preventDefault());

    beforeEach(() => {
        (useRegister as any).mockReturnValue({
            nombre: '', setNombre: vi.fn(),
            apellido: '', setApellido: vi.fn(),
            email: '', setEmail: vi.fn(),
            fechaNac: '', setFechaNac: vi.fn(),
            password: '', setPassword: vi.fn(),
            password2: '', setPassword2: vi.fn(),
            paisNacId: '', setPaisNacId: vi.fn(),
            paisResidenciaId: '', setPaisResidenciaId: vi.fn(),
            provinciaResidenciaId: '', setProvinciaResidenciaId: vi.fn(),
            localidadResidenciaId: '', setLocalidadResidenciaId: vi.fn(),

            geoData: { paises: [{ id: 1, nombre: 'Argentina' }] },
            loadingGeo: false,
            errorGeo: null,
            provinciasParaCombo: [],
            localidadesParaCombo: [],
            esResidenciaArgentina: false,

            submitting: false,
            fieldErrors: {},
            apiError: null,
            successSubmit: null,

            handleSubmit: mockHandleSubmit,
            clearFieldError: vi.fn(),
            clearApiError: vi.fn(),
            clearSuccessSubmit: vi.fn(),
        });
    });

    it('renders register form', () => {
        render(<RegisterPage />);
        expect(screen.getByText('Crear cuenta')).toBeInTheDocument();
        expect(screen.getByLabelText('Nombre')).toBeInTheDocument();
        expect(screen.getByLabelText('Datos personales')).toBeInTheDocument();
    });

    it('shows loading geo state', () => {
        (useRegister as any).mockReturnValue({
            ...((useRegister as any)()),
            loadingGeo: true
        });
        render(<RegisterPage />);
        expect(screen.getByText('Cargando...')).toBeInTheDocument();
    });

    it('shows error geo state', () => {
        (useRegister as any).mockReturnValue({
            ...((useRegister as any)()),
            loadingGeo: false,
            errorGeo: 'Network error',
            geoData: null
        });
        render(<RegisterPage />);
        expect(screen.getByText('Error al cargar datos')).toBeInTheDocument();
        expect(screen.getByText('Network error')).toBeInTheDocument();
    });

    it('renders provinces field only when Argentina is selected', () => {
        const { rerender } = render(<RegisterPage />);
        expect(screen.queryByLabelText('Provincia de residencia')).not.toBeInTheDocument();

        (useRegister as any).mockReturnValue({
            ...((useRegister as any)()),
            esResidenciaArgentina: true,
            provinciasParaCombo: [{ id: 1, nombre: 'Buenos Aires' }]
        });
        rerender(<RegisterPage />);
        expect(screen.getByLabelText('Provincia de residencia')).toBeInTheDocument();
    });
});
