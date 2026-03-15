import { screen, waitFor, fireEvent } from '@testing-library/react';
import { render } from '@/test/test-utils';
import RecomendacionDetallePage from './page';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getRecomendacionById, aprobarRecomendacion, rechazarRecomendacion } from '@/services/RecomendacionesService';
import { useAuth } from '@/hooks/useAuth';

vi.mock('@/services/RecomendacionesService');
vi.mock('@/hooks/useAuth');
vi.mock('next/navigation', () => ({
    useParams: () => ({ id: 'rec-123' }),
    useRouter: () => ({ back: vi.fn(), push: vi.fn() }),
}));
vi.mock('@/components/auth/RoleGuard', () => ({
    RoleGuard: ({ children }: any) => <div>{children}</div>
}));
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
        estado: 1, // Pendiente
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
        
        await waitFor(() => expect(screen.getByText('Bullish Apple')).toBeInTheDocument());
        expect(screen.getByText('Goldman Sachs')).toBeInTheDocument();
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('Largo Plazo')).toBeInTheDocument();
        expect(screen.getByText('Moderado')).toBeInTheDocument();
    });

    it('renders asset table with links', async () => {
        render(<RecomendacionDetallePage />);
        
        await waitFor(() => expect(screen.getByText('AAPL')).toBeInTheDocument());
        expect(screen.getByText('Apple Inc')).toBeInTheDocument();
        expect(screen.getByText('Comprar')).toBeInTheDocument();
        expect(screen.getByText('$200.00')).toBeInTheDocument();
    });

    it('shows Admin actions for pending recommendations', async () => {
        (useAuth as any).mockReturnValue({ user: { rol: 'Admin' }, loading: false });
        render(<RecomendacionDetallePage />);
        
        await waitFor(() => expect(screen.getByText('Aprobar')).toBeInTheDocument());
        expect(screen.getByText('Rechazar')).toBeInTheDocument();
        
        fireEvent.click(screen.getByText('Aprobar'));
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
