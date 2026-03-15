import { render, screen, fireEvent } from '@/test/test-utils';
import Reportes from './page';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAuth } from '@/hooks/useAuth';
import { usePortfolioData } from '@/hooks/usePortfolioData';

vi.mock('@/hooks/useAuth');
vi.mock('@/hooks/usePortfolioData');
vi.mock('@/components/charts/DolarBarChart', () => ({
    default: () => <div>DolarBarChart</div>
}));
vi.mock('@/components/portfolio/PortfolioCompositionChart', () => ({
    default: () => <div>PortfolioCompositionChart</div>
}));
vi.mock('@/components/ui/PageHeader', () => ({
    default: ({ title }: any) => <h1>{title}</h1>
}));
vi.mock('./components/AdminDistributionSection', () => ({
    default: () => <div data-testid="admin-section">AdminDistributionSection</div>
}));
vi.mock('next/link', () => ({
    default: ({ children, href }: any) => <a href={href}>{children}</a>,
}));

const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
    useRouter: () => ({ push: mockPush }),
}));

describe('Reportes Page', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders basic structure (Header and DolarChart)', () => {
        (useAuth as any).mockReturnValue({ isAuthenticated: false });
        (usePortfolioData as any).mockReturnValue({ loading: false });
        
        render(<Reportes />);
        expect(screen.getByText('Reportes')).toBeInTheDocument();
        expect(screen.getByText('DolarBarChart')).toBeInTheDocument();
        expect(screen.queryByText('Tu Portafolio')).not.toBeInTheDocument();
    });

    it('shows empty portfolio message for authenticated user', () => {
        (useAuth as any).mockReturnValue({ isAuthenticated: true, user: { rol: 'Inversor' } });
        (usePortfolioData as any).mockReturnValue({ valuacion: { activos: [] }, loading: false });

        render(<Reportes />);
        expect(screen.getByText('Tu Portafolio')).toBeInTheDocument();
        expect(screen.getByText('Tu portafolio está vacío.')).toBeInTheDocument();
    });

    it('renders portfolio composition chart when data exists', () => {
        (useAuth as any).mockReturnValue({ isAuthenticated: true, user: { rol: 'Inversor' } });
        (usePortfolioData as any).mockReturnValue({ 
            valuacion: { activos: [{ symbol: 'AAPL' }] }, 
            loading: false 
        });

        render(<Reportes />);
        expect(screen.getByText('PortfolioCompositionChart')).toBeInTheDocument();
    });

    it('navigates to portfolio on chart click', () => {
        (useAuth as any).mockReturnValue({ isAuthenticated: true, user: { rol: 'Inversor' } });
        (usePortfolioData as any).mockReturnValue({ 
            valuacion: { activos: [{ symbol: 'AAPL' }] }, 
            loading: false 
        });

        render(<Reportes />);
        fireEvent.click(screen.getByText('PortfolioCompositionChart').parentElement!);
        expect(mockPush).toHaveBeenCalledWith('/portfolio');
    });

    it('renders Admin section only for Admin role', () => {
        (useAuth as any).mockReturnValue({ isAuthenticated: true, user: { rol: 'Admin' } });
        (usePortfolioData as any).mockReturnValue({ loading: false });

        render(<Reportes />);
        expect(screen.getByTestId('admin-section')).toBeInTheDocument();
    });

    it('shows pending plans for regular user', () => {
        (useAuth as any).mockReturnValue({ isAuthenticated: true, user: { rol: 'Inversor' } });
        (usePortfolioData as any).mockReturnValue({ loading: false });

        render(<Reportes />);
        expect(screen.getByText('Planes Futuros')).toBeInTheDocument();
        expect(screen.queryByTestId('admin-section')).not.toBeInTheDocument();
    });
});
