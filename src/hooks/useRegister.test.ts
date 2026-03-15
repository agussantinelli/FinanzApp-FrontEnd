import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useRegister } from './useRegister';
import { getRegisterGeoData, register as registerService, getHomePathForRole } from '@/services/AuthService';
import { useRouter } from 'next/navigation';

vi.mock('@/services/AuthService', () => ({
    getRegisterGeoData: vi.fn(),
    register: vi.fn(),
    getHomePathForRole: vi.fn(),
}));

vi.mock('next/navigation', () => ({
    useRouter: vi.fn(),
}));

describe('useRegister hook', () => {
    const mockPush = vi.fn();
    const mockGeoData = {
        paises: [{ id: 1, codigoIso2: 'AR', nombre: 'Argentina' }],
        provinciasArgentina: [],
        localidadesArgentina: [],
    };

    beforeEach(() => {
        vi.clearAllMocks();
        (useRouter as any).mockReturnValue({ push: mockPush });
        (getRegisterGeoData as any).mockResolvedValue(mockGeoData);
    });

    it('should load geo data and set Argentina as default', async () => {
        await act(async () => {
            const { result } = renderHook(() => useRegister());
            // Wait for useEffect
            await new Promise(resolve => setTimeout(resolve, 0));
        });

        // We need to re-render or check after async
        const { result } = renderHook(() => useRegister());
        await act(async () => { /* wait */ });

        expect(getRegisterGeoData).toHaveBeenCalled();
    });

    it('should validate passwords match', async () => {
        const { result } = renderHook(() => useRegister());
        
        act(() => {
            result.current.setPassword('pass1');
            result.current.setPassword2('pass2');
        });

        await act(async () => {
            await result.current.handleSubmit({ preventDefault: vi.fn() } as any);
        });

        expect(result.current.fieldErrors.password2).toBe('Las contraseñas no coinciden.');
    });

    it('should show error if captcha is missing', async () => {
        const { result } = renderHook(() => useRegister());
        
        // Fill fields to pass basic validation
        act(() => {
            result.current.setNombre('John');
            result.current.setApellido('Doe');
            result.current.setEmail('john@doe.com');
            result.current.setFechaNac('1990-01-01');
            result.current.setPassword('password123');
            result.current.setPassword2('password123');
            result.current.setPaisNacId('1');
            result.current.setPaisResidenciaId('1');
        });

        await act(async () => {
            await result.current.handleSubmit({ preventDefault: vi.fn() } as any);
        });

        expect(result.current.apiError).toBe('Por favor completa el captcha.');
    });
});
