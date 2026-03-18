import { http, HttpResponse } from 'msw';

export const handlers = [
  // Auth Handlers
  http.post('*/api/auth/login', async ({ request }) => {
    const { email, password } = await request.json() as any;
    
    let rol = 'Inversor';
    let nombre = 'Agus';
    
    // Mapeo exacto basado en la tabla de Seed Data
    if (email === 'admin@gmail.com' || email === 'finanzapp2025@gmail.com') {
      rol = 'Admin';
      nombre = 'Admin User';
    } else if (email === 'experto@gmail.com') {
      rol = 'Experto';
      nombre = 'Expert User';
    } else if (email === 'ema@gmail.com') {
      nombre = 'Ema';
    }

    return HttpResponse.json({
      token: 'fake-jwt-token',
      personaId: 1,
      nombre,
      apellido: 'Seed',
      email,
      rol,
      urlFotoPerfil: null,
      expiraUtc: '2026-12-31T23:59:59Z',
      perfilCompletado: true,
      tieneContrasenaConfigurada: true
    });
  }),

  // Dashboard Handlers
  http.get('*/dashboard/inversor/stats', () => {
    return HttpResponse.json({
      valorTotal: 1500000,
      rendimientoDiario: 1.5,
      cantidadActivos: 5,
      exposicionCripto: 12
    });
  }),

  // Portfolio Handlers
  http.get('*/portafolios/mis-portafolios', () => {
    return HttpResponse.json([
      { id: '1', nombre: 'Cartera Principal', idUsuario: 1 }
    ]);
  }),

  http.get('*/portafolios/:id', ({ params }) => {
    return HttpResponse.json({
      idPortafolio: params.id,
      totalPesos: 1500000,
      totalDolares: 1500,
      gananciaPesos: 15000,
      gananciaDolares: 15,
      variacionPorcentajePesos: 1.5,
      variacionPorcentajeDolares: 1.5,
      activos: [
        { symbol: 'BTC', porcentajeCartera: 100, valorActual: 1500, tipoActivo: 'Cripto' }
      ]
    });
  }),
];
