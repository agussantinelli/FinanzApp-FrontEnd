import { render, screen, fireEvent, waitFor } from '@/test/test-utils';
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
    default: () => <div>AdminDistributionSection</div>
}));
vi.mock('next/link', () => ({
    default: ({ children }: any) => <a>{children}</a>,
}));

describe('Reportes Page', () => {
    beforeEach(() => {
        (usePortfolioData as any).mockReturnValue({
            valuacion: { activos: [{ id: 1 }] },
            loading: false
        });
    });

    it('renders reports content for logged in user', () => {
        (useAuth as any).mockReturnValue({ isAuthenticated: true, user: { rol: 'Inversor' } });
        render(<Reportes />);
        expect(screen.getByText('Reportes')).toBeInTheDocument();
        expect(screen.getByText('Tu Portafolio')).toBeInTheDocument();
        expect(screen.getByText('PortfolioCompositionChart')).toBeInTheDocument();
        expect(screen.getByText('DolarBarChart')).toBeInTheDocument();
    });

    it('renders admin reports for admin', () => {
        (useAuth as any).mockReturnValue({ isAuthenticated: true, user: { rol: 'Admin' } });
        render(<Reportes />);
        expect(screen.getByText('AdminDistributionSection')).toBeInTheDocument();
    });
});
