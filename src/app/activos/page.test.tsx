import { render, screen, fireEvent, waitFor } from '@/test/test-utils';
import Activos from './page';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useActivosFilters } from '@/hooks/useActivosFilters';
import { toggleSeguirActivo } from '@/services/ActivosService';

vi.mock('@/hooks/useActivosFilters');
vi.mock('@/services/ActivosService');
vi.mock('next/link', () => ({
    default: ({ children }: any) => <a>{children}</a>,
}));
vi.mock('next/navigation', () => ({
    useRouter: () => ({ push: vi.fn() }),
}));
vi.mock('@/components/ui/NeonLoader', () => ({
    default: () => <div>Loading...</div>
}));
vi.mock('@/components/ui/PageHeader', () => ({
    default: ({ title }: any) => <h1>{title}</h1>
}));


describe('Activos Page', () => {
    const mockUpdateAssetInList = vi.fn();
    const mockSetOnlyFavorites = vi.fn();

    const defaultHookValues = {
        selectedType: 'Todos',
        selectedSector: 'Todos',
        selectedCurrency: 'Todos',
        activos: [],
        tipos: [{ id: 1, nombre: 'Accion' }],
        sectores: [{ id: 1, nombre: 'Tech' }],
        loading: false,
        searchTerm: '',
        suggestions: [],
        orderBy: 'symbol',
        orderDesc: false,
        page: 1,
        totalPages: 1,
        paginatedActivos: [
            { id: 1, symbol: 'AAPL', nombre: 'Apple', precioActual: 150, variacion24h: 1.2, loSigo: false, tipo: 'Accion' },
            { id: 2, symbol: 'TSLA', nombre: 'Tesla', precioActual: 200, variacion24h: -0.5, loSigo: true, tipo: 'Accion' }
        ],
        setSearchTerm: vi.fn(),
        handleRequestSort: vi.fn(),
        handleTypeChange: vi.fn(),
        handleSectorChange: vi.fn(),
        handleCurrencyChange: vi.fn(),
        handlePageChange: vi.fn(),
        handleRefresh: vi.fn(),
        executeSearch: vi.fn(),
        resetFilters: vi.fn(),
        updateAssetInList: mockUpdateAssetInList,
        onlyFavorites: false,
        setOnlyFavorites: mockSetOnlyFavorites
    };

    beforeEach(() => {
        (useActivosFilters as any).mockReturnValue(defaultHookValues);
        // Mock session storage
        Object.defineProperty(window, 'sessionStorage', {
            value: { getItem: vi.fn(() => 'token') }
        });
    });

    it('renders assets list', () => {
        render(<Activos />);
        expect(screen.getByText('AAPL')).toBeInTheDocument();
        expect(screen.getByText('TSLA')).toBeInTheDocument();
        expect(screen.getByText('Mercado Financiero')).toBeInTheDocument();
    });

    it('handles favorite toggle', async () => {
        render(<Activos />);
        // First asset is AAPL, not followed. StarBorderIcon.
        // Second is TSLA, followed. StarIcon.

        // Find all checkboxes in table rows that contain the star icon button
        const starButtons = screen.getAllByRole('button').filter(b => b.querySelector('svg'));

        // Click the first one (AAPL)
        fireEvent.click(starButtons[0]);

        expect(mockUpdateAssetInList).toHaveBeenCalled();
        expect(toggleSeguirActivo).toHaveBeenCalledWith(1);
    });

    it('shows login warning when switching to favorites if not logged in', () => {
        Object.defineProperty(window, 'sessionStorage', {
            value: { getItem: vi.fn(() => null) }
        });

        render(<Activos />);
        const favoritesTab = screen.getByRole('button', { name: 'favoritos' });
        fireEvent.click(favoritesTab);

        expect(screen.getByText('Debes iniciar sesión para ver tus favoritos.')).toBeInTheDocument();
    });

    it('renders loading state', () => {
        (useActivosFilters as any).mockReturnValue({ ...defaultHookValues, loading: true });
        render(<Activos />);
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('renders empty state correctly', () => {
        (useActivosFilters as any).mockReturnValue({
            ...defaultHookValues,
            paginatedActivos: [],
            searchTerm: 'XYZ'
        });
        render(<Activos />);
        expect(screen.getByText('No se encontraron activos')).toBeInTheDocument();
        expect(screen.getByText('"XYZ"')).toBeInTheDocument();
    });
});
