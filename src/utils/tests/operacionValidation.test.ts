import { describe, it, expect } from 'vitest';
import { validateTemporalConsistency } from '../operacionValidation';
import { TipoOperacion } from '@/types/Operacion';

describe('operacionValidation utility', () => {
    const existingOps = [
        { id: '1', fecha: '2024-01-01', tipo: TipoOperacion.Compra, cantidad: 10, activoSymbol: 'AAPL' },
    ];

    it('allows a purchase at any time', () => {
        const newOp = { fecha: '2024-01-02', tipo: TipoOperacion.Compra, cantidad: 5, activoSymbol: 'AAPL' };
        const result = validateTemporalConsistency(existingOps, 'CREATE', newOp);
        expect(result.valid).toBe(true);
    });

    it('allows a sale if balance remains non-negative', () => {
        const newOp = { fecha: '2024-01-02', tipo: TipoOperacion.Venta, cantidad: 5, activoSymbol: 'AAPL' };
        const result = validateTemporalConsistency(existingOps, 'CREATE', newOp);
        expect(result.valid).toBe(true);
    });

    it('forbids a sale if it results in negative balance', () => {
        const newOp = { fecha: '2024-01-02', tipo: TipoOperacion.Venta, cantidad: 15, activoSymbol: 'AAPL' };
        const result = validateTemporalConsistency(existingOps, 'CREATE', newOp);
        expect(result.valid).toBe(false);
        expect(result.message).toContain('saldo de AAPL sería negativo');
    });

    it('forbids a sale if balance was negative at a previous point in timeline', () => {
        // Current: Compra 10 (Jan 1)
        // Add Compra 10 (Jan 10)
        // Try to add Venta 15 (Jan 5) -> Balance at Jan 5 would be 10 - 15 = -5 (Invalid)
        const timeline = [
            { id: '1', fecha: '2024-01-01', tipo: TipoOperacion.Compra, cantidad: 10, activoSymbol: 'AAPL' },
            { id: '2', fecha: '2024-01-10', tipo: TipoOperacion.Compra, cantidad: 10, activoSymbol: 'AAPL' },
        ];
        const newOp = { fecha: '2024-01-05', tipo: TipoOperacion.Venta, cantidad: 15, activoSymbol: 'AAPL' };
        const result = validateTemporalConsistency(timeline, 'CREATE', newOp);
        expect(result.valid).toBe(false);
    });

    it('correctly handles DELETE action', () => {
        // Removing a purchase that was needed for later sales
        const timeline = [
            { id: '1', fecha: '2024-01-01', tipo: TipoOperacion.Compra, cantidad: 10, activoSymbol: 'AAPL' },
            { id: '2', fecha: '2024-01-05', tipo: TipoOperacion.Venta, cantidad: 5, activoSymbol: 'AAPL' },
        ];
        // Delete the purchase (id: 1)
        const result = validateTemporalConsistency(timeline, 'DELETE', timeline[1], '1');
        expect(result.valid).toBe(false);
    });

    it('correctly handles EDIT action', () => {
        const timeline = [
            { id: '1', fecha: '2024-01-01', tipo: TipoOperacion.Compra, cantidad: 10, activoSymbol: 'AAPL' },
        ];
        // Edit purchase to be only 2 units, when there is a sale of 5 later
        const timelineWithSale = [
            ...timeline,
            { id: '2', fecha: '2024-01-05', tipo: TipoOperacion.Venta, cantidad: 5, activoSymbol: 'AAPL' },
        ];
        const editedOp = { id: '1', fecha: '2024-01-01', tipo: TipoOperacion.Compra, cantidad: 2, activoSymbol: 'AAPL' };
        const result = validateTemporalConsistency(timelineWithSale, 'EDIT', editedOp, '1');
        expect(result.valid).toBe(false);
    });
});
