import { vi, describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@/test/test-utils';
import CrearRecomendacionPage from '@/app/recomendaciones/realizar/page';
import { server } from '@/test/msw/server';
import { http, HttpResponse } from 'msw';
import { RolUsuario } from '@/types/Usuario';

// Mock navigation
vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: vi.fn(),
        back: vi.fn(),
        replace: vi.fn(),
        prefetch: vi.fn(),
    }),
}));

// Mock useAuth for Expert
vi.mock('@/hooks/useAuth', () => ({
    useAuth: () => ({
        isAuthenticated: true,
        user: { id: 1, nombre: 'Agus', rol: RolUsuario.Experto },
        loading: false
    })
}));

describe('CreateRecommendation Integration', () => {
    const mockActivo = {
        id: '1',
        symbol: 'AAPL',
        nombre: 'Apple Inc.',
        precioActual: 150.5,
        tipo: 'Acciones',
        monedaBase: 'USD'
    };

    const mockSectores = [
        { id: 1, nombre: 'Tecnología' },
        { id: 2, nombre: 'Finanzas' }
    ];

    beforeEach(() => {
        server.use(
            http.get('**/api/activos/buscar', () => HttpResponse.json([mockActivo])),
            http.get('**/api/sectores', () => HttpResponse.json(mockSectores)),
            http.get('**/api/recomendaciones/sectores-disponibles', () => HttpResponse.json(mockSectores)),
            http.post('**/api/recomendaciones', () => HttpResponse.json({ success: true }))
        );
    });

    it('should allow creating a recommendation flow', async () => {
        render(<CrearRecomendacionPage />);

        // 1. Title and Justification
        const titleInput = screen.getByLabelText(/Título de la Recomendación/i);
        fireEvent.change(titleInput, { target: { value: 'Apple Bullish' } });

        const justificationInput = screen.getByLabelText(/Justificación Lógica/i);
        fireEvent.change(justificationInput, { target: { value: 'Strong earnings report and new product line.' } });

        // 2. Sectores (Autocomplete Multiple)
        const sectorInput = screen.getByRole('combobox', { name: /Sectores Objetivo/i });
        fireEvent.change(sectorInput, { target: { value: 'Tec' } }); 
        
        // Wait for debounce and search results
        const sectorOption = await screen.findByRole('option', { name: /Tecnología/i });
        fireEvent.click(sectorOption);

        // 3. Selection of risk and horizon (Selects)
        const riskSelectLabel = await screen.findByText(/Nivel de Riesgo/i);
        fireEvent.mouseDown(riskSelectLabel);
        const riskOption = await screen.findByRole('option', { name: 'Moderado' });
        fireEvent.click(riskOption);

        const horizonSelectLabel = await screen.findByText(/Horizonte de Inversión/i);
        fireEvent.mouseDown(horizonSelectLabel);
        const horizonOption = await screen.findByRole('option', { name: 'Largo Plazo' });
        fireEvent.click(horizonOption);

        // 4. Asset Row (Search)
        const assetSearch = screen.getByRole('combobox', { name: /Buscar Activo/i });
        fireEvent.change(assetSearch, { target: { value: 'AAPL' } });
        
        // Wait for debounce and search results
        const assetOption = await screen.findByRole('option', { name: /AAPL/i });
        fireEvent.click(assetOption);

        // 5. Fill asset values
        const priceInput = screen.getByLabelText(/Precio Actual/i);
        fireEvent.change(priceInput, { target: { value: '150.5' } });

        const targetInput = screen.getByLabelText(/Target/i);
        fireEvent.change(targetInput, { target: { value: '180' } });

        const stopLossInput = screen.getByLabelText(/Stop Loss/i);
        fireEvent.change(stopLossInput, { target: { value: '140' } });

        // 6. Submit
        const submitButton = screen.getByRole('button', { name: /Publicar Recomendación/i });
        fireEvent.click(submitButton);

        // 7. Verify success
        await screen.findByText(/Recomendación publicada con éxito/i, {}, { timeout: 10000 });
    });

    it('should show error when required fields are missing', async () => {
        render(<CrearRecomendacionPage />);
        const submitButton = screen.getByRole('button', { name: /Publicar Recomendación/i });
        fireEvent.click(submitButton);

        // Should show validation errors
        await waitFor(() => {
            expect(screen.getByText(/El título es requerido/i)).toBeInTheDocument();
        }, { timeout: 5000 });
    });
});
