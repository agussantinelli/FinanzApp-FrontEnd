import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import FloatingMessage from './FloatingMessage';
import NeonLoader from './NeonLoader';
import PageHeader from './PageHeader';
import TypingIndicator from './TypingIndicator';

describe('UI Components', () => {
    it('FloatingMessage renders when open', () => {
        render(<FloatingMessage open={true} message="Test Message" onClose={vi.fn()} />);
        expect(screen.getByText('Test Message')).toBeInTheDocument();
    });

    it('NeonLoader renders message', () => {
        render(<NeonLoader message="Loading..." />);
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('PageHeader renders title and subtitle', () => {
        render(<PageHeader title="Title" subtitle="Subtitle" />);
        expect(screen.getByText('Title')).toBeInTheDocument();
        expect(screen.getByText('Subtitle')).toBeInTheDocument();
    });

    it('TypingIndicator renders dots', () => {
        const { container } = render(<TypingIndicator />);
        expect(container.getElementsByClassName('dot').length).toBe(3); // Assuming css class 'dot' or similar logic, checking container content
        // Or just check it renders without crashing
        expect(container).toBeInTheDocument();
    });
});
