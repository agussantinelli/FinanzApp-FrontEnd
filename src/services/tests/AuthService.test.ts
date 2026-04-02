import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { 
    setAuthSession, 
    clearAuthSession, 
    getCurrentUser, 
    verifySession,
    hasRole,
    getRegisterGeoData,
    login,
    register,
    googleLogin,
    completeProfile,
    setInitialPassword,
    changePassword,
    resetPasswordRequest,
    resetPasswordConfirm,
    getHomePathForRole
} from '../AuthService';
import { http } from '@/lib/http';
import { RolUsuario } from '@/types/Usuario';

vi.mock('@/lib/http', () => ({
    http: {
        get: vi.fn(),
        post: vi.fn(),
    }
}));

vi.mock('@/lib/activos-cache', () => ({
    clearCache: vi.fn(),
}));

describe('AuthService', () => {
    const mockStorage: Record<string, string> = {};

    beforeEach(() => {
        vi.clearAllMocks();
        Object.keys(mockStorage).forEach(k => delete mockStorage[k]);
        
        // Mock sessionStorage
        global.sessionStorage = {
            getItem: vi.fn((key) => mockStorage[key] || null),
            setItem: vi.fn((key, value) => { mockStorage[key] = value; }),
            clear: vi.fn(() => { Object.keys(mockStorage).forEach(k => delete mockStorage[k]); }),
            removeItem: vi.fn((key) => { delete mockStorage[key]; }),
            length: 0,
            key: vi.fn(),
        } as any;

        // Mock dispatchEvent
        global.dispatchEvent = vi.fn();
    });

    it('setAuthSession stores token and user in sessionStorage', () => {
        const mockResp = {
            token: 't123',
            personaId: 'u1',
            nombre: 'Juan',
            rol: 'Inversor'
        } as any;

        setAuthSession(mockResp);

        expect(sessionStorage.setItem).toHaveBeenCalledWith('fa_token', 't123');
        const storedUser = JSON.parse(mockStorage['fa_user']);
        expect(storedUser.nombre).toBe('Juan');
        expect(global.dispatchEvent).toHaveBeenCalledWith(expect.any(Event));
    });

    it('clearAuthSession clears storage and cache', () => {
        clearAuthSession();
        expect(sessionStorage.clear).toHaveBeenCalled();
        expect(global.dispatchEvent).toHaveBeenCalled();
    });

    it('getCurrentUser returns parsed user from storage', () => {
        const user = { id: '1', nombre: 'Test' };
        mockStorage['fa_user'] = JSON.stringify(user);

        const result = getCurrentUser();
        expect(result).toEqual(user);
    });

    it('verifySession calls correct dashboard based on role', async () => {
        mockStorage['fa_user'] = JSON.stringify({ rol: RolUsuario.Admin });
        (http.get as any).mockResolvedValue({});

        await verifySession();
        expect(http.get).toHaveBeenCalledWith('/api/dashboard/admin/stats');
    });

    it('hasRole returns true if role matches', () => {
        mockStorage['fa_user'] = JSON.stringify({ rol: RolUsuario.Experto });
        expect(hasRole([RolUsuario.Experto, RolUsuario.Admin])).toBe(true);
        expect(hasRole([RolUsuario.Inversor])).toBe(false);
    });

    it('login calls post and sets session', async () => {
        const mockResp = { token: 'tk', nombre: 'Log' };
        (http.post as any).mockResolvedValue({ data: mockResp });

        const result = await login({ email: 'e', password: 'p' });
        expect(http.post).toHaveBeenCalledWith('/api/auth/login', { email: 'e', password: 'p' });
        expect(sessionStorage.setItem).toHaveBeenCalledWith('fa_token', 'tk');
        expect(result).toEqual(mockResp);
    });

    it('googleLogin calls post and sets session', async () => {
        const mockResp = { token: 'tk-goog' };
        (http.post as any).mockResolvedValue({ data: mockResp });

        await googleLogin('token-id');
        expect(http.post).toHaveBeenCalledWith('/api/auth/google', { idToken: 'token-id' });
        expect(sessionStorage.setItem).toHaveBeenCalledWith('fa_token', 'tk-goog');
    });

    it('getHomePathForRole returns correct paths', () => {
        expect(getHomePathForRole('Admin')).toBe('/dashboard-admin');
        expect(getHomePathForRole('Experto')).toBe('/dashboard-experto');
        expect(getHomePathForRole('Inversor')).toBe('/dashboard-inversor');
        expect(getHomePathForRole(null)).toBe('/dashboard-inversor');
    });

    it('resetPasswordConfirm calls post', async () => {
        (http.post as any).mockResolvedValue({});
        await resetPasswordConfirm({ email: 'e', token: 't', newPassword: 'p' });
        expect(http.post).toHaveBeenCalledWith('/api/auth/reset-password-confirm', expect.any(Object));
    });
});
