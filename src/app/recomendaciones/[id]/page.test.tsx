import { screen, waitFor, fireEvent } from '@testing-library/react';
import { render } from '@/test/test-utils';
import RecomendacionDetallePage from './page';
import { describe, it, expect, vi, beforeEach, beforeAll, afterAll } from 'vitest';
import { getRecomendacionById, aprobarRecomendacion, rechazarRecomendacion } from '@/services/RecomendacionesService';
import { useAuth } from '@/hooks/useAuth';
import { RolUsuario } from '@/types/Usuario';
import { EstadoRecomendacion } from '@/types/Recomendacion';

vi.mock('@/services/RecomendacionesService', () => ({
    getRecomendacionById: vi.fn(),
    getRecomendaciones: vi.fn(),
    getRecomendacionesActivasPendientes: vi.fn(),
    aprobarRecomendacion: vi.fn(),
    rechazarRecomendacion: vi.fn(),
}));
vi.mock('@/hooks/useAuth');
vi.mock('next/navigation', () => ({
    useParams: () => ({ id: '550e8400-e29b-41d4-a716-446655440000' }), // Use a UUID
    useRouter: () => ({ back: vi.fn(), push: vi.fn() }),
}));
vi.mock('@/components/auth/RoleGuard', () => ({
    RoleGuard: ({ children }: any) => <div>{children}</div>
}));

const originalLocation = window.location;
beforeAll(() => {
    // @ts-ignore
    delete (window as any).location;
    // @ts-ignore
    window.location = { ...originalLocation, reload: vi.fn() } as any;
});
afterAll(() => {
    // @ts-ignore
    window.location = originalLocation as any;
});
vi.mock('next/link', () => ({
    default: ({ children, href }: any) => <a href={href}>{children}</a>,
}));

describe('RecomendacionDetallePage', () => {
    const mockRec = {
        id: '123',
        titulo: 'Bullish Apple',
        fuente: 'Goldman Sachs',
        fechaInforme: '2024-01-01T00:00:00Z',
        justificacionLogica: 'Strong earnings expected',
        horizonte: 'LargoPlazo',
        riesgo: 2,
        persona: { nombre: 'John', apellido: 'Doe' },
        estado: EstadoRecomendacion.Pendiente,
        detalles: [
            {
                activo: { symbol: 'AAPL', nombre: 'Apple Inc' },
                accion: 1, // Comprar
                precioAlRecomendar: 150,
                precioObjetivo: 200,
                stopLoss: 140
            }
        ]
    };

    beforeEach(() => {
        vi.clearAllMocks();
        (useAuth as any).mockReturnValue({ user: { rol: 'Inversor' }, loading: false });
        (getRecomendacionById as any).mockResolvedValue(mockRec);
    });

    it('renders loading state', () => {
        (getRecomendacionById as any).mockReturnValue(new Promise(() => {}));
        render(<RecomendacionDetallePage />);
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('renders recommendation details correctly', async () => {
        render(<RecomendacionDetallePage />);
        
        await waitFor(() => expect(screen.getByText(/Bullish Apple/i)).toBeInTheDocument());
        expect(screen.getByText(/Goldman Sachs/i)).toBeInTheDocument();
        expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
        expect(screen.getByText(/Largo Plazo/i)).toBeInTheDocument();
        expect(screen.getByText(/Moderado/i)).toBeInTheDocument();
    });

    it('renders asset table with links', async () => {
        render(<RecomendacionDetallePage />);
        
        await waitFor(() => expect(screen.getByText('AAPL')).toBeInTheDocument());
        expect(screen.getByText(/Apple Inc/i)).toBeInTheDocument();
        expect(screen.getByText(/Comprar/i)).toBeInTheDocument();
        expect(screen.getByText(/\$200.00/)).toBeInTheDocument();
    });

    it('shows Admin actions for pending recommendations', async () => {
        (useAuth as any).mockReturnValue({ user: { rol: RolUsuario.Admin }, loading: false });
        render(<RecomendacionDetallePage />);
        
        const approveBtn = await screen.findByText(/Aprobar/i);
        expect(approveBtn).toBeInTheDocument();
        expect(screen.getByText(/Rechazar/i)).toBeInTheDocument();
        
        fireEvent.click(approveBtn);
        expect(aprobarRecomendacion).toHaveBeenCalledWith('123');
    });

    it('renders error state on failure', async () => {
        (getRecomendacionById as any).mockRejectedValue(new Error('NotFound'));
        render(<RecomendacionDetallePage />);
        
        await waitFor(() => expect(screen.getByText('No se pudo cargar la recomendación.')).toBeInTheDocument());
    });

    it('hides admin actions for non-admin', async () => {
        render(<RecomendacionDetallePage />);
        await waitFor(() => screen.getByText('Bullish Apple'));
        expect(screen.queryByText('Aprobar')).not.toBeInTheDocument();
    });
});
