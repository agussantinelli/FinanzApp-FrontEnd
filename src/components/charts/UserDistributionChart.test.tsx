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


});
