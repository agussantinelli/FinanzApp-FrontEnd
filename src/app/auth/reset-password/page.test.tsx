import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ResetPasswordPage from './page';
import { resetPasswordConfirm } from '@/services/AuthService';
import { useSearchParams, useRouter } from 'next/navigation';

// Mock next/navigation
vi.mock('next/navigation', () => ({
    useSearchParams: vi.fn(),
    useRouter: vi.fn(),
}));

// Mock services
vi.mock('@/services/AuthService', () => ({
    resetPasswordConfirm: vi.fn(),
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
    },
}));

describe('ResetPasswordPage', () => {
    const mockRouter = {
        push: vi.fn(),
    };

    beforeEach(() => {
        vi.clearAllMocks();
        (useRouter as any).mockReturnValue(mockRouter);
    });

    it('renders error message if token or email is missing', () => {
        (useSearchParams as any).mockReturnValue({
            get: vi.fn().mockReturnValue(null),
        });
        render(<ResetPasswordPage />);
        expect(screen.getByText('Enlace de restablecimiento inválido.')).toBeDefined();
    });

    it('renders correctly with token and email', () => {
        (useSearchParams as any).mockReturnValue({
            get: vi.fn((key) => (key === 'token' ? 'test-token' : 'test@example.com')),
        });
        render(<ResetPasswordPage />);
        expect(screen.getByRole('heading', { name: /Nueva Contraseña/i })).toBeDefined();
        expect(screen.getByLabelText(/Nueva Contraseña/i)).toBeDefined();
        expect(screen.getByLabelText(/Confirmar Contraseña/i)).toBeDefined();
    });

    it('shows error if passwords do not match', async () => {
        (useSearchParams as any).mockReturnValue({
            get: vi.fn((key) => (key === 'token' ? 'test-token' : 'test@example.com')),
        });
        render(<ResetPasswordPage />);
        
        fireEvent.change(screen.getByLabelText(/Nueva Contraseña/i), { target: { value: 'password123' } });
        fireEvent.change(screen.getByLabelText(/Confirmar Contraseña/i), { target: { value: 'password456' } });
        fireEvent.click(screen.getByRole('button', { name: /Guardar Nueva Contraseña/i }));

        await waitFor(() => {
            expect(screen.getByTestId('floating-message')).toHaveAttribute('data-severity', 'error');
            expect(screen.getByText('Las contraseñas no coinciden')).toBeDefined();
        });
    });

    it('submits correctly and redirects on success', async () => {
        vi.useFakeTimers();
        (useSearchParams as any).mockReturnValue({
            get: vi.fn((key) => (key === 'token' ? 'test-token' : 'test@example.com')),
        });
        (resetPasswordConfirm as any).mockResolvedValue({});
        
        render(<ResetPasswordPage />);
        
        fireEvent.change(screen.getByLabelText(/Nueva Contraseña/i), { target: { value: 'password123' } });
        fireEvent.change(screen.getByLabelText(/Confirmar Contraseña/i), { target: { value: 'password123' } });
        fireEvent.click(screen.getByRole('button', { name: /Guardar Nueva Contraseña/i }));

        await waitFor(() => {
            expect(resetPasswordConfirm).toHaveBeenCalledWith({
                email: 'test@example.com',
                token: 'test-token',
                newPassword: 'password123',
            });
            expect(screen.getByTestId('floating-message')).toHaveAttribute('data-severity', 'success');
        });

        vi.runAllTimers();
        expect(mockRouter.push).toHaveBeenCalledWith('/auth/login');
        vi.useRealTimers();
    });

    it('handles server error on submission', async () => {
        (useSearchParams as any).mockReturnValue({
            get: vi.fn((key) => (key === 'token' ? 'test-token' : 'test@example.com')),
        });
        (resetPasswordConfirm as any).mockRejectedValue({
            response: { data: { message: 'Expired token' } }
        });
        
        render(<ResetPasswordPage />);
        
        fireEvent.change(screen.getByLabelText(/Nueva Contraseña/i), { target: { value: 'password123' } });
        fireEvent.change(screen.getByLabelText(/Confirmar Contraseña/i), { target: { value: 'password123' } });
        fireEvent.click(screen.getByRole('button', { name: /Guardar Nueva Contraseña/i }));

        await waitFor(() => {
            expect(screen.getByTestId('floating-message')).toHaveAttribute('data-severity', 'error');
            expect(screen.getByText('Expired token')).toBeDefined();
        });
    });
});
