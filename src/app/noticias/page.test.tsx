import { render, screen } from '@testing-library/react';
import Noticias from './page';
import { describe, it, expect, vi } from 'vitest';

vi.mock('@/components/ui/PageHeader', () => ({
    default: ({ title, subtitle, description }: any) => (
        <div>
            <h1>{title}</h1>
            <h2>{subtitle}</h2>
            <p>{description}</p>
        </div>
    )
}));

describe('Noticias Page', () => {

    it('renders header correctly', () => {
        render(<Noticias />);
        expect(screen.getByText('Noticias')).toBeInTheDocument();
        expect(screen.getByText('Actualidad Financiera')).toBeInTheDocument();
    });

    it('renders all 3 news sources', () => {
        render(<Noticias />);
        expect(screen.getByText('CoinDesk / CoinMarketCap')).toBeInTheDocument();
        expect(screen.getByText('Bull Market – Claves del Día')).toBeInTheDocument();
        expect(screen.getByText('Ámbito Criptomonedas')).toBeInTheDocument();
    });

    it('renders icons for each source', () => {
        const { container } = render(<Noticias />);
        const icons = container.querySelectorAll('svg');
        expect(icons.length).toBeGreaterThanOrEqual(3);
    });

    it('renders notes for sources', () => {
        render(<Noticias />);
        expect(screen.getByText(/Cobertura cripto internacional/)).toBeInTheDocument();
        expect(screen.getByText(/Buen pulso del mercado argentino/)).toBeInTheDocument();
    });

    it('links have target="_blank"', () => {
        render(<Noticias />);
        const links = screen.getAllByRole('link');
        links.forEach(link => {
            expect(link).toHaveAttribute('target', '_blank');
            expect(link).toHaveAttribute('rel', 'noopener noreferrer');
        });
    });
});
