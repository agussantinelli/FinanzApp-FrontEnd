import { render, screen } from '@testing-library/react';
import Footer from './Footer';
import { describe, it, expect } from 'vitest';

describe('Footer', () => {
    it('renders current year dynamically', () => {
        const year = new Date().getFullYear();
        render(<Footer />);
        expect(screen.getByText(new RegExp(year.toString()))).toBeInTheDocument();
    });

    it('displays the copyright notice and credits', () => {
        render(<Footer />);
        expect(screen.getByText(/FinanzApp — Todos los derechos reservados/i)).toBeInTheDocument();
        expect(screen.getByText(/©/)).toBeInTheDocument();
    });

    it('renders with footer semantic tag', () => {
        const { container } = render(<Footer />);
        expect(container.querySelector('footer')).toBeInTheDocument();
    });

    it('has correct footer className', () => {
        const { container } = render(<Footer />);
        expect(container.firstChild).toHaveClass(/footer/);
    });

    it('renders with body2 typography variant', () => {
        render(<Footer />);
        const text = screen.getByText(/FinanzApp/);
        expect(text.className).toContain('MuiTypography-body2');
    });
});
