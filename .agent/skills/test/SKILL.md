---
name: test
description: Guidelines for frontend component and E2E testing in FinanzApp.
---

# Testing (FrontEnd)

## Context
Quality assurance in the frontend involves checking both individual component logic and the overall user flow using Vitest and Playwright.

## 📂 Test Organization

### 1. Unit & Integration Tests (Vitest)
Unit tests for logic, hooks, and services MUST follow the nested `tests/` pattern:
- **Location**: `src/[module]/tests/[Name].test.ts(x)`
- **Rule**: Every logic file needs a corresponding test (see `test-enforcement` skill).
- **Exception**: `src/app/` tests remain side-by-side with the `page.tsx` or `layout.tsx`.

### 2. Integration Tests (Cross-Layer)
- **Location**: `tests/integration/[module]/[Feature].test.tsx` (see `integration-testing` skill).

### 3. E2E Tests (Playwright)
- **Location**: `tests/e2e/[Feature].spec.ts` (see `e2e-testing` skill).

## 🛠️ General Guidelines
1. **Component Testing**: Use Vitest + React Testing Library for unit testing UI components and helper functions.
2. **E2E Testing**: Use Playwright for full-flow tests.
3. **Accessibility**: Run `axe` or similar tools regularly to ensure WCAG compliance (see `accessibility` skill).
4. **Mocking**: Use Vitest mocks or MSW (Mock Service Worker) to mock API responses during development/testing.
5. **Naming**: Use `.test.ts(x)` for unit/integration and `.spec.ts` for E2E.
