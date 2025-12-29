import { render, screen } from '@testing-library/react';
import { FormStatus } from './FormStatus';
import { describe, it, expect } from 'vitest';

describe('FormStatus', () => {
    it('renders nothing when no messages', () => {
        const { container } = render(<FormStatus />);
        expect(container).toBeEmptyDOMElement();
    });

    it('renders success message', () => {
        render(<FormStatus successMessage="Success!" />);
        expect(screen.getByText('Success!')).toBeInTheDocument();
        expect(screen.getByRole('alert')).toHaveTextContent('Success!');
    });

    it('renders error message', () => {
        render(<FormStatus errorMessage="Error!" />);
        expect(screen.getByText('Error!')).toBeInTheDocument();
        expect(screen.getByRole('alert')).toHaveTextContent('Error!');
    });

    it('renders both messages', () => {
        render(<FormStatus successMessage="Success!" errorMessage="Error!" />);
        expect(screen.getByText('Success!')).toBeInTheDocument();
        expect(screen.getByText('Error!')).toBeInTheDocument();
        expect(screen.getAllByRole('alert')).toHaveLength(2);
    });
});
