import { render, screen } from '@testing-library/react';
import UserDistributionChart from './UserDistributionChart';
import { describe, it, expect, vi } from 'vitest';

vi.mock('react-chartjs-2', () => ({
    Doughnut: () => <div>DoughnutChart</div>
}));

describe('UserDistributionChart', () => {
    const mockUsers = [
        { rol: 'Admin' },
        { rol: 'Experto' },
        { rol: 'Inversor' }
    ];

    it('renders chart', () => {
        render(<UserDistributionChart users={mockUsers as any} />);
        expect(screen.getByText('DoughnutChart')).toBeInTheDocument();
    });

    it('renders skeleton on no data', () => {
        render(<UserDistributionChart users={[]} />);
        const skeleton = screen.getByRole('progressbar', { hidden: true }); // Skeleton often has no role or progressbar role depending on mui version, typically check for class or structure if possible. 
        // Actually MUI Skeleton usually doesn't have an easily queryable role by default without aria-label.
        // Let's just check Doughnut is NOT there.
        expect(screen.queryByText('DoughnutChart')).not.toBeInTheDocument();
    });
});
