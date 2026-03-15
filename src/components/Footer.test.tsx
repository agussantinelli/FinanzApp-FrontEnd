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
});
