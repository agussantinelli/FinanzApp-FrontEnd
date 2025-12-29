import { render, screen, fireEvent } from '@testing-library/react';
import { CurrencyToggle } from './CurrencyToggle';
import { describe, it, expect, vi } from 'vitest';

describe('CurrencyToggle', () => {
    const mockOnChange = vi.fn();

    it('renders ARS and USD options', () => {
        render(<CurrencyToggle currency="ARS" onCurrencyChange={mockOnChange} />);
        expect(screen.getByLabelText('ARS')).toBeInTheDocument();
        expect(screen.getByLabelText('USD')).toBeInTheDocument();
    });

    it('shows ARS as selected when currency is ARS', () => {
        render(<CurrencyToggle currency="ARS" onCurrencyChange={mockOnChange} />);
        const arsButton = screen.getByLabelText('ARS');
        expect(arsButton).toHaveAttribute('aria-pressed', 'true');
    });

    it('shows USD as selected when currency is USD', () => {
        render(<CurrencyToggle currency="USD" onCurrencyChange={mockOnChange} />);
        const usdButton = screen.getByLabelText('USD');
        expect(usdButton).toHaveAttribute('aria-pressed', 'true');
    });

    it('calls onCurrencyChange with USD when clicking USD', () => {
        render(<CurrencyToggle currency="ARS" onCurrencyChange={mockOnChange} />);
        fireEvent.click(screen.getByLabelText('USD'));
        expect(mockOnChange).toHaveBeenCalledWith('USD');
    });

    it('calls onCurrencyChange with ARS when clicking ARS', () => {
        render(<CurrencyToggle currency="USD" onCurrencyChange={mockOnChange} />);
        fireEvent.click(screen.getByLabelText('ARS'));
        expect(mockOnChange).toHaveBeenCalledWith('ARS');
    });
});
