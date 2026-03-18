import React from 'react';
import { render, screen } from './test-utils';
import { useTheme } from '@mui/material/styles';
import { describe, it, expect } from 'vitest';

const ThemeVerifier = () => {
    const theme = useTheme();
    return <div data-testid="theme-mode">{theme.palette.mode}</div>;
};

describe('test-utils', () => {
    it('should render component with dark theme by default', () => {
        render(<ThemeVerifier />);
        expect(screen.getByTestId('theme-mode')).toHaveTextContent('dark');
    });

    it('should render children correctly', () => {
        render(<div>Test Content</div>);
        expect(screen.getByText('Test Content')).toBeInTheDocument();
    });
});
