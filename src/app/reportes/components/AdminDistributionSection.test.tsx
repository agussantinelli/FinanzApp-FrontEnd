import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AdminDistributionSection from './AdminDistributionSection';
import { useAdminUsers } from '@/hooks/useAdminUsers';

// Mock hooks
vi.mock('@/hooks/useAdminUsers', () => ({
    useAdminUsers: vi.fn(),
}));

// Mock components
vi.mock('@/components/charts/UserDistributionChart', () => ({
    default: ({ users }: any) => <div data-testid="user-distribution-chart">Chart with {users.length} users</div>,
}));

// Mock styles
vi.mock('../styles/Reportes.module.css', () => ({
    default: {
        gradientCard: 'gradientCard',
    },
}));

describe('AdminDistributionSection', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders skeleton when loading', () => {
        (useAdminUsers as any).mockReturnValue({
            users: [],
            loading: true,
        });

        render(<AdminDistributionSection />);
        expect(screen.getByText('Distribución de Usuarios')).toBeDefined();
        expect(document.querySelector('.MuiSkeleton-root')).toBeDefined();
    });

    it('renders chart when data is loaded', () => {
        (useAdminUsers as any).mockReturnValue({
            users: [{ id: 1 }, { id: 2 }],
            loading: false,
        });

        render(<AdminDistributionSection />);
        expect(screen.getByText(/Distribución de Usuarios \(Admin\)/i)).toBeDefined();
        expect(screen.getByTestId('user-distribution-chart')).toBeDefined();
        expect(screen.getByText('Chart with 2 users')).toBeDefined();
    });
});
