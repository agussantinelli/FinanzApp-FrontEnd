import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@/test/test-utils';
import DashboardPage from '@/app/dashboard-inversor/page';
import { server } from '@/test/msw/server';
import { http, HttpResponse } from 'msw';
import { RolUsuario } from '@/types/Usuario';

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
    user: { id: 1, nombre: 'Agus', rol: 'Inversor' },
    isAuthenticated: true,
    loading: false
  })
}));

// Mock hasRole from AuthService
vi.mock('@/services/AuthService', async () => {
    const actual = await vi.importActual('@/services/AuthService');
    return {
        ...actual,
        hasRole: vi.fn(() => true),
        getCurrentUser: vi.fn(() => ({ id: 1, nombre: 'Agus', rol: 'Inversor' }))
    };
});

// Mock complex sub-sections
vi.mock('@/components/sections/AccionesARGYSection', () => ({ default: () => <div data-testid="acciones">Acciones</div> }));
vi.mock('@/components/sections/CedearsSection', () => ({ default: () => <div data-testid="cedears">Cedears</div> }));
vi.mock('@/components/sections/CryptoSection', () => ({ default: () => <div data-testid="crypto">Crypto</div> }));
vi.mock('@/components/sections/DolarSection', () => ({ default: () => <div data-testid="dolar">Dolar</div> }));
vi.mock('@/components/sections/IndexesSection', () => ({ default: () => <div data-testid="indexes">Indexes</div> }));

const mockStats = {
  valorTotal: 2500000,
  rendimientoDiario: 2.5,
  cantidadActivos: 8,
  exposicionCripto: 15
};

const mockPortfolios = [{ id: 'P-TEST', nombre: 'Test Portfolio', idUsuario: 1 }];

const mockValuation = {
  totalPesos: 2500000,
  totalDolares: 2500,
  gananciaPesos: 25000,
  gananciaDolares: 25,
  variacionPorcentajePesos: 2.5,
  variacionPorcentajeDolares: 2.5,
  activos: [{ symbol: 'BTC', porcentajeCartera: 100, tipoActivo: 'Cripto' }]
};

describe('InversorDashboard Integration', () => {
  beforeEach(() => {
    // Basic shared mocks
    server.use(
      http.get('**/dashboard/inversor/stats', () => HttpResponse.json(mockStats)),
      http.get('**/portafolios/mis-portafolios', () => HttpResponse.json(mockPortfolios)),
      http.get('**/portafolios/P-TEST', () => HttpResponse.json(mockValuation))
    );
  });

  it('should render the dashboard with fetched stats', async () => {
    render(<DashboardPage />);

    // Greeting (flexible matcher for split nodes)
    expect(await screen.findByText((c) => c.includes('Agus'))).toBeInTheDocument();

    // Check for calculated values in the cards
    // 2,50% and 2.500 (standard es-AR formatting for the mocked values)
    await waitFor(() => {
        // Find by partial text or regex that handles the 2,50 formatting
        expect(screen.queryByText(/2[.,]50%/)).toBeInTheDocument();
        expect(screen.queryByText(/2[.,]500/)).toBeInTheDocument();
    }, { timeout: 15000 });

    // Verify sub-sections are rendered using text that actually exists
    expect(screen.getByText(/Atajos rápidos/i)).toBeInTheDocument();
  }, 30000);

  it('should toggle between ARS and USD display', async () => {
    render(<DashboardPage />);

    // Wait for initial load (USD)
    await waitFor(() => {
        expect(screen.queryByText(/2[.,]500/)).toBeInTheDocument();
    }, { timeout: 15000 });

    const usdToggle = screen.getByLabelText(/usd/i);
    const arsToggle = screen.getByLabelText(/ars/i);
    
    // Switch to ARS
    fireEvent.click(arsToggle);

    // Final ARS check ($ 2.500.000)
    await waitFor(() => {
        expect(screen.queryByText(/2[.,]500[.,]000/)).toBeInTheDocument();
    }, { timeout: 10000 });
  }, 30000);
});
