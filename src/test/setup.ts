import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { TextEncoder, TextDecoder } from 'util';

// Polyfills for JSDOM settings
Object.assign(global, { TextDecoder, TextEncoder });

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(), // deprecated
        removeListener: vi.fn(), // deprecated
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
});

// Mocks de APIs del navegador
class ResizeObserver {
    observe() { }
    unobserve() { }
    disconnect() { }
}
global.ResizeObserver = ResizeObserver;

class IntersectionObserver {
    constructor() { }
    observe() { }
    unobserve() { }
    disconnect() { }
    takeRecords() { return []; }
    root = null;
    rootMargin = '';
    thresholds = [];
}
global.IntersectionObserver = IntersectionObserver as any;

// Mock requestAnimationFrame
global.requestAnimationFrame = vi.fn((callback) => setTimeout(callback, 0)) as unknown as (callback: FrameRequestCallback) => number;
global.cancelAnimationFrame = vi.fn((id) => clearTimeout(id));

// Suppress useLayoutEffect warning in JSDOM
import React from 'react';
React.useLayoutEffect = React.useEffect;
