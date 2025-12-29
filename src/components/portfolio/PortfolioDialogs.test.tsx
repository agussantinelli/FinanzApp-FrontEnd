import { render, screen, fireEvent, waitFor } from '@/test/test-utils';
import { CreatePortfolioDialog, EditPortfolioDialog } from './PortfolioDialogs';
import { describe, it, expect, vi } from 'vitest';
import { createPortafolio, updatePortafolio, deletePortafolio } from '@/services/PortafolioService';

vi.mock('@/services/PortafolioService');

describe('PortfolioDialogs', () => {
    describe('CreatePortfolioDialog', () => {
        it('renders and submits', async () => {
            const mockOnSuccess = vi.fn();
            const mockOnClose = vi.fn();
            render(<CreatePortfolioDialog open={true} onSuccess={mockOnSuccess} onClose={mockOnClose} />);

            fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: 'New Port' } });
            fireEvent.click(screen.getByText('Crear'));

            await waitFor(() => expect(createPortafolio).toHaveBeenCalled());
            expect(mockOnSuccess).toHaveBeenCalled();
        });
    });

    describe('EditPortfolioDialog', () => {
        const mockPortfolio = { id: '1', nombre: 'Old Port', descripcion: 'Desc', esPrincipal: false };

        it('renders and saves', async () => {
            const mockOnSuccess = vi.fn();
            const mockOnClose = vi.fn();
            render(<EditPortfolioDialog open={true} onSuccess={mockOnSuccess} onClose={mockOnClose} portfolio={mockPortfolio} />);

            fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: 'Updated Port' } });
            fireEvent.click(screen.getByText('Guardar Cambios'));

            await waitFor(() => expect(updatePortafolio).toHaveBeenCalled());
            expect(mockOnSuccess).toHaveBeenCalled();
        });

        it('handles delete', async () => {
            const mockOnSuccess = vi.fn();
            const mockOnClose = vi.fn();
            render(<EditPortfolioDialog open={true} onSuccess={mockOnSuccess} onClose={mockOnClose} portfolio={mockPortfolio} />);

            fireEvent.click(screen.getByText('Eliminar Portafolio'));
            expect(screen.getByText('¿Estás seguro? Esta acción no se puede deshacer.')).toBeInTheDocument();

            fireEvent.click(screen.getByText('Confirmar Eliminación'));
            await waitFor(() => expect(deletePortafolio).toHaveBeenCalled());
        });
    });
});
