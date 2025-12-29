import { render, screen, fireEvent } from '@testing-library/react';
import LoginPage from './page';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useLogin } from '@/hooks/useLogin';

vi.mock('@/hooks/useLogin');
vi.mock('next/link', () => ({
    default: ({ children }: any) => <a>{children}</a>,
}));
vi.mock('@/components/ui/FloatingMessage', () => ({
    default: () => null,
}));

describe('LoginPage', () => {
    const mockHandleSubmit = vi.fn((e) => e.preventDefault());
    const mockSetEmail = vi.fn();
    const mockSetPassword = vi.fn();

    beforeEach(() => {
        (useLogin as any).mockReturnValue({
            email: '', setEmail: mockSetEmail,
            password: '', setPassword: mockSetPassword,
            loading: false,
            fieldErrors: {},
            serverError: null,
            successMessage: null,
            handleSubmit: mockHandleSubmit,
            clearFieldError: vi.fn(),
        });
    });

    it('renders login form', () => {
        render(<LoginPage />);
        expect(screen.getByRole('heading', { name: 'Iniciar sesión' })).toBeInTheDocument();
        expect(screen.getByLabelText('Email')).toBeInTheDocument();
        expect(screen.getByLabelText('Contraseña')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Entrar' })).toBeInTheDocument();
    });

    it('handles input changes', () => {
        render(<LoginPage />);
        const emailInput = screen.getByLabelText('Email');
        fireEvent.change(emailInput, { target: { value: 'test@test.com' } });
        expect(mockSetEmail).toHaveBeenCalledWith('test@test.com');

        const passwordInput = screen.getByLabelText('Contraseña');
        fireEvent.change(passwordInput, { target: { value: 'password' } });
        expect(mockSetPassword).toHaveBeenCalledWith('password');
    });

    it('submits form', () => {
        render(<LoginPage />);
        const submitBtn = screen.getByRole('button', { name: 'Entrar' });
        fireEvent.click(submitBtn);
        expect(mockHandleSubmit).toHaveBeenCalled();
    });

    it('shows loading state', () => {
        (useLogin as any).mockReturnValue({
            ...((useLogin as any)()),
            loading: true
        });
        render(<LoginPage />);
        expect(screen.getByText('Ingresando...')).toBeInTheDocument();
        expect(screen.getByRole('button')).toBeDisabled();
    });

    it('shows field errors', () => {
        (useLogin as any).mockReturnValue({
            ...((useLogin as any)()),
            fieldErrors: { email: 'Invalid email' }
        });
        render(<LoginPage />);
        expect(screen.getByText('Invalid email')).toBeInTheDocument();
    });
});
