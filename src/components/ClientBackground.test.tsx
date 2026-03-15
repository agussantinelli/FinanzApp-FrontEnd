import { render } from '@/test/test-utils';
import { describe, it, expect } from 'vitest';
import ClientBackground from './ClientBackground';

describe('ClientBackground', () => {
    it('renders without crashing', () => {
        render(<ClientBackground />);
    });
});
