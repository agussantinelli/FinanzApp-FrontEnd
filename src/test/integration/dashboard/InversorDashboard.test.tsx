import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@/test/test-utils';
import DashboardPage from '@/app/dashboard-inversor/page';
import { server } from '@/test/msw/server';
import { http, HttpResponse } from 'msw';

// Mock Next.js navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
  }),
  useSearchParams: () => ({
    get: vi.fn(() => null),
  }),
  usePathname: () => '/dashboard-inversor',
}));

// Mock useAuth
vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    user: { id: 1, nombre: 'Agus', rol: 'INVERSOR' },
    isAuthenticated: true,
    loading: false
  })
}));

// Mock complex sub-sections to isolate the main dashboard logic
vi.mock('@/components/sections/AccionesARGYSection', () => ({
    default: () => <div data-testid="acciones-section">Acciones Section</div>
}));
vi.mock('@/components/sections/CedearsSection', () => ({
    default: () => <div data-testid="cedears-section">Cedears Section</div>
}));
vi.mock('@/components/sections/CryptoSection', () => ({
    default: () => <div data-testid="crypto-section">Crypto Section</div>
}));
vi.mock('@/components/sections/DolarSection', () => ({
    default: () => <div data-testid="dolar-section">Dolar Section</div>
}));
vi.mock('@/components/sections/IndexesSection', () => ({
    default: () => <div data-testid="indexes-section">Indexes Section</div>
}));

describe('InversorDashboard Integration', () => {
  it('should render the dashboard with real-world fetched stats', async () => {
    server.use(
      http.get('*/dashboard/inversor/stats', () => {
        return HttpResponse.json({
          valorTotal: 2500000,
          rendimientoDiario: 2.5,
          cantidadActivos: 8,
          exposicionCripto: 15
        });
      }),
      http.get('*/portafolios/mis-portafolios', () => {
        return HttpResponse.json([{ id: 'P-1', nombre: 'Test Port' }]);
      }),
      http.get('*/portafolios/P-1', () => {
        return HttpResponse.json({
          totalPesos: 2500000,
          totalDolares: 2500,
          gananciaPesos: 25000,
          gananciaDolares: 25,
          variacionPorcentajePesos: 2.5,
          variacionPorcentajeDolares: 2.5,
          activos: [{ symbol: 'BTC', porcentajeCartera: 100, tipoActivo: 'Cripto' }]
        });
      })
    );

    render(<DashboardPage />);

    // Greeting from useAuth
    expect(await screen.findByText(/Hola, Agus/i)).toBeInTheDocument();

    // Check for calculated values (2,5%)
    await waitFor(() => {
        expect(screen.queryByText(/2[.,]5%/)).toBeInTheDocument();
    }, { timeout: 5000 });

    // Verify sub-sections are rendered (mocked version)
    expect(screen.getByTestId('acciones-section')).toBeInTheDocument();
  });

  it('should toggle between ARS and USD display', async () => {
    render(<DashboardPage />);

    // Initial USD check
    await waitFor(() => {
        expect(screen.queryByText(/2[.,]500/)).toBeInTheDocument();
    });

    const arsButton = screen.getByText(/ars/i);
    fireEvent.click(arsButton);

    // Final ARS check ($ 2.500.000)
    await waitFor(() => {
        expect(screen.queryByText(/2[.,]500[.,]000/)).toBeInTheDocument();
    });
  });
});
