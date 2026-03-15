import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import FloatingMessage from './FloatingMessage';
import NeonLoader from './NeonLoader';
import PageHeader from './PageHeader';
import { TypingIndicator } from './TypingIndicator';


describe('UI Components', () => {
    it('FloatingMessage renders when open', () => {
        render(<FloatingMessage open={true} message="Test Message" severity="info" onClose={vi.fn()} />);
        expect(screen.getByText('Test Message')).toBeInTheDocument();
    });

    it('NeonLoader renders message', () => {
        render(<NeonLoader message="Loading..." />);
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('PageHeader renders title and description', () => {
        render(<PageHeader title="Main Title" description="Helpful description" />);
        expect(screen.getByText('Main Title')).toBeInTheDocument();
        expect(screen.getByText('Helpful description')).toBeInTheDocument();
    });

    it('TypingIndicator renders dots', () => {
        const { container } = render(<TypingIndicator />);
        // Checking for the existence of the dots via class or structure
        expect(container.querySelectorAll(`div[class*="dot"]`)).toHaveLength(3);
    });
});
