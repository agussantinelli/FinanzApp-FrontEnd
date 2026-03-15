import { render, screen, waitFor } from '@testing-library/react';
import DolarBarChart from './DolarBarChart';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getCotizacionesDolar } from '@/services/DolarService';

vi.mock('@/services/DolarService');
vi.mock('react-chartjs-2', () => ({
    Bar: ({ data }: any) => (
        <div data-testid="bar-chart">
            {data.labels.map((l: string) => <span key={l}>{l}</span>)}
        </div>
    )
}));

describe('DolarBarChart', () => {
    const mockData = [
        { nombre: 'Oficial', venta: 100, compra: 90 },
        { nombre: 'Blue', venta: 200, compra: 190 },
        { nombre: 'Bolsa', venta: 150, compra: 140 }
    ];

    beforeEach(() => {
        vi.clearAllMocks();
        (getCotizacionesDolar as any).mockResolvedValue(mockData);
    });

    it('renders loading state initially', () => {
        (getCotizacionesDolar as any).mockReturnValue(new Promise(() => {}));
        render(<DolarBarChart />);
        expect(screen.getByText(/Cargando/)).toBeInTheDocument();
    });

    it('renders chart and kpis after load', async () => {
        render(<DolarBarChart />);
        expect(await screen.findByTestId('bar-chart')).toBeInTheDocument();
        expect(screen.getByText(/Máximo venta:.*200/)).toBeInTheDocument();
        expect(screen.getByText(/Mínimo venta:.*100/)).toBeInTheDocument();
        expect(screen.getByText(/Promedio venta:.*150/)).toBeInTheDocument();
    });

    it('renders error state', async () => {
        (getCotizacionesDolar as any).mockRejectedValue(new Error('API Failure'));
        render(<DolarBarChart />);
        expect(await screen.findByText('API Failure')).toBeInTheDocument();
    });

    it('displays last update time', async () => {
        render(<DolarBarChart />);
        expect(await screen.findByText(/Actualizado:/)).toBeInTheDocument();
    });

    it('shortens long names in labels', async () => {
        (getCotizacionesDolar as any).mockResolvedValue([
            { nombre: 'A very long name that should be shortened', venta: 100, compra: 90 }
        ]);
        render(<DolarBarChart />);
        const el = await screen.findByText(/A very long name/);
        expect(el.textContent).toMatch(/A very long name t.*…/);
    });
});
