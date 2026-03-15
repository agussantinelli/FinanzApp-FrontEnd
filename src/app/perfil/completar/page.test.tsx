import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import CompleteProfilePage from './page';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { getPersonaById } from '@/services/PersonaService';
import { getRegisterGeoData, completeProfile, setAuthSession } from '@/services/AuthService';

// Mock next/navigation
vi.mock('next/navigation', () => ({
    useRouter: vi.fn(),
}));

// Mock hooks
vi.mock('@/hooks/useAuth', () => ({
    useAuth: vi.fn(),
}));

// Mock services
vi.mock('@/services/PersonaService', () => ({
    getPersonaById: vi.fn(),
}));

vi.mock('@/services/AuthService', () => ({
    getRegisterGeoData: vi.fn(),
    completeProfile: vi.fn(),
    setAuthSession: vi.fn(),
}));

// Mock components
vi.mock('@/components/ui/FloatingMessage', () => ({
    default: ({ open, message, severity }: any) => 
        open ? <div data-testid="floating-message" data-severity={severity}>{message}</div> : null,
}));

describe('CompleteProfilePage', () => {
    const mockRouter = {
        push: vi.fn(),
        back: vi.fn(),
    };

    const mockGeoData = {
        paises: [
            { id: 1, nombre: 'Argentina', esArgentina: true },
            { id: 2, nombre: 'Uruguay', esArgentina: false },
        ],
        provinciasArgentina: [
            { id: 10, nombre: 'Buenos Aires' },
        ],
        localidadesArgentina: [
            { id: 100, nombre: 'La Plata', provinciaId: 10 },
        ],
    };

    const mockPersona = {
        id: 'user-123',
        fechaNacimiento: '1990-01-01T00:00:00Z',
        nacionalidadId: 1,
        esResidenteArgentina: true,
        paisResidenciaId: 1,
        localidadResidenciaId: 100,
    };

    beforeEach(() => {
        vi.clearAllMocks();
        (useRouter as any).mockReturnValue(mockRouter);
        (useAuth as any).mockReturnValue({
            user: { id: 'user-123' },
            refreshUser: vi.fn(),
        });
        (getPersonaById as any).mockResolvedValue(mockPersona);
        (getRegisterGeoData as any).mockResolvedValue(mockGeoData);
    });

    it('renders loading state initially', () => {
        render(<CompleteProfilePage />);
        expect(screen.getByRole('progressbar')).toBeDefined();
    });

    it('renders form after loading data', async () => {
        render(<CompleteProfilePage />);
        
        await waitFor(() => {
            expect(screen.getByText('Completar Perfil')).toBeDefined();
            expect(screen.getByLabelText(/Fecha de Nacimiento/i)).toBeDefined();
            expect(screen.getByLabelText(/Resido en Argentina/i)).toBeDefined();
        });
    });

    it('handles switching residence outside Argentina', async () => {
        render(<CompleteProfilePage />);
        
        await waitFor(() => screen.getByLabelText(/Resido en Argentina/i));
        
        const switchControl = screen.getByLabelText(/Resido en Argentina/i);
        fireEvent.click(switchControl); // Switch to false

        await waitFor(() => {
            expect(screen.getByLabelText(/País de Residencia/i)).toBeDefined();
        });
    });

    it('submits form successfully', async () => {
        vi.useFakeTimers();
        (completeProfile as any).mockResolvedValue({ token: 'new-token' });
        
        render(<CompleteProfilePage />);
        
        await waitFor(() => screen.getByRole('button', { name: /Completar Perfil/i }));
        
        fireEvent.click(screen.getByRole('button', { name: /Completar Perfil/i }));

        await waitFor(() => {
            expect(completeProfile).toHaveBeenCalled();
            expect(setAuthSession).toHaveBeenCalledWith({ token: 'new-token' });
            expect(screen.getByTestId('floating-message')).toHaveAttribute('data-severity', 'success');
        });

        vi.runAllTimers();
        expect(mockRouter.push).toHaveBeenCalledWith('/perfil');
        vi.useRealTimers();
    });

    it('handles submission error', async () => {
        (completeProfile as any).mockRejectedValue({
            response: { data: { message: 'Submission failed' } }
        });
        
        render(<CompleteProfilePage />);
        
        await waitFor(() => screen.getByRole('button', { name: /Completar Perfil/i }));
        
        fireEvent.click(screen.getByRole('button', { name: /Completar Perfil/i }));

        await waitFor(() => {
            expect(screen.getByTestId('floating-message')).toHaveAttribute('data-severity', 'error');
            expect(screen.getByText('Submission failed')).toBeDefined();
        });
    });

    it('handles loading error', async () => {
        (getPersonaById as any).mockRejectedValue(new Error('Fetch failed'));
        
        render(<CompleteProfilePage />);
        
        await waitFor(() => {
            expect(screen.getByText('No se pudo cargar la información necesaria.')).toBeDefined();
        });
    });
});
