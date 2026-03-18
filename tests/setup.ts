import '@testing-library/jest-dom';
import { vi, beforeAll, afterEach, afterAll } from 'vitest';
import { TextEncoder, TextDecoder } from 'util';
import { server } from './msw/server';
import React from 'react';

// Force API URL for tests
process.env.NEXT_PUBLIC_API_URL = 'http://localhost';

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

// Mock window.location to prevent "Not implemented: navigation" error in JSDOM
const originalLocation = window.location;
delete (window as any).location;
window.location = {
    ...originalLocation,
    href: 'http://localhost/',
    origin: 'http://localhost',
    pathname: '/',
    assign: vi.fn(),
    replace: vi.fn(),
} as any;

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

React.useLayoutEffect = React.useEffect;

// MSW Lifecycle
beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
