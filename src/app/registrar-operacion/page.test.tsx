import { render, screen, fireEvent, waitFor } from '@/test/test-utils';
import RegistrarOperacionPage from './page';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useRegistrarOperacion } from '@/hooks/useRegistrarOperacion';

vi.mock('@/hooks/useRegistrarOperacion');
vi.mock('@/components/auth/RoleGuard', () => ({
    RoleGuard: ({ children }: any) => <div>{children}</div>
}));
vi.mock('@/components/ui/NeonLoader', () => ({
    default: () => <div>Loading...</div>
}));
vi.mock('next/navigation', () => ({
    useRouter: () => ({ back: vi.fn(), push: vi.fn() }),
}));

describe('RegistrarOperacionPage', () => {
    const mockHandleSubmit = vi.fn();
    const mockSetAsset = vi.fn();
    const mockSetCantidad = vi.fn();

    beforeEach(() => {
        (useRegistrarOperacion as any).mockReturnValue({
            mode: 'actual',
            setMode: vi.fn(),
            asset: null,
            setAsset: mockSetAsset,
            options: [],
            handleSearch: vi.fn(),
            portfolios: [{ id: '1', nombre: 'Principal' }],
            portfolioId: '1',
            setPortfolioId: vi.fn(),
            detailedPortfolio: null,
            tipo: 'Compra',
            setTipo: vi.fn(),
            cantidad: '',
            setCantidad: mockSetCantidad,
            precio: '',
            setPrecio: vi.fn(),
            moneda: 'ARS',
            setMoneda: vi.fn(),
            fecha: '2023-01-01T12:00',
            setFecha: vi.fn(),
            loading: false,
            error: null,
            success: null,
            clearError: vi.fn(),
            clearSuccess: vi.fn(),
            handleSubmit: mockHandleSubmit,
            totalEstimado: 0
        });
    });

    it('renders form elements', () => {
        render(<RegistrarOperacionPage />);
        expect(screen.getByText('Registrar Operación')).toBeInTheDocument();
        expect(screen.getByText('1. Datos de la Operación')).toBeInTheDocument();
        expect(screen.getByLabelText('Monitor de Mercado (Actual)')).toBeInTheDocument();
    });

    it('handles asset selection interaction', () => {
        render(<RegistrarOperacionPage />);
        const autocomplete = screen.getByLabelText(/Buscar Activo/i);
        fireEvent.change(autocomplete, { target: { value: 'AAPL' } });
        // Since we mock the hook, we can just verify the hook logic would be called or the input changes
        // But with Autocomplete interaction in RTL is tricky. 
        // We verify checking what relies on it.
    });

    it('shows loading state when submitting', () => {
        (useRegistrarOperacion as any).mockReturnValue({
            ...((useRegistrarOperacion as any)()),
            loading: true
        });
        render(<RegistrarOperacionPage />);
        expect(screen.getByText('Registrando...')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Registrando...' })).toBeDisabled();
    });

    it('submits form', () => {
        render(<RegistrarOperacionPage />);
        const submitBtn = screen.getByText('Confirmar Operación');
        fireEvent.click(submitBtn);
        expect(mockHandleSubmit).toHaveBeenCalled();
    });

    it('displays validation error', () => {
        (useRegistrarOperacion as any).mockReturnValue({
            ...((useRegistrarOperacion as any)()),
            error: 'Cantidad inválida'
        });
        render(<RegistrarOperacionPage />);
        expect(screen.getByText('Cantidad inválida')).toBeInTheDocument();
    });
});
