import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import StrategiesPage from './page';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getPortafoliosDestacados } from '@/services/PortafolioService';
import { useAuth } from '@/hooks/useAuth';

vi.mock('@/services/PortafolioService');
vi.mock('@/hooks/useAuth');
vi.mock('@/components/auth/RoleGuard', () => ({
    RoleGuard: ({ children }: any) => <div>{children}</div>
}));

const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
    useRouter: () => ({ push: mockPush })
}));

describe('StrategiesPage', () => {
    const mockData = [
        { id: '1', nombre: 'Top Strategy', esTop: true, nombreUsuario: 'User 1', descripcion: 'Top desc' },
        { id: '2', nombre: 'Regular Strategy', esTop: false, nombreUsuario: 'User 2', descripcion: 'Reg desc' }
    ];

    beforeEach(() => {
        vi.clearAllMocks();
        (useAuth as any).mockReturnValue({ user: { id: 'u1' } });
        (getPortafoliosDestacados as any).mockResolvedValue(mockData);
    });

    it('renders loading state initially', () => {
        (getPortafoliosDestacados as any).mockReturnValue(new Promise(() => {}));
        render(<StrategiesPage />);
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('renders top and regular strategies correctly', async () => {
        render(<StrategiesPage />);
        
        await waitFor(() => expect(screen.getByText(/Top Strategy/i)).toBeInTheDocument());
        expect(screen.getByText(/TOP SELECTION/i)).toBeInTheDocument();
        expect(screen.getByText(/Regular Strategy/i)).toBeInTheDocument();
        expect(screen.getByText(/Otras Estrategias Destacadas/i)).toBeInTheDocument();
    });

    it('handles empty strategies state', async () => {
        (getPortafoliosDestacados as any).mockResolvedValue([]);
        render(<StrategiesPage />);
        
        await waitFor(() => expect(screen.getByText('No hay estrategias disponibles')).toBeInTheDocument());
    });

    it('handles error state with retry', async () => {
        (getPortafoliosDestacados as any).mockRejectedValue(new Error('Fail'));
        render(<StrategiesPage />);
        
        await waitFor(() => expect(screen.getByText('Error al cargar')).toBeInTheDocument());
        
        const retryBtn = screen.getByText('Reintentar');
        (getPortafoliosDestacados as any).mockResolvedValue(mockData);
        fireEvent.click(retryBtn);
        
        await waitFor(() => expect(screen.getByText('Top Strategy')).toBeInTheDocument());
    });

    it('navigates to portfolio detail on button click', async () => {
        render(<StrategiesPage />);
        await waitFor(() => screen.getByText('Top Strategy'));
        
        const verBtn = screen.getByText('Ver Estrategia');
        fireEvent.click(verBtn);
        expect(mockPush).toHaveBeenCalledWith('/portfolio?id=1');
    });

    it('identifies "Tú" for user own portfolio', async () => {
        (getPortafoliosDestacados as any).mockResolvedValue([
            { id: '1', nombre: 'My Strategy', personaId: 'u1', esTop: true }
        ]);
        render(<StrategiesPage />);
        await waitFor(() => expect(screen.getByText('Tú')).toBeInTheDocument());
    });
});
