import { screen, waitFor } from '@testing-library/react';
import { render } from '@/test/test-utils';
import RecomendacionDetallePage from './page';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getRecomendacionById } from '@/services/RecomendacionesService';
import { useAuth } from '@/hooks/useAuth';

vi.mock('@/services/RecomendacionesService');
vi.mock('@/hooks/useAuth');
vi.mock('next/navigation', () => ({
    useParams: () => ({ id: '123' }),
    useRouter: () => ({ back: vi.fn() }),
}));
vi.mock('@/components/auth/RoleGuard', () => ({
    RoleGuard: ({ children }: any) => <div>{children}</div>
}));
vi.mock('next/link', () => ({
    default: ({ children }: any) => <a>{children}</a>,
}));

describe('RecomendacionDetallePage', () => {
    const defaultRec = {
        id: '123',
        titulo: 'Buy AAPL',
        fuente: 'Wall St',
        fechaInforme: new Date().toISOString(),
        justificacionLogica: 'Good growth',
        horizonte: 1,
        riesgo: 1,
        estado: 1,
        detalles: [
            { activo: { symbol: 'AAPL', nombre: 'Apple' }, accion: 1, precioAlRecomendar: 150, precioObjetivo: 200, stopLoss: 140 }
        ],
        persona: { nombre: 'Expert', apellido: 'One' }
    };

    beforeEach(() => {
        (getRecomendacionById as any).mockResolvedValue(defaultRec);
        (useAuth as any).mockReturnValue({ user: { rol: 'Inversor' } });
    });

    it('renders recommendation details', async () => {
        render(<RecomendacionDetallePage />);
        // Wait for loading to finish and data to appear
        await waitFor(() => {
            expect(screen.getByText('Buy AAPL')).toBeInTheDocument();
        });
        expect(screen.getByText('Good growth')).toBeInTheDocument();
        expect(screen.getByText('AAPL')).toBeInTheDocument();
    });
});
