import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@/test/test-utils';
import CrearRecomendacionPage from './page';
import { useCrearRecomendacion } from '@/hooks/useCrearRecomendacion';

// Mocks
vi.mock('@/hooks/useCrearRecomendacion', () => ({
    useCrearRecomendacion: vi.fn(() => ({
        titulo: '', setTitulo: vi.fn(),
        justificacion: '', setJustificacion: vi.fn(),
        fuente: '', setFuente: vi.fn(),
        riesgo: '', setRiesgo: vi.fn(),
        horizonte: '', setHorizonte: vi.fn(),
        selectedSectores: [], setSelectedSectores: vi.fn(),
        availableSectores: [],
        assetRows: [],
        loading: false,
        errors: {},
        apiError: null, aiError: null, success: null,
        handleAddRow: vi.fn(), handleRemoveRow: vi.fn(), updateRow: vi.fn(),
        handleSubmit: vi.fn(),
        clearApiError: vi.fn(), clearAiError: vi.fn(), clearSuccess: vi.fn()
    }))
}));
vi.mock('@/components/auth/RoleGuard', () => ({
    RoleGuard: ({ children }: any) => <div>{children}</div>
}));
vi.mock('@/services/ActivosService', () => ({
    searchActivos: vi.fn().mockResolvedValue([])
}));

vi.mock('next/navigation', () => ({
    useRouter: () => ({ back: vi.fn(), push: vi.fn() }),
    usePathname: () => '/test-path',
    useSearchParams: () => new URLSearchParams(),
}));
vi.mock('@/components/ui/NeonLoader', () => ({
    default: () => <div>Loading...</div>
}));

describe('CrearRecomendacionPage', () => {
    console.log('Hook Type:', typeof useCrearRecomendacion);
    console.log('Hook Value:', useCrearRecomendacion);

    it('renders page', () => {
        render(<CrearRecomendacionPage />);
        expect(screen.getByText('Nueva Recomendación')).toBeInTheDocument();
    });
});
