import { describe, it, expect } from 'vitest';
import { getAvatarColor } from '../icons-appearance';

describe('icons-appearance', () => {
    it('should return correct color for Accion', () => {
        expect(getAvatarColor('accion')).toBe("#0400ffff");
        expect(getAvatarColor('acciones')).toBe("#0400ffff");
    });

    it('should return correct color for Cedear', () => {
        expect(getAvatarColor('cedear')).toBe("#a73bffff");
    });

    it('should return correct color for Cripto', () => {
        expect(getAvatarColor('cripto')).toBe("#f14ae4ff");
        expect(getAvatarColor('crypto')).toBe("#f14ae4ff");
    });

    it('should return correct color for indices', () => {
        expect(getAvatarColor('indices')).toBe("#ff4545ff");
        expect(getAvatarColor('índice')).toBe("#ff4545ff");
    });

    it('should return default color for unknown types', () => {
        expect(getAvatarColor('unknown')).toBe("#757575");
    });

    it('should handle case-insensitivity', () => {
        expect(getAvatarColor('ACCION')).toBe("#0400ffff");
    });
});
