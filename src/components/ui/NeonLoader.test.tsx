import { render, screen } from '@/test/test-utils';
import { describe, it, expect } from 'vitest';
import NeonLoader from './NeonLoader';

describe('NeonLoader', () => {
    it('renders message', () => {
        render(<NeonLoader message="Loading..." />);
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
});
