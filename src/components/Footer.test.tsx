import { render, screen } from '@testing-library/react';
import Footer from './Footer';
import { describe, it, expect } from 'vitest';

describe('Footer', () => {
    it('renders current year and text', () => {
        render(<Footer />);
        const currentYear = new Date().getFullYear();
        expect(screen.getByText(new RegExp(currentYear.toString()))).toBeInTheDocument();
        expect(screen.getByText(/FinanzApp — Todos los derechos reservados/)).toBeInTheDocument();
    });
});
