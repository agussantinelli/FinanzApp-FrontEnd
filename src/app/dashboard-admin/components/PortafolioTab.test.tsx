import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import PortafolioTab from './PortafolioTab';
import { useAdminPortfolios } from '@/hooks/useAdminPortfolios';
import { useRouter } from 'next/navigation';

// Mock hooks
vi.mock('@/hooks/useAdminPortfolios', () => ({
    useAdminPortfolios: vi.fn(),
}));

// Mock next/navigation
vi.mock('next/navigation', () => ({
    useRouter: vi.fn(),
}));

// Mock components
vi.mock('@/components/common/CurrencyToggle', () => ({
    CurrencyToggle: () => <div data-testid="currency-toggle">Currency Toggle</div>,
}));

// Mock utils
vi.mock('@/utils/format', () => ({
    formatARS: (val: number) => `$ARS ${val}`,
    formatUSD: (val: number) => `$USD ${val}`,
}));

// Mock styles
vi.mock('../styles/Admin.module.css', () => ({
    default: {
        tableContainer: 'tableContainer',
        tableHead: 'tableHead',
        chip: 'chip',
    },
}));

describe('PortafolioTab', () => {
    const mockRouter = {
        push: vi.fn(),
    };

    const mockPortfolios = [
        {
            id: 'port-1',
            nombreUsuario: 'Test User',
            rolUsuario: 'Experto',
            nombre: 'Super Portfolio',
            descripcion: 'A great one',
            totalInvertidoUSD: 1000,
            totalValuadoUSD: 1200,
            variacionPorcentajeDolares: 20,
            esDestacado: false,
            esTop: false,
            esPrincipal: true,
        },
    ];

    const mockAdminPortfolios = {
        portfolios: mockPortfolios,
        loading: false,
        toggleDestacado: vi.fn(),
        toggleTop: vi.fn(),
        deletePortafolio: vi.fn(),
    };

    beforeEach(() => {
        vi.clearAllMocks();
        (useRouter as any).mockReturnValue(mockRouter);
    });

    it('renders loading state', () => {
        (useAdminPortfolios as any).mockReturnValue({
            ...mockAdminPortfolios,
            portfolios: [],
            loading: true,
        });

        render(<PortafolioTab />);
        expect(document.querySelector('.MuiSkeleton-root')).toBeDefined();
    });

    it('renders portfolios correctly', () => {
        (useAdminPortfolios as any).mockReturnValue(mockAdminPortfolios);

        render(<PortafolioTab />);
        
        expect(screen.getByText('Test User')).toBeDefined();
        expect(screen.getByText('Experto')).toBeDefined();
        expect(screen.getByText('Super Portfolio')).toBeDefined();
        expect(screen.getByText(/\+?20[.,]00%/)).toBeDefined();
        expect(screen.getByRole('cell', { name: /Principal/i })).toBeDefined();
    });

    it('handles toggle destacado', async () => {
        (useAdminPortfolios as any).mockReturnValue(mockAdminPortfolios);

        render(<PortafolioTab />);
        
        fireEvent.click(screen.getByTitle('Destacar'));
        expect(mockAdminPortfolios.toggleDestacado).toHaveBeenCalledWith('port-1', false);
    });

    it('handles toggle top with validation', async () => {
        (useAdminPortfolios as any).mockReturnValue(mockAdminPortfolios);

        render(<PortafolioTab />);
        
        fireEvent.click(screen.getByTitle('Marcar como Top'));
        // Should show error because it's not destacado
        await waitFor(() => {
            expect(screen.getByText(/Un portafolio debe ser Destacado para ser Top/i)).toBeDefined();
        });
        expect(mockAdminPortfolios.toggleTop).not.toHaveBeenCalled();
    });

    it('navigates to detail view', () => {
        (useAdminPortfolios as any).mockReturnValue(mockAdminPortfolios);

        render(<PortafolioTab />);
        
        const detailButton = screen.getByTitle(/Ver Detalle/i);
        fireEvent.click(detailButton);
        expect(mockRouter.push).toHaveBeenCalledWith('/dashboard-admin/portfolio/port-1');
    });

    it('calls deletePortafolio', () => {
        (useAdminPortfolios as any).mockReturnValue(mockAdminPortfolios);

        render(<PortafolioTab />);
        
        fireEvent.click(screen.getByTitle('Eliminar portafolio'));
        expect(mockAdminPortfolios.deletePortafolio).toHaveBeenCalledWith('port-1');
    });
});
