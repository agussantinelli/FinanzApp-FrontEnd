import { render, screen } from '@testing-library/react';
import Noticias from './page';
import { describe, it, expect, vi } from 'vitest';

vi.mock('@/components/ui/PageHeader', () => ({
    default: ({ title, subtitle }: any) => (
        <div>
            <h1>{title}</h1>
            <h2>{subtitle}</h2>
        </div>
    )
}));

describe('Noticias Page', () => {
    it('renders news sources', () => {
        render(<Noticias />);
        expect(screen.getByText('Noticias')).toBeInTheDocument();

        expect(screen.getByText('CoinDesk / CoinMarketCap')).toBeInTheDocument();
        expect(screen.getByText('Bull Market – Claves del Día')).toBeInTheDocument();
        expect(screen.getByText('Ámbito – Criptomonedas')).toBeInTheDocument();
    });

    it('renders links', () => {
        render(<Noticias />);
        const links = screen.getAllByRole('link');
        expect(links.some(l => l.getAttribute('href')?.includes('coindesk.com'))).toBe(true);
    });
});
