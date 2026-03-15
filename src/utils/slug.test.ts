import { describe, it, expect } from 'vitest';
import { createSlug } from './slug';

describe('slug utility', () => {
    it('converts text to lowercase and replaces spaces with dashes', () => {
        expect(createSlug('Hello World')).toBe('hello-world');
    });

    it('removes special characters and accents', () => {
        expect(createSlug('Acción y Reacción!!')).toBe('accion-y-reaccion');
    });

    it('handles multiple spaces and leading/trailing whitespace', () => {
        expect(createSlug('  multiple   spaces  ')).toBe('multiple-spaces');
    });

    it('removes non-word characters except dashes', () => {
        expect(createSlug('Check this out @ 2024')).toBe('check-this-out-2024');
    });

    it('collapses multiple dashes into one', () => {
        expect(createSlug('hello---world')).toBe('hello-world');
    });
});
