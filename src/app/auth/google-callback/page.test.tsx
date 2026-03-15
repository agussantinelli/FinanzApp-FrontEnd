import { render } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import GoogleCallbackPage from './page';

describe('GoogleCallbackPage', () => {
    let originalLocation: Location;
    let originalOpener: any;
    let originalClose: any;

    beforeEach(() => {
        vi.clearAllMocks();
        originalLocation = window.location;
        originalOpener = window.opener;
        originalClose = window.close;

        // Mock window.location using stubGlobal to avoid type errors
        vi.stubGlobal('location', {
            ...originalLocation,
            hash: '',
            origin: 'http://localhost:3000',
            href: '',
        });

        // Mock window.opener and window.close
        window.opener = {
            postMessage: vi.fn(),
        };
        window.close = vi.fn();
    });

    afterEach(() => {
        vi.unstubAllGlobals();
        window.opener = originalOpener;
        window.close = originalClose;
    });

    it('sends GOOGLE_LOGIN_SUCCESS when id_token is present', () => {
        window.location.hash = '#id_token=test-token';
        render(<GoogleCallbackPage />);

        expect(window.opener.postMessage).toHaveBeenCalledWith(
            { type: "GOOGLE_LOGIN_SUCCESS", idToken: "test-token" },
            "http://localhost:3000"
        );
        expect(window.close).toHaveBeenCalled();
    });

    it('sends GOOGLE_LOGIN_ERROR when error is present', () => {
        window.location.hash = '#error=access_denied';
        render(<GoogleCallbackPage />);

        expect(window.opener.postMessage).toHaveBeenCalledWith(
            { type: "GOOGLE_LOGIN_ERROR", error: "access_denied" },
            "http://localhost:3000"
        );
        expect(window.close).toHaveBeenCalled();
    });

    it('sends GOOGLE_LOGIN_ERROR when no token is received', () => {
        window.location.hash = '#something_else=value';
        render(<GoogleCallbackPage />);

        expect(window.opener.postMessage).toHaveBeenCalledWith(
            { type: "GOOGLE_LOGIN_ERROR", error: "No token received" },
            "http://localhost:3000"
        );
        expect(window.close).toHaveBeenCalled();
    });

    it('redirects to login if no window.opener is present', () => {
        window.opener = null;
        render(<GoogleCallbackPage />);

        expect(window.location.href).toBe('/auth/login');
    });
});
