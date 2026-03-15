import { render, screen } from '@testing-library/react';
import MarketHoursCard from './MarketHoursCard';
import { describe, it, expect } from 'vitest';

describe('MarketHoursCard', () => {
    it('renders header correctly', () => {
        render(<MarketHoursCard />);
        expect(screen.getByText(/Horarios de mercado/i)).toBeInTheDocument();
    });

    it('renders NYSE hours (11:30 to 18:00)', async () => {
        render(<MarketHoursCard />);
        expect(await screen.findByText('NYSE', { selector: 'strong' })).toBeInTheDocument();
        expect(screen.getByText(/11:30.*18:00/)).toBeInTheDocument();
    });
    it('renders BYMA hours (10:30 to 17:00)', async () => {
        render(<MarketHoursCard />);
        expect(await screen.findByText('BYMA', { selector: 'strong' })).toBeInTheDocument();
        expect(screen.getByText(/10:30.*17:00/)).toBeInTheDocument();
    });

    it('renders daylight saving note', () => {
        render(<MarketHoursCard />);
        expect(screen.getByText(/horario de verano/i)).toBeInTheDocument();
    });

    it('renders with AccessTime icon', () => {
        const { container } = render(<MarketHoursCard />);
        expect(container.querySelector('svg')).toBeInTheDocument();
    });
});
