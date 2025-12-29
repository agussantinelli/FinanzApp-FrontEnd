import { render, screen, fireEvent } from '@testing-library/react';
import RecomendacionCard from './RecomendacionCard';
import { describe, it, expect, vi } from 'vitest';
import { RecomendacionResumenDTO, EstadoRecomendacion } from '@/types/Recomendacion';

const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: mockPush,
    }),
}));

// Mock Link since it catches clicks often but we need to ensure it renders children
vi.mock('next/link', () => {
    return {
        default: ({ children }: { children: React.ReactNode }) => children,
    };
});

const mockItem: RecomendacionResumenDTO = {
    id: 1,
    titulo: "Buy Apple",
    autorId: 10,
    autorNombre: "Expert",
    fotoPerfil: "url",
    fecha: "2023-10-01",
    estado: EstadoRecomendacion.Aceptada,
    esDestacada: true,
    riesgo: "Moderado",
    horizonte: "CortoPlazo",
    cantidadActivos: 1,
    esAcertada: null,
    fuente: "Analysis"
};

describe('RecomendacionCard', () => {
    it('renders recommendation info', () => {
        render(<RecomendacionCard item={mockItem} />);
        expect(screen.getByText("Buy Apple")).toBeInTheDocument();
        expect(screen.getByText("Expert")).toBeInTheDocument();
        expect(screen.getByText("Moderado")).toBeInTheDocument();
        expect(screen.getByText("Corto Plazo")).toBeInTheDocument();
    });

    it('shows status chip when requested', () => {
        render(<RecomendacionCard item={mockItem} showStatus={true} />);
        expect(screen.getByText("Aceptada")).toBeInTheDocument();
    });

    it('navigates to detail on click', () => {
        render(<RecomendacionCard item={mockItem} />);
        // The card uses createSlug(title). "Buy Apple" -> "buy-apple"
        fireEvent.click(screen.getByText("Buy Apple").closest('div[class*="MuiCard-root"]')!);
        expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('/recomendaciones/buy-apple'));
    });

    it('shows admin actions for pending', () => {
        const pendingItem = { ...mockItem, estado: EstadoRecomendacion.Pendiente };
        const onApprove = vi.fn();
        const onReject = vi.fn();

        render(
            <RecomendacionCard
                item={pendingItem}
                isAdmin={true}
                onApprove={onApprove}
                onReject={onReject}
            />
        );

        const approveBtn = screen.getByTitle("Aprobar");
        fireEvent.click(approveBtn);
        expect(onApprove).toHaveBeenCalled();

        const rejectBtn = screen.getByTitle("Rechazar");
        fireEvent.click(rejectBtn);
        expect(onReject).toHaveBeenCalled();
    });
});
