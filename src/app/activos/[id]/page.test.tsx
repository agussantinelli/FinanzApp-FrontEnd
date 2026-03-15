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
    default: ({ children, href }: any) => <a href={href}>{children}</a>,
}));

const mockPush = vi.fn();
const mockBack = vi.fn();
vi.mock('next/navigation', () => ({
    useParams: () => ({ id: 'AAPL' }),
    useRouter: () => ({ back: mockBack, push: mockPush }),
}));

vi.mock('@/components/operaciones/AssetOperationsHistory', () => ({
    default: () => <div data-testid="ops-history">AssetOperationsHistory</div>
}));

vi.mock('@/components/ui/FloatingMessage', () => ({
    default: ({ message, open }: any) => open ? <div data-testid="floating-msg">{message}</div> : null
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
        vi.clearAllMocks();
        (useActivoDetail as any).mockReturnValue({
            activo: defaultActivo,
            activeRecommendations: [],
            loading: false,
            updateActivoState: mockUpdateActivoState
        });
        (useAuth as any).mockReturnValue({ isAuthenticated: true });
        (usePortfolioData as any).mockReturnValue({ valuacion: { activos: [] } });
        (getCurrentUser as any).mockReturnValue({ id: 'u1', rol: 'Inversor' });
    });

    it('renders loading state', () => {
        (useActivoDetail as any).mockReturnValue({ loading: true });
        render(<ActivoDetalle />);
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('renders asset info correctly', () => {
        render(<ActivoDetalle />);
        expect(screen.getByText('AAPL')).toBeInTheDocument();
        expect(screen.getByText('Apple Inc')).toBeInTheDocument();
        expect(screen.getByText('CEDEAR')).toBeInTheDocument();
    });

    it('handles follow toggle', async () => {
        render(<ActivoDetalle />);
        const followBtn = screen.getByTestId('StarBorderIcon').closest('button')!;
        fireEvent.click(followBtn);

        expect(mockUpdateActivoState).toHaveBeenCalled();
        expect(toggleSeguirActivo).toHaveBeenCalledWith(1);
    });

    it('navigates back', () => {
        render(<ActivoDetalle />);
        const backBtn = screen.getByText('Volver');
        fireEvent.click(backBtn);
        expect(mockBack).toHaveBeenCalled();
    });

    it('validates sell operation when user has no asset', () => {
        render(<ActivoDetalle />);
        const sellButton = screen.getByText('Vender');
        fireEvent.click(sellButton);

        expect(screen.getByTestId('floating-msg')).toHaveTextContent('No tienes AAPL para vender.');
    });

    it('navigates to buy form', () => {
        render(<ActivoDetalle />);
        const buyButton = screen.getByText('Comprar AAPL');
        fireEvent.click(buyButton);

        expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('/registrar-operacion?activoId=1&tipo=COMPRA'));
    });

    it('renders special view for Riesgo Pais', () => {
        (useActivoDetail as any).mockReturnValue({
            activo: { ...defaultActivo, symbol: 'EMBI_AR', precioActual: 1200 },
            loading: false
        });
        render(<ActivoDetalle />);
        expect(screen.getByText(/1200 pbs/)).toBeInTheDocument();
        expect(screen.queryByText('Operar')).not.toBeInTheDocument();
    });
});
