import { render, screen, waitFor, act } from '@testing-library/react';
import AssetOperationsHistory from '../AssetOperationsHistory';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAuth } from '@/hooks/useAuth';
import { getOperacionesByActivo, getOperacionesByPersona } from '@/services/OperacionesService';
import { RolUsuario } from '@/types/Usuario';

vi.mock('@/hooks/useAuth');
vi.mock('@/services/OperacionesService');

describe('AssetOperationsHistory', () => {
    const mockOps = [
        { 
            id: '1', 
            activoId: '1',
            activoSymbol: 'AAPL',
            tipo: 'Compra', 
            cantidad: 10, 
            precioUnitario: 100, 
            totalOperado: 1000, 
            fecha: '2024-01-01T10:00:00Z', 
            moneda: 'ARS',
            personaNombre: 'Admin',
            personaApellido: 'User',
            personaEmail: 'admin@test.com'
        }
    ];

    beforeEach(() => {
        vi.clearAllMocks();
        (useAuth as any).mockReturnValue({ user: { id: 'u1', rol: RolUsuario.Inversor } });
        (getOperacionesByPersona as any).mockResolvedValue(mockOps);
        (getOperacionesByActivo as any).mockResolvedValue(mockOps);
    });

    it('renders loading state initially', () => {
        (getOperacionesByPersona as any).mockReturnValue(new Promise(() => {}));
        render(<AssetOperationsHistory activoId="1" symbol="AAPL" />);
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('renders operations table for inversor', async () => {
        (useAuth as any).mockReturnValue({ user: { id: 'u1', rol: RolUsuario.Inversor } });

        render(<AssetOperationsHistory activoId="1" symbol="AAPL" />);

        expect(await screen.findByText(/Historial de Operaciones/i)).toBeInTheDocument();
        // Numbers match multiple times (quantity, price, total)
        const cellMatches = await screen.findAllByText(/10.*00/);
        expect(cellMatches.length).toBeGreaterThan(0);
        expect(screen.getByText(/AAPL/i)).toBeInTheDocument();
    });

    it('renders user info for admin', async () => {
        (useAuth as any).mockReturnValue({ user: { id: 'a1', rol: RolUsuario.Admin } });

        render(<AssetOperationsHistory activoId="1" symbol="AAPL" />);

        // 'Usuario' appears in the table header
        expect(await screen.findByRole('columnheader', { name: /Usuario/i })).toBeInTheDocument();
        expect(await screen.findByText(/Admin.*User/i)).toBeInTheDocument();
    });

    it('renders error message on failure', async () => {
        (getOperacionesByPersona as any).mockRejectedValue(new Error('Fail'));
        render(<AssetOperationsHistory activoId="1" symbol="AAPL" />);

        await waitFor(() => expect(screen.getByText(/No se pudo cargar el historial/i)).toBeInTheDocument());
    });

    it('renders nothing if no operations matching', async () => {
        (getOperacionesByPersona as any).mockResolvedValue([]);
        const { container } = render(<AssetOperationsHistory activoId="1" symbol="AAPL" />);
        await waitFor(() => expect(getOperacionesByPersona).toHaveBeenCalled());
        expect(container).toBeEmptyDOMElement();
    });
});
