import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useRegistrarOperacion } from '../useRegistrarOperacion';
import { getActivoById, searchActivos } from '@/services/ActivosService';
import { createOperacion, getOperacionesByPersona } from '@/services/OperacionesService';
import { getMisPortafolios, getPortafolioValuado } from '@/services/PortafolioService';
import { useAuth } from '@/hooks/useAuth';

vi.mock('@/services/ActivosService', () => ({
    getActivoById: vi.fn(),
    searchActivos: vi.fn(),
}));

vi.mock('@/services/OperacionesService', () => ({
    createOperacion: vi.fn(),
    getOperacionesByPersona: vi.fn(),
}));

vi.mock('@/services/PortafolioService', () => ({
    getMisPortafolios: vi.fn().mockResolvedValue([]),
    getPortafolioValuado: vi.fn().mockResolvedValue({ activos: [] }),
}));

vi.mock('@/hooks/useAuth', () => ({
    useAuth: vi.fn(() => ({ user: { id: 'u1' } })),
}));

vi.mock('next/navigation', () => ({
    useRouter: vi.fn(() => ({ push: vi.fn() })),
    useSearchParams: vi.fn(() => ({ get: vi.fn() })),
}));

describe('useRegistrarOperacion hook', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should initialize with default values', () => {
        const { result } = renderHook(() => useRegistrarOperacion());
        expect(result.current.mode).toBe('actual');
        expect(result.current.tipo).toBe(0); // TipoOperacion.Compra is 0
    });

    it('should validate before submit', async () => {
        const { result } = renderHook(() => useRegistrarOperacion());
        
        await act(async () => {
            await result.current.handleSubmit();
        });

        expect(result.current.error).toBe('Debes seleccionar un activo.');
    });

    it('should handle successful registration', async () => {
        vi.useFakeTimers();
        const mockAsset = { id: 'a1', symbol: 'AAPL', precioActual: 150 };
        (getActivoById as any).mockResolvedValue(mockAsset);
        (getOperacionesByPersona as any).mockResolvedValue([]);
        
        const { result } = renderHook(() => useRegistrarOperacion());

        act(() => {
            result.current.setAsset(mockAsset as any);
            result.current.setPortfolioId('p1');
            result.current.setCantidad('10');
            result.current.setPrecio('150');
            result.current.setFecha('2024-01-01T10:00');
        });

        await act(async () => {
            await result.current.handleSubmit();
        });

        expect(createOperacion).toHaveBeenCalled();
        expect(result.current.success).toBeDefined();
        vi.useRealTimers();
    });
});
