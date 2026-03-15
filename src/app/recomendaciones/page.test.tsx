import { render, screen, fireEvent, waitFor } from '@/test/test-utils';
import RecomendacionesPage from './page';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useRecomendaciones } from '@/hooks/useRecomendaciones';
import { useAuth } from '@/hooks/useAuth';
import { getSectores } from '@/services/SectorService';
import { aprobarRecomendacion, rechazarRecomendacion } from '@/services/RecomendacionesService';

vi.mock('@/hooks/useRecomendaciones');
vi.mock('@/hooks/useAuth');
vi.mock('@/services/SectorService');
vi.mock('@/services/RecomendacionesService');

const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
    useRouter: () => ({ push: mockPush }),
}));

// Mock window.location
if (typeof window !== 'undefined') {
    Object.defineProperty(window, 'location', {
        value: { reload: vi.fn() },
        writable: true
    });
}

vi.mock('@/components/cards/RecomendacionCard', () => ({
    default: ({ item, onApprove, onReject, isAdmin }: any) => (
        <div data-testid="rec-card">
            <h3>{item.titulo}</h3>
            {isAdmin && (
                <>
                    <button onClick={onApprove}>Aprobar</button>
                    <button onClick={onReject}>Rechazar</button>
                </>
            )}
        </div>
    )
}));

vi.mock('@/components/ui/PageHeader', () => ({
    default: ({ title, children }: any) => <div><h1>{title}</h1>{children}</div>
}));

describe('RecomendacionesPage', () => {
    const mockApply = vi.fn();
    const mockClear = vi.fn();
    const mockRefresh = vi.fn();

    const mockData = [
        { id: '1', titulo: 'Rec 1', autorNombre: 'Expert A', autorId: 'a1' },
        { id: '2', titulo: 'Rec 2', autorNombre: 'Expert B', autorId: 'a2' }
    ];

    beforeEach(() => {
        vi.clearAllMocks();
        (useAuth as any).mockReturnValue({ user: { rol: 'Inversor' } });
        (useRecomendaciones as any).mockReturnValue({
            data: mockData,
            loading: false,
            error: null,
            filters: {},
            applyFilters: mockApply,
            clearFilters: mockClear,
            refresh: mockRefresh
        });
        (getSectores as any).mockResolvedValue([{ id: 's1', nombre: 'Tech' }]);
    });

    it('renders recommendations list', () => {
        render(<RecomendacionesPage />);
        expect(screen.getByText('Recomendaciones')).toBeInTheDocument();
        expect(screen.getByText('Rec 1')).toBeInTheDocument();
        expect(screen.getByText('Rec 2')).toBeInTheDocument();
    });

    it('shows "Realizar Recomendación" for Expertos', () => {
        (useAuth as any).mockReturnValue({ user: { rol: 'Experto' } });
        render(<RecomendacionesPage />);
        expect(screen.getByText('Realizar Recomendación')).toBeInTheDocument();
        
        fireEvent.click(screen.getByText('Realizar Recomendación'));
        expect(mockPush).toHaveBeenCalledWith('/recomendaciones/realizar');
    });

    it('handles filter application', () => {
        render(<RecomendacionesPage />);
        fireEvent.click(screen.getByText('Aplicar'));
        expect(mockApply).toHaveBeenCalled();
    });

    it('handles filter clearing', () => {
        render(<RecomendacionesPage />);
        fireEvent.click(screen.getByLabelText(/Limpiar filtros/i));
        expect(mockClear).toHaveBeenCalled();
    });

    it('handles Admin approval interaction', async () => {
        (useAuth as any).mockReturnValue({ user: { rol: 'Admin' } });
        render(<RecomendacionesPage />);
        
        const approveBtn = screen.getAllByText('Aprobar')[0];
        fireEvent.click(approveBtn);
        
        expect(aprobarRecomendacion).toHaveBeenCalledWith('1');
    });

    it('shows empty state message', async () => {
        (useRecomendaciones as any).mockReturnValue({
            data: [],
            loading: false,
            error: null,
            filters: {},
            applyFilters: mockApply,
            clearFilters: mockClear,
            refresh: mockRefresh
        });
        render(<RecomendacionesPage />);
        await waitFor(() => {
            expect(screen.getByText(/No hay recomendaciones encontradas/)).toBeInTheDocument();
        });
    });
});
