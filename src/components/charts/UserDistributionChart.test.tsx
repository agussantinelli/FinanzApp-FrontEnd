import { render, screen } from '@testing-library/react';
import UserDistributionChart from './UserDistributionChart';
import { describe, it, expect, vi } from 'vitest';

vi.mock('react-chartjs-2', () => ({
    Doughnut: ({ data }: any) => <div data-testid="doughnut-chart" data-values={JSON.stringify(data.datasets[0].data)}>DoughnutChart</div>
}));

describe('UserDistributionChart', () => {
    const mockUsers = [
        { rol: 'Admin' },
        { rol: 'Administrador' },
        { rol: 'Experto' },
        { rol: 'Inversor' },
        { rol: 'User' } // should be counted as Inversor
    ];

    it('renders skeleton when no users', () => {
        const { container } = render(<UserDistributionChart users={[]} />);
        expect(container.querySelector('.MuiSkeleton-root')).toBeInTheDocument();
    });

    it('correctly groups roles for chart data', () => {
        render(<UserDistributionChart users={mockUsers as any} />);
        const chart = screen.getByTestId('doughnut-chart');
        const values = JSON.parse(chart.getAttribute('data-values')!);
        
        // Expected: 2 Admins, 1 Experto, 2 Inversores
        expect(values).toEqual([2, 1, 2]);
    });

    it('handles null/undefined users gracefully', () => {
        const { container } = render(<UserDistributionChart users={null as any} />);
        expect(container.querySelector('.MuiSkeleton-root')).toBeInTheDocument();
    });

    it('renders doughnut chart when data is present', () => {
        render(<UserDistributionChart users={mockUsers as any} />);
        expect(screen.getByTestId('doughnut-chart')).toBeInTheDocument();
    });

    it('case-insensitive role matching', () => {
        const mixedUsers = [{ rol: 'admin' }, { rol: 'EXPERTO' }, { rol: 'inversor' }];
        render(<UserDistributionChart users={mixedUsers as any} />);
        const chart = screen.getByTestId('doughnut-chart');
        const values = JSON.parse(chart.getAttribute('data-values')!);
        expect(values).toEqual([1, 1, 1]);
    });
});
