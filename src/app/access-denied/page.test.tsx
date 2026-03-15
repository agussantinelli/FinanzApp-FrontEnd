import { render, screen } from '@testing-library/react';
import AccessDeniedPage from './page';
import { describe, it, expect, vi } from 'vitest';

// Mock Link
vi.mock('next/link', () => ({
    default: ({ children, href }: any) => <a href={href}>{children}</a>,
}));

describe('AccessDeniedPage', () => {
    it('renders access denied message', () => {
        render(<AccessDeniedPage />);
        expect(screen.getByText('Acceso restringido')).toBeInTheDocument();
        expect(screen.getByText(/No tenés permisos para ver esta sección/)).toBeInTheDocument();
    });

    it('renders back button with correct label', () => {
        render(<AccessDeniedPage />);
        expect(screen.getByText('Volver al inicio')).toBeInTheDocument();
    });

    it('button has correct href to home', () => {
        render(<AccessDeniedPage />);
        const link = screen.getByRole('link');
        expect(link).toHaveAttribute('href', '/');
    });

    it('renders within container with correct class', () => {
        const { container } = render(<AccessDeniedPage />);
        expect(container.firstChild).toHaveClass(/container/);
    });

    it('displays secondary instructions message', () => {
        render(<AccessDeniedPage />);
        expect(screen.getByText(/sección de FinanzApp/)).toBeInTheDocument();
    });
});
