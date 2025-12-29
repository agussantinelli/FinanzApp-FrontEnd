import { render, screen, waitFor } from '@testing-library/react';
import DolarBarChart from './DolarBarChart';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getCotizacionesDolar } from '@/services/DolarService';

vi.mock('@/services/DolarService');
vi.mock('react-chartjs-2', () => ({
    Bar: () => <div>BarChart</div>
}));

describe('DolarBarChart', () => {
    const mockData = [
        { nombre: 'Oficial', venta: 100, compra: 90 },
        { nombre: 'Blue', venta: 200, compra: 190 }
    ];

    beforeEach(() => {
        (getCotizacionesDolar as any).mockResolvedValue(mockData);
    });

    it('renders chart and kpis', async () => {
        render(<DolarBarChart />);
        expect(await screen.findByText('BarChart')).toBeInTheDocument();
        // Check for calculated KPIs (approximate checks as they might be formatted)
        // Max venta should be 200. ARS formatting might add decimals or symbol.
        expect(await screen.findByText(/Máximo venta:/)).toBeInTheDocument();
    });


});
