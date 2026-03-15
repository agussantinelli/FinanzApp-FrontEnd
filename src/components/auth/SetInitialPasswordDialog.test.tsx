import { render, screen, fireEvent, waitFor, act } from '@/test/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import SetInitialPasswordDialog from './SetInitialPasswordDialog';
import { setInitialPassword, getCurrentUser } from '@/services/AuthService';

vi.mock('@/services/AuthService', () => ({
    setInitialPassword: vi.fn(),
    getCurrentUser: vi.fn(),
}));

describe('SetInitialPasswordDialog', () => {
    const onClose = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        // Mock sessionStorage
        const store: Record<string, string> = {};
        vi.stubGlobal('sessionStorage', {
            getItem: (key: string) => store[key] || null,
            setItem: (key: string, val: string) => store[key] = val,
        });
    });

    it('renders correctly when open', () => {
        render(<SetInitialPasswordDialog open={true} onClose={onClose} />);
        expect(screen.getByText('Establecer Contraseña')).toBeInTheDocument();
    });

    it('validates password length', async () => {
        render(<SetInitialPasswordDialog open={true} onClose={onClose} />);
        
        fireEvent.change(screen.getByLabelText(/Nueva Contraseña/i), { target: { value: '123' } });
        fireEvent.change(screen.getByLabelText(/Confirmar Contraseña/i), { target: { value: '123' } });
        
        await act(async () => {
            fireEvent.click(screen.getByText('Guardar'));
        });

        expect(await screen.findByText(/al menos 6 caracteres/)).toBeInTheDocument();
        expect(setInitialPassword).not.toHaveBeenCalled();
    });

    it('calls setInitialPassword and updates user state on success', async () => {
        (setInitialPassword as any).mockResolvedValue({});
        const mockUser = { id: 'u1', tieneContrasenaConfigurada: false };
        (getCurrentUser as any).mockReturnValue(mockUser);
        
        const dispatchSpy = vi.spyOn(window, 'dispatchEvent');

        render(<SetInitialPasswordDialog open={true} onClose={onClose} />);
        
        fireEvent.change(screen.getByLabelText(/Nueva Contraseña/i), { target: { value: 'newpassword' } });
        fireEvent.change(screen.getByLabelText(/Confirmar Contraseña/i), { target: { value: 'newpassword' } });
        
        await act(async () => {
            fireEvent.click(screen.getByText('Guardar'));
        });

        await waitFor(() => {
            expect(setInitialPassword).toHaveBeenCalledWith({ newPassword: 'newpassword' });
        });
        
        expect(await screen.findByText(/establecida con éxito/)).toBeInTheDocument();
        
        const storedUser = JSON.parse(sessionStorage.getItem('fa_user')!);
        expect(storedUser.tieneContrasenaConfigurada).toBe(true);
        expect(dispatchSpy).toHaveBeenCalledWith(expect.objectContaining({ type: 'fa-auth-changed' }));
    });
});
