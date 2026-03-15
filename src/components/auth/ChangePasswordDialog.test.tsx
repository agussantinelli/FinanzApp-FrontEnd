import { render, screen, fireEvent, waitFor, act } from '@/test/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ChangePasswordDialog from './ChangePasswordDialog';
import { changePassword } from '@/services/AuthService';

vi.mock('@/services/AuthService', () => ({
    changePassword: vi.fn(),
}));

describe('ChangePasswordDialog', () => {
    const onClose = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders correctly when open', () => {
        render(<ChangePasswordDialog open={true} onClose={onClose} />);
        expect(screen.getByText('Cambiar Contraseña')).toBeInTheDocument();
        expect(screen.getByLabelText(/Contraseña Actual/i)).toBeInTheDocument();
    });

    it('shows error if passwords do not match', async () => {
        render(<ChangePasswordDialog open={true} onClose={onClose} />);

        fireEvent.change(screen.getByLabelText(/Contraseña Actual/i), { target: { value: 'oldpass' } });
        // Usamos ^ para indicar que el texto debe EMPEZAR con "Nueva Contraseña"
        fireEvent.change(screen.getByLabelText(/^Nueva Contraseña/i), { target: { value: 'newpass1' } });
        fireEvent.change(screen.getByLabelText(/Confirmar Nueva Contraseña/i), { target: { value: 'newpass2' } });

        await act(async () => {
            fireEvent.click(screen.getByRole('button', { name: /Cambiar/i }));
        });

        expect(await screen.findByText('Las contraseñas nuevas no coinciden.')).toBeInTheDocument();
        expect(changePassword).not.toHaveBeenCalled();
    });

    it('calls changePassword and shows success on valid submit', async () => {
        (changePassword as any).mockResolvedValue({});
        render(<ChangePasswordDialog open={true} onClose={onClose} />);

        fireEvent.change(screen.getByLabelText(/Contraseña Actual/i), { target: { value: 'oldpass' } });
        fireEvent.change(screen.getByLabelText(/^Nueva Contraseña/i), { target: { value: 'newpass' } });
        fireEvent.change(screen.getByLabelText(/Confirmar Nueva Contraseña/i), { target: { value: 'newpass' } });

        await act(async () => {
            fireEvent.click(screen.getByRole('button', { name: /Cambiar/i }));
        });

        await waitFor(() => {
            expect(changePassword).toHaveBeenCalledWith({ currentPassword: 'oldpass', newPassword: 'newpass' });
        });
        expect(await screen.findByText('Contraseña cambiada con éxito.')).toBeInTheDocument();
    });

    it('handles api error correctly', async () => {
        (changePassword as any).mockRejectedValue({
            response: { data: { message: 'Invalid old password' } }
        });
        render(<ChangePasswordDialog open={true} onClose={onClose} />);

        fireEvent.change(screen.getByLabelText(/Contraseña Actual/i), { target: { value: 'wrong' } });
        fireEvent.change(screen.getByLabelText(/^Nueva Contraseña/i), { target: { value: 'newpass' } });
        fireEvent.change(screen.getByLabelText(/Confirmar Nueva Contraseña/i), { target: { value: 'newpass' } });

        fireEvent.click(screen.getByRole('button', { name: /Cambiar/i }));

        expect(await screen.findByText('Invalid old password')).toBeInTheDocument();
    });
});