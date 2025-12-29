import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CrearRecomendacionPage from './page';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useCrearRecomendacion } from '@/hooks/useCrearRecomendacion';

vi.mock('@/hooks/useCrearRecomendacion');
vi.mock('@/components/auth/RoleGuard', () => ({
    RoleGuard: ({ children }: any) => <div>{children}</div>
}));
vi.mock('next/navigation', () => ({
    useRouter: () => ({ back: vi.fn(), push: vi.fn() }),
}));
vi.mock('@/components/ui/NeonLoader', () => ({
    default: () => <div>Loading...</div>
}));

describe('CrearRecomendacionPage', () => {
    const mockHandleSubmit = vi.fn();
    const mockSetTitulo = vi.fn();

    beforeEach(() => {
        (useCrearRecomendacion as any).mockReturnValue({
            titulo: '',
            setTitulo: mockSetTitulo,
            justificacion: '',
            setJustificacion: vi.fn(),
            fuente: '',
            setFuente: vi.fn(),
            riesgo: 1,
            setRiesgo: vi.fn(),
            horizonte: 1,
            setHorizonte: vi.fn(),
            selectedSectores: [],
            setSelectedSectores: vi.fn(),
            availableSectores: [],
            assetRows: [{ tempId: 1, activo: null, accion: 1, precioAlRecomendar: '', precioObjetivo: '', stopLoss: '' }],
            loading: false,
            errors: {},
            handleAddRow: vi.fn(),
            handleRemoveRow: vi.fn(),
            updateRow: vi.fn(),
            handleSubmit: mockHandleSubmit,
            error: null,
            success: null,
            clearError: vi.fn(),
            clearSuccess: vi.fn()
        });
    });

    it('renders form', () => {
        render(<CrearRecomendacionPage />);
        expect(screen.getByText('Nueva Recomendación')).toBeInTheDocument();
        expect(screen.getByLabelText('Título de la Recomendación')).toBeInTheDocument();
    });

    it('submits form', () => {
        render(<CrearRecomendacionPage />);
        const submitBtn = screen.getByText('Publicar Recomendación');
        fireEvent.click(submitBtn);
        expect(mockHandleSubmit).toHaveBeenCalled();
    });
});
