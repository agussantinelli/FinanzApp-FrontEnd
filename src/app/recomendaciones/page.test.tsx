import { render, screen, fireEvent, waitFor } from '@/test/test-utils';
import RecomendacionesPage from './page';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useRecomendaciones } from '@/hooks/useRecomendaciones';
import { useAuth } from '@/hooks/useAuth';
import { getSectores } from '@/services/SectorService';

vi.mock('@/hooks/useRecomendaciones');
vi.mock('@/hooks/useAuth');
vi.mock('@/services/SectorService');
vi.mock('next/navigation', () => ({
    useRouter: () => ({ push: vi.fn() }),
}));
vi.mock('@/components/cards/RecomendacionCard', () => ({
    default: ({ item }: any) => <div>{item.titulo}</div>
}));
vi.mock('@/components/ui/PageHeader', () => ({
    default: ({ title, children }: any) => <div><h1>{title}</h1>{children}</div>
}));

describe('RecomendacionesPage', () => {
    const mockApplyFilters = vi.fn();
    const mockClearFilters = vi.fn();
    const defaultData = [
        { id: '1', titulo: 'Rec 1', autorNombre: 'Expert 1', sectorId: 1, riesgo: 1, horizonte: 1 }
    ];

    beforeEach(() => {
        (useRecomendaciones as any).mockReturnValue({
            data: defaultData,
            loading: false,
            error: null,
            filters: {},
            applyFilters: mockApplyFilters,
            clearFilters: mockClearFilters,
            refresh: vi.fn()
        });
        (useAuth as any).mockReturnValue({ user: { rol: 'Inversor' } });
        (getSectores as any).mockResolvedValue([{ id: 1, nombre: 'Tech' }]);
    });

    it('renders recommendations list', () => {
        render(<RecomendacionesPage />);
        expect(screen.getByText('Rec 1')).toBeInTheDocument();
    });

    it('renders filters', async () => {
        render(<RecomendacionesPage />);
        // Wait for sectors to load
        await waitFor(() => expect(getSectores).toHaveBeenCalled());
        expect(screen.getByLabelText('Sector')).toBeInTheDocument();
        expect(screen.getByLabelText('Riesgo')).toBeInTheDocument();
    });

    it('applies filters', () => {
        render(<RecomendacionesPage />);
        const applyBtn = screen.getByText('Aplicar');
        fireEvent.click(applyBtn);
        expect(mockApplyFilters).toHaveBeenCalled();
    });

    it('shows admin filters if user is admin', () => {
        (useAuth as any).mockReturnValue({ user: { rol: 'Admin' } });
        render(<RecomendacionesPage />);
        expect(screen.getByLabelText('Estado')).toBeInTheDocument();
    });
});
