---
name: integration-testing
description: Guidelines for cross-layer testing (Hooks + UI + Services) using real logic and MSW for network interception.
---

# Integration Testing Skill

This skill defines how to implement and organize integration tests that validate the interaction between services, custom hooks, and UI components.

## Core Principle: "Real Logic, Mocked Network"
Unlike unit tests that mock functions, integration tests in FinanzApp use:
1.  **Real Services**: Calls to `src/services/` are executed.
2.  **Real Hooks**: Custom hooks in `src/hooks/` manage the actual state.
3.  **MSW (Mock Service Worker)**: Intercepts Axios requests at the network level to provide controlled JSON responses.

## Organization
All integration tests MUST be located in the global integration directory:
- **Path**: `src/test/integration/[module]/[Feature].test.tsx`

## Guidelines
1.  **Scope**: Test full business flows (e.g., Login -> Store Token -> Redirect).
2.  **No Manual Mocks**: Avoid `vi.mock()` for internal services or hooks; test their real interaction.
3.  **MSW Handlers**: Define shared handlers in `src/test/msw/handlers.ts` and use `server.use()` for test-specific overrides.
4.  **DOM Validation**: Use React Testing Library to verify that the UI updates correctly based on the real hook/service state.
5.  **Clean State**: Ensure `localStorage`, `sessionStorage`, and MSW handlers are cleared between tests.

## Example
```tsx
// src/test/integration/auth/LoginFlow.test.tsx
import { render, screen, fireEvent } from '@/test/test-utils';
import { server } from '@/test/msw/server';
import { http, HttpResponse } from 'msw';

it('should complete the login flow successfully', async () => {
  // 1. MSW intercepts the real service call
  server.use(
    http.post('*/api/auth/login', () => {
      return HttpResponse.json({ token: 'fake_jwt', user: { name: 'Agus' } });
    })
  );

  render(<LoginPage />);
  
  // 2. Interact with the real UI
  fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
  fireEvent.click(screen.getByRole('button', { name: /ingresar/i }));

  // 3. Verify real hook state change reflected in UI
  expect(await screen.findByText(/hola, agus/i)).toBeInTheDocument();
});
```
