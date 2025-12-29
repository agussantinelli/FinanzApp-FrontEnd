import { render, screen } from '@testing-library/react';
import MarketHoursCard from './MarketHoursCard';
import { describe, it, expect } from 'vitest';

describe('MarketHoursCard', () => {
    it('renders market hours info', () => {
        render(<MarketHoursCard />);
        expect(screen.getByText(/Horarios de mercado/)).toBeInTheDocument();
        expect(screen.getByText(/NYSE/)).toBeInTheDocument();
        expect(screen.getByText(/BYMA/)).toBeInTheDocument();
    });
});
