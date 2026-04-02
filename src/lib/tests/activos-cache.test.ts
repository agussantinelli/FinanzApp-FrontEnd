import { describe, it, expect, beforeEach } from 'vitest';
import { 
    getActivoFromCache, 
    getAllActivosFromCache, 
    cacheActivos, 
    clearCache 
} from '../activos-cache';
import { ActivoDTO } from '@/types/Activo';

describe('activos-cache', () => {
    const mockActivo: ActivoDTO = {
        id: '1',
        symbol: 'AAPL',
        nombre: 'Apple Inc',
        tipo: 'Acción',
        tipoActivoId: 1,
        monedaBase: 'USD',
        sector: 'Tecnología',
        esLocal: false,
        descripcion: 'Apple Inc.',
        loSigo: false
    };

    beforeEach(() => {
        clearCache();
    });

    it('should cache and retrieve an activo', () => {
        cacheActivos([mockActivo]);
        expect(getActivoFromCache('1')).toEqual(mockActivo);
    });

    it('should return undefined for non-existent activo', () => {
        expect(getActivoFromCache('non-existent')).toBeUndefined();
    });

    it('should return null for getAllActivosFromCache if not a full cache', () => {
        cacheActivos([mockActivo]);
        expect(getAllActivosFromCache()).toBeNull();
    });

    it('should return all activos if cached as a full list', () => {
        cacheActivos([mockActivo], true);
        const all = getAllActivosFromCache();
        expect(all).toHaveLength(1);
        expect(all?.[0]).toEqual(mockActivo);
    });

    it('should clear the cache', () => {
        cacheActivos([mockActivo], true);
        clearCache();
        expect(getActivoFromCache('1')).toBeUndefined();
        expect(getAllActivosFromCache()).toBeNull();
    });
});
