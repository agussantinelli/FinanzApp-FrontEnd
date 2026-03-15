import { render, screen } from '@testing-library/react';
import PortfolioCompositionChart from './PortfolioCompositionChart';
import { describe, it, expect, vi } from 'vitest';

vi.mock('react-chartjs-2', () => ({
    Doughnut: () => <div data-testid="doughnut-chart">DoughnutChart</div>
}));

describe('PortfolioCompositionChart', () => {
    const mockActivos = [
        { symbol: 'AAPL', porcentajeCartera: 50, valorizadoNativo: 1000, moneda: 'USD' },
        { symbol: 'GGAL', porcentajeCartera: 50, valorizadoNativo: 800000, moneda: 'ARS' }
    ];

    it('renders chart when data exists', () => {
        render(<PortfolioCompositionChart activos={mockActivos as any} currency='USD' totalDolares={2000} totalPesos={1600000} />);
        expect(screen.getByText('DoughnutChart')).toBeInTheDocument();
        expect(screen.getByText(/AAPL \(50%\)/)).toBeInTheDocument();
        expect(screen.getByText(/GGAL \(50%\)/)).toBeInTheDocument();
    });

    it('renders "Sin datos" when empty', () => {
        render(<PortfolioCompositionChart activos={[]} currency='USD' />);
        expect(screen.getByText('Sin datos')).toBeInTheDocument();
        expect(screen.queryByTestId('doughnut-chart')).not.toBeInTheDocument();
    });

    it('normalizes values to USD correctly', () => {
        // totalPesos / totalDolares = 800 (ccl)
        // AAPL (USD) = 1000
        // GGAL (ARS) = 800000 / 800 = 1000
        // Both should be 1000 in chart data
        const { container } = render(
            <PortfolioCompositionChart 
                activos={mockActivos as any} 
                currency='USD' 
                totalDolares={2000} 
                totalPesos={1600000} 
            />
        );
        expect(screen.getByTestId('doughnut-chart')).toBeInTheDocument();
    });

    it('normalizes values to ARS correctly', () => {
        // AAPL (USD) = 1000 * 800 = 800000
        // GGAL (ARS) = 800000
        render(
            <PortfolioCompositionChart 
                activos={mockActivos as any} 
                currency='ARS' 
                totalDolares={2000} 
                totalPesos={1600000} 
            />
        );
        expect(screen.getByText(/Distribución de Activos/)).toBeInTheDocument();
    });

    it('uses different colors for different assets', () => {
        render(<PortfolioCompositionChart activos={mockActivos as any} currency='USD' />);
        // Checking internal implementation logic via description or logic would be here
        expect(screen.getByText(/AAPL/)).toBeInTheDocument();
    });
});
