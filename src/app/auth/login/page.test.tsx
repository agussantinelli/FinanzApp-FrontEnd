import { render, screen, fireEvent, waitFor } from '@/test/test-utils';
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





    it('submits form', () => {
        render(<LoginPage />);
        const submitBtn = screen.getByRole('button', { name: 'Entrar' });
        fireEvent.click(submitBtn);
        expect(mockHandleSubmit).toHaveBeenCalled();
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
