import { describe, it, expect } from 'vitest';
import { getTickerForDolar } from './tickerMapping';

describe('tickerMapping utility', () => {
    it('returns undefined if no name is provided', () => {
        expect(getTickerForDolar()).toBeUndefined();
        expect(getTickerForDolar('')).toBeUndefined();
    });

    it('maps common dolar names to tickers', () => {
        expect(getTickerForDolar('Dólar Blue')).toBe('USD_BLUE');
        expect(getTickerForDolar('Dólar Oficial')).toBe('USD_OFICIAL');
        expect(getTickerForDolar('Dolar MEP')).toBe('USD_MEP');
        expect(getTickerForDolar('Bolsa')).toBe('USD_MEP');
        expect(getTickerForDolar('Contado con Liqui')).toBe('USD_CCL');
        expect(getTickerForDolar('CCL')).toBe('USD_CCL');
        expect(getTickerForDolar('Cripto')).toBe('USD_CRIPTO');
        expect(getTickerForDolar('Tarjeta')).toBe('USD_TARJETA');
        expect(getTickerForDolar('Mayorista')).toBe('USD_MAYORISTA');
    });

    it('returns the input name if no mapping is found', () => {
        expect(getTickerForDolar('Other')).toBe('Other');
    });

    it('is case insensitive', () => {
        expect(getTickerForDolar('BLUE')).toBe('USD_BLUE');
        expect(getTickerForDolar('mep')).toBe('USD_MEP');
    });
});
