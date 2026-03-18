import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@/test/test-utils';
import LoginPage from '@/app/auth/login/page';
import { server } from '@/test/msw/server';
import { http, HttpResponse } from 'msw';

// Mock Next.js navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
  }),
  useSearchParams: () => ({
    get: vi.fn(),
  }),
}));

describe('LoginFlow Integration', () => {
  it('should complete the login process and show success message', async () => {
    // 1. Setup mock response for this specific test
    server.use(
      http.post('*/api/auth/login', () => {
        return HttpResponse.json({
          token: 'vaild-token',
          user: { id: 1, nombre: 'Agus Test', rol: 'INVERSOR' }
        });
      })
    );

    render(<LoginPage />);

    // 2. Fill the form
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/contraseña/i);
    const submitButton = screen.getByRole('button', { name: /entrar/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    // 3. Submit
    fireEvent.click(submitButton);

    // 4. Verify loading state (button text changes)
    expect(screen.getByText(/ingresando/i)).toBeInTheDocument();

    // 5. Verify success feedback
    await waitFor(() => {
      expect(screen.getByText(/inicio de sesión correcto/i)).toBeInTheDocument();
    });
  });

  it('should show error message on invalid credentials', async () => {
    // 1. Setup mock error response (Backend returns error)
    server.use(
      http.post('*/api/auth/login', () => {
        return new HttpResponse(
          JSON.stringify({ message: 'Email o contraseña incorrectos.' }), 
          { status: 401 }
        );
      })
    );

    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'wrong@example.com' } });
    fireEvent.change(screen.getByLabelText(/contraseña/i), { target: { value: 'wrongpass' } });
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

    // 2. Verify error message appears from the hook catch block
    await waitFor(() => {
      expect(screen.getByText(/email o contraseña incorrectos/i)).toBeInTheDocument();
    });
  });
});
