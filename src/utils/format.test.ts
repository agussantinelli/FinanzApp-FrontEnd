import { describe, it, expect } from 'vitest';
import { formatARS, formatUSD, formatPercentage, formatQuantity, formatDateTime } from './format';

describe('format utils', () => {
    describe('formatARS', () => {
        it('formats numbers to ARS currency', () => {
            // Note: toLocaleString output can vary by environment, 
            // but we expect something like $ 1.234,56 or $1,234.56
            const result = formatARS(1234.56);
            expect(result).toMatch(/\$|ARS/);
            expect(result).toMatch(/1/);
            expect(result).toMatch(/234/);
            expect(result).toMatch(/56/);
        });

        it('returns "—" for invalid numbers', () => {
            expect(formatARS(null)).toBe('—');
            expect(formatARS(undefined)).toBe('—');
            expect(formatARS(NaN)).toBe('—');
        });
    });

    describe('formatUSD', () => {
        it('formats numbers to USD currency', () => {
            const result = formatUSD(1234.56);
            expect(result).toMatch(/\$|USD/);
            expect(result).toMatch(/1/);
            expect(result).toMatch(/234/);
            expect(result).toMatch(/56/);
        });

        it('returns "—" for invalid numbers', () => {
            expect(formatUSD(null)).toBe('—');
        });
    });

    describe('formatPercentage', () => {
        it('formats numbers correctly with 2 decimals', () => {
            const result = formatPercentage(12.345);
            expect(result).toMatch(/12/);
            expect(result).toMatch(/35/); // rounded
        });

        it('returns "—" for invalid numbers', () => {
            expect(formatPercentage(null)).toBe('—');
        });
    });

    describe('formatQuantity', () => {
        it('formats numbers with up to 6 decimals', () => {
            expect(formatQuantity(12.3456789)).toMatch(/12.345679/); // Rounded to 6
        });

        it('returns "0,00" for invalid numbers', () => {
            expect(formatQuantity(null)).toBe('0,00');
        });
    });

    describe('formatDateTime', () => {
        it('formats ISO string to local date time', () => {
            const iso = '2023-12-25T15:30:00Z';
            const result = formatDateTime(iso);
            expect(result).toMatch(/25/);
            expect(result).toMatch(/12/);
            expect(result).toMatch(/2023/);
        });

        it('returns "—" for invalid dates', () => {
            expect(formatDateTime(null)).toBe('—');
            expect(formatDateTime('invalid')).toBe('—');
        });
    });
});
