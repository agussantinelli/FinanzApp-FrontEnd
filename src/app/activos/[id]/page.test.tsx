import { render, screen, fireEvent, waitFor } from '@/test/test-utils';
import ActivoDetalle from './page';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useActivoDetail } from '@/hooks/useActivoDetail';
import { useAuth } from '@/hooks/useAuth';
import { usePortfolioData } from '@/hooks/usePortfolioData';
import { getCurrentUser } from '@/services/AuthService';
import { toggleSeguirActivo } from '@/services/ActivosService';

// Mock mocks
vi.mock('@/hooks/useActivoDetail');
vi.mock('@/hooks/useAuth');
vi.mock('@/hooks/usePortfolioData');
vi.mock('@/services/AuthService');
vi.mock('@/services/ActivosService');

// Mock components
vi.mock('next/link', () => ({
    default: ({ children }: any) => <a>{children}</a>,
}));
vi.mock('next/navigation', () => ({
    useParams: () => ({ id: 'AAPL' }),
    useRouter: () => ({ back: vi.fn(), push: vi.fn() }),
}));
vi.mock('@/components/operaciones/AssetOperationsHistory', () => ({
    default: () => <div>AssetOperationsHistory</div>
}));
vi.mock('@/components/ui/FloatingMessage', () => ({
    default: ({ message }: any) => message ? <div>{message}</div> : null
}));


describe('ActivoDetalle Page', () => {
    const mockUpdateActivoState = vi.fn();
    const defaultActivo = {
        id: 1,
        symbol: 'AAPL',
        nombre: 'Apple Inc',
        tipo: 'CEDEAR',
        precioActual: 150,
        variacion24h: 1.5,
        loSigo: false,
        esLocal: false,
        monedaBase: 'USD',
        ultimaActualizacion: new Date().toISOString()
    };

    beforeEach(() => {
        (useActivoDetail as any).mockReturnValue({
            activo: defaultActivo,
            activeRecommendations: [],
            loading: false,
            updateActivoState: mockUpdateActivoState
        });
        (useAuth as any).mockReturnValue({ isAuthenticated: true });
        (usePortfolioData as any).mockReturnValue({ valuacion: { activos: [] } });
        (getCurrentUser as any).mockReturnValue({ id: 1, rol: 'Inversor' });
    });

    it('renders loading state', () => {
        (useActivoDetail as any).mockReturnValue({ loading: true });
        render(<ActivoDetalle />);
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('renders error state when asset not found', () => {
        (useActivoDetail as any).mockReturnValue({ loading: false, activo: null });
        render(<ActivoDetalle />);
        expect(screen.getByText('Activo no encontrado')).toBeInTheDocument();
    });

    it('renders asset details correctly', () => {
        render(<ActivoDetalle />);
        expect(screen.getByText('AAPL')).toBeInTheDocument();
        expect(screen.getByText('Apple Inc')).toBeInTheDocument();
        expect(screen.getByText('$ 150.00')).toBeInTheDocument();
    });

    it('handles toggle follow', async () => {
        render(<ActivoDetalle />);
        const starButton = screen.getAllByRole('button')[1]; // Back button is first
        fireEvent.click(starButton);

        expect(mockUpdateActivoState).toHaveBeenCalled();
        expect(toggleSeguirActivo).toHaveBeenCalledWith(1);
    });

    it('handles buy operation navigation', () => {
        const mockPush = vi.fn();
        (vi.mocked(require('next/navigation').useRouter) as any).mockReturnValue({ push: mockPush, back: vi.fn() });

        render(<ActivoDetalle />);
        const buyButton = screen.getByText('Comprar AAPL');
        fireEvent.click(buyButton);

        expect(mockPush).toHaveBeenCalledWith('/registrar-operacion?activoId=1&tipo=COMPRA');
    });

    it('validates sell operation when user has no asset', () => {
        render(<ActivoDetalle />);
        const sellButton = screen.getByText('Vender');
        fireEvent.click(sellButton);

        expect(screen.getByText('No tienes AAPL para vender.')).toBeInTheDocument();
    });
});
