import { render, screen } from '@testing-library/react';
import PortfolioCompositionChart from './PortfolioCompositionChart';
import { describe, it, expect, vi } from 'vitest';

vi.mock('react-chartjs-2', () => ({
    Doughnut: () => <div>DoughnutChart</div>
}));

describe('PortfolioCompositionChart', () => {
    const mockActivos = [
        { symbol: 'AAPL', porcentajeCartera: 50, valorizadoNativo: 1000, moneda: 'USD' }
    ];

    it('renders chart', () => {
        render(<PortfolioCompositionChart activos={mockActivos as any} currency='USD' totalDolares={100} totalPesos={1000} />);
        expect(screen.getByText('DoughnutChart')).toBeInTheDocument();
    });

    it('renders no data message', () => {
        render(<PortfolioCompositionChart activos={[]} currency='USD' />);
        expect(screen.getByText('Sin datos')).toBeInTheDocument();
    });
});
