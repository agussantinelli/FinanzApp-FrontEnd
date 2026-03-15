---
name: test
description: Guidelines for frontend component and E2E testing in FinanzApp.
---

# Testing (FrontEnd)

## Context
Quality assurance in the frontend involves checking both individual component logic and the overall user flow using Vitest and Playwright.

## Guidelines
1. **Component Testing**: Use Vitest + React Testing Library for unit testing UI components and helper functions.
2. **E2E Testing**: Use Playwright for full-flow tests.
3. **Accessibility**: Run `axe` or similar tools regularly to ensure WCAG compliance.
4. **Mocking**: Use Vitest mocks or MSW (Mock Service Worker) to mock API responses during development/testing.
5. **Snapshots**: Use snapshot testing sparingly for very stable UI components.
