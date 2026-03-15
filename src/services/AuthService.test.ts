import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
    setAuthSession, 
    clearAuthSession, 
    getCurrentUser, 
    hasRole, 
    getHomePathForRole,
    login,
    clearAuthSession as clearAuthMock
} from './AuthService';
import { http } from '@/lib/http';
import { RolUsuario } from '@/types/Usuario';

// Mock http client
vi.mock('@/lib/http', () => ({
    http: {
        get: vi.fn(),
        post: vi.fn(),
    }
}));

// Mock activos-cache
vi.mock('@/lib/activos-cache', () => ({
    clearCache: vi.fn(),
}));

describe('AuthService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        sessionStorage.clear();
    });

    describe('Session Management', () => {
        it('setAuthSession stores user data in sessionStorage', () => {
            const mockResp = {
                personaId: 1,
                nombre: 'Agus',
                apellido: 'Test',
                email: 'test@test.com',
                token: 'fake-token',
                rol: RolUsuario.Inversor,
                expiraUtc: '2024-01-01',
                perfilCompletado: true,
                tieneContrasenaConfigurada: true
            };

            setAuthSession(mockResp as any);

            expect(sessionStorage.getItem('fa_token')).toBe('fake-token');
            const storedUser = JSON.parse(sessionStorage.getItem('fa_user')!);
            expect(storedUser.nombre).toBe('Agus');
            expect(storedUser.rol).toBe(RolUsuario.Inversor);
        });

        it('clearAuthSession clears sessionStorage', () => {
            sessionStorage.setItem('fa_token', 'token');
            clearAuthSession();
            expect(sessionStorage.getItem('fa_token')).toBeNull();
        });

        it('getCurrentUser retrieves user from sessionStorage', () => {
            const user = { nombre: 'Agus', rol: 'Admin' };
            sessionStorage.setItem('fa_user', JSON.stringify(user));
            expect(getCurrentUser()).toEqual(user);
        });
    });

    describe('Authorization', () => {
        it('hasRole returns true if user has required role', () => {
            sessionStorage.setItem('fa_user', JSON.stringify({ rol: RolUsuario.Admin }));
            expect(hasRole([RolUsuario.Admin])).toBe(true);
            expect(hasRole([RolUsuario.Inversor])).toBe(false);
        });

        it('getHomePathForRole returns correct paths', () => {
            expect(getHomePathForRole('Admin')).toBe('/dashboard-admin');
            expect(getHomePathForRole('Experto')).toBe('/dashboard-experto');
            expect(getHomePathForRole('Inversor')).toBe('/dashboard-inversor');
            expect(getHomePathForRole(null)).toBe('/dashboard-inversor');
        });
    });

    describe('API Actions', () => {
        it('login calls API and sets session', async () => {
            const mockData = { email: 'test@test.com', password: 'password' };
            const mockResp = { data: { token: 't', nombre: 'Agus' } };
            (http.post as any).mockResolvedValue(mockResp);

            const result = await login(mockData);

            expect(http.post).toHaveBeenCalledWith('/api/auth/login', mockData);
            expect(result).toEqual(mockResp.data);
            expect(sessionStorage.getItem('fa_token')).toBe('t');
        });
    });
});
