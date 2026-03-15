import { render, screen } from '@testing-library/react';
import { FormStatus } from './FormStatus';
import { describe, it, expect } from 'vitest';

describe('FormStatus', () => {
    it('renders nothing when no messages', () => {
        const { container } = render(<FormStatus />);
        expect(container).toBeEmptyDOMElement();
    });

    it('renders nothing if messages are empty strings', () => {
        const { container } = render(<FormStatus successMessage="" errorMessage="" />);
        expect(container).toBeEmptyDOMElement();
    });

    it('renders success message with correct severity', () => {
        render(<FormStatus successMessage="Success!" />);
        const alert = screen.getByRole('alert');
        expect(alert).toHaveTextContent('Success!');
        expect(alert.className).toContain('MuiAlert-filledSuccess');
    });

    it('renders error message with correct severity', () => {
        render(<FormStatus errorMessage="Error!" />);
        const alert = screen.getByRole('alert');
        expect(alert).toHaveTextContent('Error!');
        expect(alert.className).toContain('MuiAlert-filledError');
    });

    it('renders both messages simultaneously', () => {
        render(<FormStatus successMessage="Saved" errorMessage="Invalid" />);
        expect(screen.getByText('Saved')).toBeInTheDocument();
        expect(screen.getByText('Invalid')).toBeInTheDocument();
        expect(screen.getAllByRole('alert')).toHaveLength(2);
    });

    it('does not render success block if only error provided', () => {
        render(<FormStatus errorMessage="Only error" />);
        expect(screen.queryByText('Only error')).toBeInTheDocument();
        expect(screen.getAllByRole('alert')).toHaveLength(1);
    });
});
