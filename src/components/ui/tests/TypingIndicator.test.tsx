import { render } from '@/test/test-utils';
import { describe, it, expect } from 'vitest';
import { TypingIndicator } from '../TypingIndicator';

describe('TypingIndicator', () => {
    it('renders dots', () => {
        const { container } = render(<TypingIndicator />);
        // Checking for the existence of the dots via class or structure
        expect(container.querySelectorAll(`div[class*="dot"]`)).toHaveLength(3);
    });
});
