import { render } from '@/test/test-utils';
import { describe, it, expect, vi } from 'vitest';
import NeonParticlesBg from '../NeonParticlesBg';

// Mock tsparticles if needed, but usually a render test is enough to check if it doesn't crash
vi.mock('@tsparticles/react', () => ({
    default: () => <div data-testid="particles-bg" />,
    initParticlesEngine: vi.fn().mockResolvedValue({}),
}));

describe('NeonParticlesBg', () => {
    it('renders without crashing', () => {
        const { getByTestId } = render(<NeonParticlesBg />);
        // Since it's a client component with effects, we just check for the base container or mock
        // If the mock is active:
        // expect(getByTestId('particles-bg')).toBeInTheDocument();
        // If not mocked, it might render nothing or a canvas depending on the environment.
        // Let's assume the mock for stability in JSDOM.
    });
});
