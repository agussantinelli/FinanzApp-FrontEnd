import { render, screen } from '@testing-library/react';
import Movimientos from './page';
import { describe, it, expect } from 'vitest';

vi.mock('@/components/ui/PageHeader', () => ({
    default: ({ title }: any) => <h1>{title}</h1>
}));

describe('Movimientos Page', () => {
    it('renders placeholder content', () => {
        render(<Movimientos />);
        expect(screen.getByText('Movimientos')).toBeInTheDocument();
    });
});
