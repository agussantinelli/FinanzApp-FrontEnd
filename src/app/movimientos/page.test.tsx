import { render, screen } from '@testing-library/react';
import Movimientos from './page';
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

describe('Movimientos Page', () => {
    it('renders header title', () => {
        render(<Movimientos />);
        expect(screen.getByText('Movimientos')).toBeInTheDocument();
    });

    it('renders header subtitle', () => {
        render(<Movimientos />);
        expect(screen.getByText('Historial de Transacciones')).toBeInTheDocument();
    });

    it('renders proximamente message', () => {
        render(<Movimientos />);
        expect(screen.getByText(/Próximamente: Historial detallado/)).toBeInTheDocument();
    });

    it('renders within main container', () => {
        const { container } = render(<Movimientos />);
        expect(container.querySelector('main')).toBeInTheDocument();
    });

    it('has the correct page header structure', () => {
        render(<Movimientos />);
        expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Movimientos');
    });
});
