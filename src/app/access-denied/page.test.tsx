import { render, screen } from '@testing-library/react';
import AccessDeniedPage from './page';
import { describe, it, expect, vi } from 'vitest';

// Mock Link
vi.mock('next/link', () => ({
    default: ({ children }: any) => <a>{children}</a>,
}));

describe('AccessDeniedPage', () => {
    it('renders access denied message', () => {
        render(<AccessDeniedPage />);
        expect(screen.getByText('Acceso restringido')).toBeInTheDocument();
        expect(screen.getByText(/No tenés permisos/)).toBeInTheDocument();
    });

    it('renders back button', () => {
        render(<AccessDeniedPage />);
        expect(screen.getByText('Volver al inicio')).toBeInTheDocument();
    });
});
