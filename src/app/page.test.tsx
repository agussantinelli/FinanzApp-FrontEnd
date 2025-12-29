import { render, screen } from '@testing-library/react';
import HomePage from './page';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAuth } from '@/hooks/useAuth';

// Mock Auth
vi.mock('@/hooks/useAuth');
// Mock Sections to avoid complexity
vi.mock('@/components/sections/DolarSection', () => ({ default: () => <div>DolarSection</div> }));
vi.mock('@/components/sections/CedearsSection', () => ({ default: () => <div>CedearsSection</div> }));
vi.mock('@/components/sections/IndexesSection', () => ({ default: () => <div>IndexesSection</div> }));
vi.mock('@/components/sections/CryptoSection', () => ({ default: () => <div>CryptoSection</div> }));
vi.mock('@/components/sections/AccionesARGYSection', () => ({ default: () => <div>AccionesARGYSection</div> }));
vi.mock('@/components/sections/MarketHoursCard', () => ({ default: () => <div>MarketHoursCard</div> }));
// Mock Link
vi.mock('next/link', () => ({
    default: ({ children, href }: any) => <a href={href}>{children}</a>,
}));

describe('HomePage', () => {
    beforeEach(() => {
        (useAuth as any).mockReturnValue({
            isAuthenticated: false,
            user: null
        });
    });

    it('renders branding and sections', () => {
        render(<HomePage />);
        expect(screen.getByText(/Controlá tus finanzas con/)).toBeInTheDocument();
        expect(screen.getByText('FinanzApp')).toBeInTheDocument();
        expect(screen.getByText('DolarSection')).toBeInTheDocument();
        expect(screen.getByText('CryptoSection')).toBeInTheDocument();
    });

    it('shows login button when not authenticated', () => {
        render(<HomePage />);
        // Wait for mounted effect is implicit in RTL usually but checking existence
        // The component has "mounted" check, usually requires async wait or checking after render
        // But since we are mocking useAuth and effect runs immediately/fast in jsdom
        expect(screen.getByText('Empezar ahora')).toBeInTheDocument();
    });

    it('shows dashboard button when authenticated', async () => {
        (useAuth as any).mockReturnValue({
            isAuthenticated: true,
            user: { rol: 'Inversor' }
        });

        render(<HomePage />);
        // Need to wait for useEffect to set mounted
        expect(await screen.findByText('Ir al panel')).toBeInTheDocument();
    });
});
