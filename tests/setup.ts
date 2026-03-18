import '@testing-library/jest-dom';
import { vi, beforeAll, afterEach, afterAll } from 'vitest';
import { TextEncoder, TextDecoder } from 'util';
import { server } from './msw/server';
import React from 'react';

// Force API URL for tests
process.env.NEXT_PUBLIC_API_URL = 'http://localhost';

// Mock AuthService globally for RoleGuards and general usage
vi.mock('@/services/AuthService', async (importOriginal) => {
    const original = await importOriginal<typeof import('@/services/AuthService')>();
    return {
        ...original,
        hasRole: vi.fn((roles) => {
            // By default, if we are in a test that mocks useAuth, we probably want this to pass.
            // We can check if any roles are required. If not, true.
            if (!roles || roles.length === 0) return true;
            // Otherwise, we'll try to get the context from the test or just return true for simplicity in integration tests
            // unless the test specifically overrides this mock.
            return true;
        }),
        getCurrentUser: vi.fn(() => ({
            id: 1,
            nombre: 'Agus',
            rol: 'Experto', // Default for expert tests, others can override if needed
        })),
    };
});

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

global.requestAnimationFrame = vi.fn((callback) => setTimeout(callback, 0)) as unknown as (callback: FrameRequestCallback) => number;
global.cancelAnimationFrame = vi.fn((id) => clearTimeout(id));

// Mock Canvas for Chart.js
if (typeof HTMLCanvasElement !== 'undefined') {
    (HTMLCanvasElement.prototype as any).getContext = vi.fn(() => ({
        measureText: vi.fn(() => ({ width: 0 })),
        fillRect: vi.fn(),
        clearRect: vi.fn(),
        getImageData: vi.fn(() => ({ data: new Uint8ClampedArray() })),
        putImageData: vi.fn(),
        createImageData: vi.fn(() => ({ data: new Uint8ClampedArray() })),
        setTransform: vi.fn(),
        drawWidget: vi.fn(),
        save: vi.fn(),
        restore: vi.fn(),
        beginPath: vi.fn(),
        moveTo: vi.fn(),
        lineTo: vi.fn(),
        closePath: vi.fn(),
        stroke: vi.fn(),
        translate: vi.fn(),
        scale: vi.fn(),
        rotate: vi.fn(),
        arc: vi.fn(),
        fill: vi.fn(),
        createLinearGradient: vi.fn(() => ({ addColorStop: vi.fn() })),
        createPattern: vi.fn(),
        drawImage: vi.fn(),
    }));
}

React.useLayoutEffect = React.useEffect;

// MSW Lifecycle
beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
