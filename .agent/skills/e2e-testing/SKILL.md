---
name: e2e-testing
description: Guidelines for end-to-end testing in FinanzApp using Playwright.
---

# E2E Testing Skill

This skill defines the standards for End-to-End (E2E) testing to ensure critical user flows are fully functional across the entire stack.

## Tools
- **Primary Tool**: **Playwright** is the official tool for E2E testing in this project.
- **Alternative**: Cypress may be used only if explicitly requested by the USER for specific scenarios.

## Organization
All E2E tests MUST be located in the root `tests/` directory, specifically within the `e2e` subdirectory:
- **Path**: `tests/e2e/[flow_name].spec.ts`

## Guidelines
1.  **Critical Flows**: Prioritize testing high-value paths: Login, Portfolio Management, Asset Search, and Asset Purchase.
2.  **Environment**: E2E tests run against a live (or staging) environment, including a real database and backend.
3.  **Headed vs Headless**: Use `pnpm test:e2e` to run tests. By default, it runs in headed mode for debugging.
4.  **No Mocking**: Unlike integration tests, E2E tests should avoid mocking API responses to ensure the real integration works.
5.  **Clean up**: Tests should ideally handle their own data cleanup or use test accounts that don't interfere with real data.

## Example (Playwright)
```typescript
import { test, expect } from '@playwright/test';

test('login and check dashboard', async ({ page }) => {
  await page.goto('/auth/login');
  await page.fill('input[name="email"]', 'user@example.com');
  await page.fill('input[name="password"]', 'password123');
  await page.click('button[type="submit"]');
  
  await expect(page).toHaveURL('/dashboard-inversor');
  await expect(page.locator('h4')).toContainText('Hola');
});
```
