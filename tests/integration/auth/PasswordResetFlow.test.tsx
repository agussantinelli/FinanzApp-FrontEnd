import { vi, describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@/test/test-utils';
import ForgotPasswordPage from '@/app/auth/forgot-password/page';
import ResetPasswordPage from '@/app/auth/reset-password/page';
import { server } from '@/test/msw/server';
import { http, HttpResponse } from 'msw';

// Mock navigation
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: mockPush,
        back: vi.fn(),
    }),
    useSearchParams: () => ({
        get: (param: string) => {
            if (param === 'token') return 'mock-token';
            if (param === 'email') return 'test@example.com';
            return null;
        }
    })
}));

describe('PasswordResetFlow Integration', () => {

    beforeEach(() => {
        vi.clearAllMocks();
        server.use(
            http.post('**/api/auth/reset-password-request', () => HttpResponse.json({ success: true })),
            http.post('**/api/auth/reset-password-confirm', () => HttpResponse.json({ success: true }))
        );
    });

    describe('Forgot Password', () => {
        it('should send reset request and show success message', async () => {
            render(<ForgotPasswordPage />);

            const emailInput = screen.getByLabelText(/Email/i);
            fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

            const submitButton = screen.getByRole('button', { name: /Enviar Instrucciones/i });
            fireEvent.click(submitButton);

            await screen.findByText(/Si el correo existe, recibirás un enlace/i);
        });
    });

    describe('Reset Password', () => {
        it('should confirm new password and redirect to login', async () => {
            render(<ResetPasswordPage />);

            const passwordInput = screen.getByLabelText(/^Nueva Contraseña/i);
            const confirmInput = screen.getByLabelText(/Confirmar Contraseña/i);

            fireEvent.change(passwordInput, { target: { value: 'NewPassword123!' } });
            fireEvent.change(confirmInput, { target: { value: 'NewPassword123!' } });

            const submitButton = screen.getByRole('button', { name: /Guardar Nueva Contraseña/i });
            fireEvent.click(submitButton);

            await screen.findByText(/Contraseña restablecida correctamente/i);
            
            await waitFor(() => {
                expect(mockPush).toHaveBeenCalledWith('/auth/login');
            }, { timeout: 3000 });
        });

        it('should show error if passwords do not match', async () => {
            render(<ResetPasswordPage />);

            const passwordInput = screen.getByLabelText(/^Nueva Contraseña/i);
            const confirmInput = screen.getByLabelText(/Confirmar Contraseña/i);

            fireEvent.change(passwordInput, { target: { value: 'Pass1' } });
            fireEvent.change(confirmInput, { target: { value: 'Pass2' } });

            const submitButton = screen.getByRole('button', { name: /Guardar Nueva Contraseña/i });
            fireEvent.click(submitButton);

            await screen.findByText(/Las contraseñas no coinciden/i);
        });
    });
});
