import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import RecomendacionesTab from './RecomendacionesTab';
import { useAdminRecommendations } from '@/hooks/useAdminRecommendations';
import { EstadoRecomendacion } from '@/types/Recomendacion';

// Mock hooks
vi.mock('@/hooks/useAdminRecommendations', () => ({
    useAdminRecommendations: vi.fn(),
}));

// Mock components
vi.mock('@/components/common/ConfirmDialog', () => ({
    ConfirmDialog: ({ open, onConfirm, onClose }: any) => 
        open ? (
            <div data-testid="confirm-dialog">
                <button onClick={onConfirm}>Confirm</button>
                <button onClick={onClose}>Cancel</button>
            </div>
        ) : null,
}));

vi.mock('@/components/ui/FloatingMessage', () => ({
    default: ({ open, message }: any) => open ? <div data-testid="floating-message">{message}</div> : null,
}));

// Mock styles
vi.mock('../styles/Admin.module.css', () => ({
    default: {
        tableContainer: 'tableContainer',
        tableHead: 'tableHead',
    },
}));

describe('RecomendacionesTab', () => {
    const mockRecommendations = [
        {
            id: 'rec-1',
            titulo: 'Buy AAPL',
            autorNombre: 'Expert A',
            estado: EstadoRecomendacion.Pendiente,
            esDestacada: false,
            fecha: '2023-01-01T12:00:00Z',
        },
        {
            id: 'rec-2',
            titulo: 'Sell BTC',
            autorNombre: 'Expert B',
            estado: EstadoRecomendacion.Aceptada,
            esDestacada: true,
            fecha: '2023-01-02T12:00:00Z',
        },
    ];

    const mockAdminRecommendations = {
        recommendations: mockRecommendations,
        loading: false,
        error: null,
        filter: '',
        setFilter: vi.fn(),
        toggleDestacar: vi.fn(),
        resolver: vi.fn(),
        aprobar: vi.fn(),
        rechazar: vi.fn(),
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders loading state', () => {
        (useAdminRecommendations as any).mockReturnValue({
            ...mockAdminRecommendations,
            loading: true,
        });

        render(<RecomendacionesTab />);
        expect(screen.getByRole('progressbar')).toBeDefined();
    });

    it('renders recommendations table correctly', () => {
        (useAdminRecommendations as any).mockReturnValue(mockAdminRecommendations);

        render(<RecomendacionesTab />);
        
        expect(screen.getByText('Buy AAPL')).toBeDefined();
        expect(screen.getByText('Expert A')).toBeDefined();
        expect(screen.getByText('Expert B')).toBeDefined();
        expect(screen.getByText('Sell BTC')).toBeDefined();
    });

    it('handles approve and reject for pending recommendations', () => {
        (useAdminRecommendations as any).mockReturnValue(mockAdminRecommendations);

        render(<RecomendacionesTab />);
        
        fireEvent.click(screen.getAllByTitle('Aprobar')[0]);
        expect(mockAdminRecommendations.aprobar).toHaveBeenCalledWith('rec-1');

        fireEvent.click(screen.getAllByTitle('Rechazar')[0]);
        expect(mockAdminRecommendations.rechazar).toHaveBeenCalledWith('rec-1');
    });

    it('handles resolve click for accepted recommendations', () => {
        (useAdminRecommendations as any).mockReturnValue(mockAdminRecommendations);

        render(<RecomendacionesTab />);
        
        fireEvent.click(screen.getByTitle('Marcar Acertada'));
        expect(screen.getByTestId('confirm-dialog')).toBeDefined();
        
        fireEvent.click(screen.getByText('Confirm'));
        expect(mockAdminRecommendations.resolver).toHaveBeenCalledWith('rec-2', true);
    });

    it('handles toggle destacado', () => {
        (useAdminRecommendations as any).mockReturnValue(mockAdminRecommendations);

        render(<RecomendacionesTab />);
        
        fireEvent.click(screen.getAllByRole('button', { name: '' }).find(b => b.querySelector('svg'))!);
        // This is a bit brittle, lets use a more specific way to find the button if possible
        // But toggleDestacar is called with id
        const starButtons = screen.getAllByRole('button').filter(b => b.querySelector('svg'));
        fireEvent.click(starButtons[0]);
        expect(mockAdminRecommendations.toggleDestacar).toHaveBeenCalledWith('rec-1');
    });
});
