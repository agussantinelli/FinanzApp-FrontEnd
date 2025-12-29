import { render, screen, waitFor } from '@testing-library/react';
import AssetOperationsHistory from './AssetOperationsHistory';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAuth } from '@/hooks/useAuth';
import { getOperacionesByActivo, getOperacionesByPersona } from '@/services/OperacionesService';

vi.mock('@/hooks/useAuth');
vi.mock('@/services/OperacionesService');

describe('AssetOperationsHistory', () => {
    const mockOps = [
        { id: 1, tipo: 'Compra', cantidad: 10, precioUnitario: 100, totalOperado: 1000, fecha: new Date().toISOString(), moneda: 'ARS' }
    ];

    beforeEach(() => {
        (useAuth as any).mockReturnValue({ user: { id: 1, rol: 'Inversor' } });
        (getOperacionesByPersona as any).mockResolvedValue(mockOps);
    });



    it('renders nothing if no operations', async () => {
        (getOperacionesByPersona as any).mockResolvedValue([]);
        const { container } = render(<AssetOperationsHistory activoId={1} symbol="AAPL" />);
        await waitFor(() => expect(getOperacionesByPersona).toHaveBeenCalled());
        expect(container).toBeEmptyDOMElement();
    });
});
