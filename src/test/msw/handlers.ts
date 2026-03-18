import { http, HttpResponse } from 'msw';

export const handlers = [
  // Auth Handlers
  http.post('*/api/auth/login', () => {
    return HttpResponse.json({
      token: 'fake-jwt-token',
      user: { id: 1, nombre: 'Agus', rol: 'INVERSOR' }
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
