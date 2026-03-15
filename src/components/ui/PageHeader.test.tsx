import { render, screen } from '@/test/test-utils';
import { describe, it, expect } from 'vitest';
import PageHeader from './PageHeader';

describe('PageHeader', () => {
    it('renders title and description', () => {
        render(<PageHeader title="Main Title" description="Helpful description" />);
        expect(screen.getByText('Main Title')).toBeInTheDocument();
        expect(screen.getByText('Helpful description')).toBeInTheDocument();
    });
});
