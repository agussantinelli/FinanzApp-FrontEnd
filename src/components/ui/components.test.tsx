import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import FloatingMessage from './FloatingMessage';
import NeonLoader from './NeonLoader';


describe('UI Components', () => {
    it('FloatingMessage renders when open', () => {
        render(<FloatingMessage open={true} message="Test Message" severity="info" onClose={vi.fn()} />);
        expect(screen.getByText('Test Message')).toBeInTheDocument();
    });

    it('NeonLoader renders message', () => {
        render(<NeonLoader message="Loading..." />);
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });


});
