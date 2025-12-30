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

    it('renders links', () => {
        render(<Noticias />);
        const links = screen.getAllByRole('link');
        expect(links.some(l => l.getAttribute('href')?.includes('coindesk.com'))).toBe(true);
    });
});
