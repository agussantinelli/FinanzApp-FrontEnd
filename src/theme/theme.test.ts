import { describe, it, expect } from 'vitest';
import theme from './theme';
import { colors } from './design-tokens';

describe('theme configuration', () => {
    it('should have dark mode enabled', () => {
        expect(theme.palette.mode).toBe('dark');
    });

    it('should use design token primary color', () => {
        expect(theme.palette.primary.main).toBe(colors.primary);
    });

    it('should have custom properties defined', () => {
        expect(theme.custom).toBeDefined();
        expect(theme.custom.paperBg).toBe(colors.paperBgTranslucent);
        expect(theme.custom.borderColor).toBe(colors.primary);
    });

    it('should have correct borderRadius from tokens', () => {
        expect(theme.shape.borderRadius).toBe(12);
    });
});
