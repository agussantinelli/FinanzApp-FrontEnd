import { describe, it, expect, beforeEach } from 'vitest';
import { 
    getRecomendacionFromCache, 
    getAllRecomendacionesFromCache, 
    cacheRecomendaciones, 
    clearRecomendacionesCache 
} from './recomendaciones-cache';
import { RecomendacionDTO, Riesgo, Horizonte } from '@/types/Recomendacion';

describe('recomendaciones-cache', () => {
    const mockRec: RecomendacionDTO = {
        id: '1',
        titulo: 'Bullish AAPL',
        justificacionLogica: 'Expected growth',
        fuente: 'Expert',
        fechaInforme: '2024-01-01',
        riesgo: Riesgo.Moderado,
        horizonte: Horizonte.Mediano,
        estado: 1,
        sectoresObjetivo: [],
        detalles: []
    };

    beforeEach(() => {
        clearRecomendacionesCache();
    });

    it('should cache and retrieve a recommendation', () => {
        cacheRecomendaciones([mockRec]);
        expect(getRecomendacionFromCache('1')).toEqual(mockRec);
    });

    it('should return undefined for non-existent recommendation', () => {
        expect(getRecomendacionFromCache('non-existent')).toBeUndefined();
    });

    it('should return null for getAll if empty and not full list', () => {
        expect(getAllRecomendacionesFromCache()).toBeNull();
    });

    it('should return all if not empty even if not full list (as per implementation)', () => {
        cacheRecomendaciones([mockRec]);
        const all = getAllRecomendacionesFromCache();
        expect(all).toHaveLength(1);
        expect(all?.[0]).toEqual(mockRec);
    });

    it('should return all recommendations if cached as full list', () => {
        cacheRecomendaciones([mockRec], true);
        const all = getAllRecomendacionesFromCache();
        expect(all).toHaveLength(1);
        expect(all?.[0]).toEqual(mockRec);
    });

    it('should clear the cache', () => {
        cacheRecomendaciones([mockRec], true);
        clearRecomendacionesCache();
        expect(getRecomendacionFromCache('1')).toBeUndefined();
        expect(getAllRecomendacionesFromCache()).toBeNull();
    });
});
