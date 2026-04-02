import { render, screen } from '@/test/test-utils';
import { describe, it, expect, vi } from 'vitest';
import FloatingMessage from '../FloatingMessage';

describe('FloatingMessage', () => {
    it('renders when open', () => {
        render(<FloatingMessage open={true} message="Test Message" severity="info" onClose={vi.fn()} />);
        expect(screen.getByText('Test Message')).toBeInTheDocument();
    });

    it('should not render when closed', () => {
        render(<FloatingMessage open={false} message="Test Message" severity="info" onClose={vi.fn()} />);
        expect(screen.queryByText('Test Message')).not.toBeInTheDocument();
    });
});
