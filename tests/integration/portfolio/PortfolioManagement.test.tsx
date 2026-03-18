import { vi, describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@/test/test-utils';
import PortfolioPage from '@/app/portfolio/page';
import { server } from '@/test/msw/server';
import { http, HttpResponse } from 'msw';

// Mock navigation
vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: vi.fn(),
    }),
    useSearchParams: () => new URLSearchParams(),
}));

const mockUser = { id: 1, nombre: 'Agus', rol: 'INVERSOR' };

// Mock AuthService so RoleGuard passes
vi.mock('@/services/AuthService', async (importOriginal) => {
    const original = await importOriginal<typeof import('@/services/AuthService')>();
    return {
        ...original,
        hasRole: vi.fn(() => true),
        getCurrentUser: vi.fn(() => mockUser),
    };
});

describe('PortfolioManagement Integration', () => {
    beforeEach(() => {
        server.use(
            http.get('*/portafolios/mis-portafolios', () => {
                return HttpResponse.json([
                    { id: '1', nombre: 'Cartera Principal' }
                ]);
            }),
            http.get('*/portafolios/1', () => {
                return HttpResponse.json({
                    id: '1',
                    nombre: 'Cartera Principal',
                    totalPesos: 1500000,
                    totalDolares: 1500,
                    activos: []
                });
            }),
            http.post('*/portafolios', () => {
                return HttpResponse.json({ id: '2', nombre: 'Nueva Cartera' });
            }),
            http.patch('*/portafolios/1', () => {
                return HttpResponse.json({ id: '1', nombre: 'Cartera Editada' });
            })
        );
    });

    it('should allow creating and editing a portfolio', async () => {
        render(<PortfolioPage />);

        // Wait for initial load
        await waitFor(() => {
            expect(screen.getByText(/Cartera Principal/i)).toBeInTheDocument();
        });

        // 1. Create Portfolio
        const addBtn = screen.getByLabelText(/Crear nuevo portafolio/i);
        fireEvent.click(addBtn);

        const nameInput = screen.getByLabelText(/Nombre/i);
        fireEvent.change(nameInput, { target: { value: 'Nueva Cartera' } });
        
        const createBtn = screen.getByRole('button', { name: /Crear Portafolio/i });
        fireEvent.click(createBtn);

        // 2. Edit Portfolio
        const editBtn = await screen.findByLabelText(/Editar detalles/i);
        fireEvent.click(editBtn);

        const editNameInput = screen.getByLabelText(/Nombre/i);
        fireEvent.change(editNameInput, { target: { value: 'Cartera Editada' } });
        
        const saveBtn = screen.getByRole('button', { name: /Guardar Cambios/i });
        fireEvent.click(saveBtn);
        
        await waitFor(() => {
            expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        });
    });
});
