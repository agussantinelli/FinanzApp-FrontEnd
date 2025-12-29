import { render, screen } from '@testing-library/react';
import MisRecomendacionesPage from './page';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useMisRecomendaciones } from '@/hooks/useMisRecomendaciones';

vi.mock('@/hooks/useMisRecomendaciones');
vi.mock('@/components/auth/RoleGuard', () => ({
    RoleGuard: ({ children }: any) => <div>{children}</div>
}));
vi.mock('@/components/cards/RecomendacionCard', () => ({
    default: ({ item }: any) => <div>{item.titulo}</div>
}));
vi.mock('next/navigation', () => ({
    useRouter: () => ({ push: vi.fn() }),
    useSearchParams: () => ({ get: () => null })
}));
vi.mock('@/components/ui/PageHeader', () => ({
    default: ({ title }: any) => <h1>{title}</h1>
}));


describe('MisRecomendacionesPage', () => {
    beforeEach(() => {
        (useMisRecomendaciones as any).mockReturnValue({
            displayedData: [{ id: '1', titulo: 'My Rec 1' }],
            loading: false,
            error: null,
            sectores: [],
            selectedSector: '',
            setSelectedSector: vi.fn(),
            handleApply: vi.fn(),
            handleClear: vi.fn()
        });
    });

    it('renders my recommendations', () => {
        render(<MisRecomendacionesPage />);
        expect(screen.getByText('Mis Recomendaciones')).toBeInTheDocument();
        expect(screen.getByText('My Rec 1')).toBeInTheDocument();
    });
});
