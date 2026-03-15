import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import ActivoDetalle from './page';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useActivoDetail } from '@/hooks/useActivoDetail';
import { useAuth } from '@/hooks/useAuth';
import { toggleSeguirActivo } from '@/services/ActivosService';

vi.mock('@/hooks/useActivoDetail');
vi.mock('@/hooks/useAuth');
vi.mock('@/services/ActivosService');
vi.mock('next/navigation', () => ({
    useParams: () => ({ id: 'AAPL' }),
    useRouter: () => ({ back: vi.fn(), push: vi.fn() }),
}));
vi.mock('@/components/operaciones/AssetOperationsHistory', () => ({
    default: () => <div data-testid="ops-history">History</div>
}));

describe('ActivoDetalle Page', () => {
    const mockActivo = {
        id: 'AAPL',
        symbol: 'AAPL',
        nombre: 'Apple Inc',
        tipo: 'Acción',
        ultimoPrecio: 180,
        moneda: 'USD',
        seguido: false
    };

    beforeEach(() => {
        vi.clearAllMocks();
        (useAuth as any).mockReturnValue({ user: { rol: 'Inversor' } });
        (useActivoDetail as any).mockReturnValue({ activo: mockActivo, activeRecommendations: [], loading: false, updateActivoState: vi.fn() });
    });

    it('renders loading state', () => {
        (useActivoDetail as any).mockReturnValue({ activo: null, activeRecommendations: [], loading: true });
        render(<ActivoDetalle />);
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('renders asset data correctly', async () => {
        render(<ActivoDetalle />);
        await waitFor(() => {
            expect(screen.getByText('AAPL')).toBeInTheDocument();
            expect(screen.getByText('Apple Inc')).toBeInTheDocument();
        });
    });

    it('handles follow toggle', async () => {
        (toggleSeguirActivo as any).mockResolvedValue({ seguido: true });
        render(<ActivoDetalle />);
        
        const btn = await screen.findByLabelText(/seguir/i);
        await act(async () => {
            fireEvent.click(btn);
        });
        expect(toggleSeguirActivo).toHaveBeenCalledWith('AAPL');
    });

    it('navigates back', async () => {
        const { useRouter } = await import('next/navigation');
        const mockBack = useRouter().back;
        render(<ActivoDetalle />);
        
        const btn = screen.getByLabelText('Volver');
        fireEvent.click(btn);
        expect(mockBack).toHaveBeenCalled();
    });

    it('navigates to buy form', async () => {
        const { useRouter } = await import('next/navigation');
        const mockPush = useRouter().push;
        render(<ActivoDetalle />);
        
        const btn = screen.getByText(/Comprar/i);
        fireEvent.click(btn);
        expect(mockPush).toHaveBeenCalledWith(expect.stringMatching(/registrar-operacion.*AAPL.*COMPRA/i));
    });

    it('renders risk card for EMBI_AR', async () => {
        (useActivoDetail as any).mockReturnValue({ 
            activo: { ...mockActivo, symbol: 'EMBI_AR', nombre: 'Riesgo Pais' }, 
            activeRecommendations: [],
            loading: false ,
            updateActivoState: vi.fn()
        });
        render(<ActivoDetalle />);
        await waitFor(() => expect(screen.getByText(/pbs/i)).toBeInTheDocument());
    });
});
