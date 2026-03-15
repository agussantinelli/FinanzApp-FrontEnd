import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ForgotPasswordPage from './page';
import { resetPasswordRequest } from '@/services/AuthService';

// Mock services
vi.mock('@/services/AuthService', () => ({
    resetPasswordRequest: vi.fn(),
}));

// Mock components
vi.mock('@/components/ui/FloatingMessage', () => ({
    default: ({ open, message, severity }: any) => 
        open ? <div data-testid="floating-message" data-severity={severity}>{message}</div> : null,
}));

// Mock styles
vi.mock('../login/styles/Login.module.css', () => ({
    default: {
        container: 'container',
        card: 'card',
        title: 'title',
        subtitle: 'subtitle',
        inputStack: 'inputStack',
        submitButton: 'submitButton',
        footer: 'footer',
    },
}));

describe('ForgotPasswordPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders correctly', () => {
        render(<ForgotPasswordPage />);
        expect(screen.getByText('Recuperar Contraseña')).toBeDefined();
        expect(screen.getByLabelText(/Email/i)).toBeDefined();
        expect(screen.getByRole('button', { name: /Enviar Instrucciones/i })).toBeDefined();
    });

    it('updates email on change', () => {
        render(<ForgotPasswordPage />);
        const input = screen.getByLabelText(/Email/i) as HTMLInputElement;
        fireEvent.change(input, { target: { value: 'test@example.com' } });
        expect(input.value).toBe('test@example.com');
    });

    it('submits correctly and shows success message', async () => {
        (resetPasswordRequest as any).mockResolvedValue({});
        render(<ForgotPasswordPage />);
        
        const input = screen.getByLabelText(/Email/i);
        const button = screen.getByRole('button', { name: /Enviar Instrucciones/i });

        fireEvent.change(input, { target: { value: 'test@example.com' } });
        fireEvent.click(button);

        expect(button).toBeDisabled();
        expect(screen.getByText('Enviando...')).toBeDefined();

        await waitFor(() => {
            expect(resetPasswordRequest).toHaveBeenCalledWith({ email: 'test@example.com' });
            expect(screen.getByTestId('floating-message')).toHaveAttribute('data-severity', 'success');
            expect(screen.getByText(/Si el correo existe/i)).toBeDefined();
        });
    });

    it('handles error on submission', async () => {
        (resetPasswordRequest as any).mockRejectedValue(new Error('API Error'));
        render(<ForgotPasswordPage />);
        
        const input = screen.getByLabelText(/Email/i);
        const button = screen.getByRole('button', { name: /Enviar Instrucciones/i });

        fireEvent.change(input, { target: { value: 'test@example.com' } });
        fireEvent.click(button);

        await waitFor(() => {
            expect(screen.getByTestId('floating-message')).toHaveAttribute('data-severity', 'error');
            expect(screen.getByText(/Ocurrió un error/i)).toBeDefined();
        });
    });

    it('button is disabled if email is empty', () => {
        render(<ForgotPasswordPage />);
        const button = screen.getByRole('button', { name: /Enviar Instrucciones/i });
        expect(button).toBeDisabled();
    });
});
