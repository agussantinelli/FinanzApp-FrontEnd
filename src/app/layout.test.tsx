import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import RootLayout from './layout';

// Mock components used in layout
vi.mock('@/components/Providers', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="providers">{children}</div>,
}));

vi.mock('@/components/Navbar', () => ({
  default: () => <nav data-testid="navbar">Navbar</nav>,
}));

vi.mock('@/components/Footer', () => ({
  default: () => <footer data-testid="footer">Footer</footer>,
}));

vi.mock('@/components/ClientBackground', () => ({
  default: () => <div data-testid="client-background">Background</div>,
}));

vi.mock('@/components/common/FinanzAiChat', () => ({
  default: () => <div data-testid="finanz-ai-chat">Chat</div>,
}));

// Mock styles
vi.mock('./styles/Layout.module.css', () => ({
  default: {
    body: 'body-class',
    main: 'main-class',
  },
}));

// Mock next/font/google
vi.mock('next/font/google', () => ({
  Roboto: () => ({
    className: 'roboto-class',
  }),
}));

describe('RootLayout', () => {
  it('renders correctly with all components', () => {
    render(
      <RootLayout>
        <div data-testid="children">Content</div>
      </RootLayout>
    );

    expect(screen.getByTestId('client-background')).toBeDefined();
    expect(screen.getByTestId('providers')).toBeDefined();
    expect(screen.getByTestId('navbar')).toBeDefined();
    expect(screen.getByTestId('footer')).toBeDefined();
    expect(screen.getByTestId('finanz-ai-chat')).toBeDefined();
    expect(screen.getByTestId('children')).toBeDefined();
    expect(screen.getByText('Content')).toBeDefined();
  });

  it('main contains the children', () => {
    const { container } = render(
      <RootLayout>
        <div data-testid="children">Content</div>
      </RootLayout>
    );

    const main = container.querySelector('main');
    expect(main).toBeDefined();
    expect(main?.classList.contains('main-class')).toBe(true);
    expect(screen.getByTestId('children')).toBeDefined();
  });
});
