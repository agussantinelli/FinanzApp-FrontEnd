import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ReporteDolar from './page';

// Mock components
vi.mock('@/components/charts/DolarBarChart', () => ({
  default: () => <div data-testid="dolar-bar-chart">Dolar Bar Chart</div>,
}));

// Mock styles
vi.mock('./styles/ReporteDolar.module.css', () => ({
  default: {
    container: 'container',
    maxWidthContainer: 'maxWidthContainer',
    headerTitle: 'headerTitle',
    description: 'description',
  },
}));

describe('ReporteDolar', () => {
  it('renders correctly', () => {
    render(<ReporteDolar />);
    
    expect(screen.getByText(/Cotizaciones del Dólar/i)).toBeDefined();
    expect(screen.getByText(/Este gráfico compara precios/i)).toBeDefined();
    expect(screen.getByTestId('dolar-bar-chart')).toBeDefined();
  });
});
