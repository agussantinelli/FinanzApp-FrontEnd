import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { TextEncoder, TextDecoder } from 'util';

Object.assign(global, { TextDecoder, TextEncoder });

Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
});

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

global.IntersectionObserver = IntersectionObserver as any;

global.requestAnimationFrame = vi.fn((callback) => setTimeout(callback, 0)) as unknown as (callback: FrameRequestCallback) => number;
global.cancelAnimationFrame = vi.fn((id) => clearTimeout(id));

global.cancelAnimationFrame = vi.fn((id) => clearTimeout(id));

import React from 'react';
React.useLayoutEffect = React.useEffect;
