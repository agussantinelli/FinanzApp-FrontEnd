import { render, screen, fireEvent } from '@testing-library/react';
import { ConfirmDialog } from './ConfirmDialog';
import { describe, it, expect, vi } from 'vitest';

describe('ConfirmDialog', () => {
    const defaultProps = {
        open: true,
        title: 'Test Title',
        content: 'Test Content',
        onClose: vi.fn(),
        onConfirm: vi.fn(),
    };

    it('renders correctly when open', () => {
        render(<ConfirmDialog {...defaultProps} />);
        expect(screen.getByText('Test Title')).toBeInTheDocument();
        expect(screen.getByText('Test Content')).toBeInTheDocument();
        expect(screen.getByText('Aceptar')).toBeInTheDocument();
        expect(screen.getByText('Cancelar')).toBeInTheDocument();
    });

    it('does not render when closed', () => {
        render(<ConfirmDialog {...defaultProps} open={false} />);
        const title = screen.queryByText('Test Title');
        expect(title).not.toBeInTheDocument();
    });

    it('calls onConfirm when confirm button is clicked', () => {
        render(<ConfirmDialog {...defaultProps} />);
        fireEvent.click(screen.getByText('Aceptar'));
        expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1);
    });

    it('calls onClose when cancel button is clicked', () => {
        render(<ConfirmDialog {...defaultProps} />);
        fireEvent.click(screen.getByText('Cancelar'));
        expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
    });

    it('displays custom button texts', () => {
        render(
            <ConfirmDialog
                {...defaultProps}
                confirmText="Yes"
                cancelText="No"
            />
        );
        expect(screen.getByText('Yes')).toBeInTheDocument();
        expect(screen.getByText('No')).toBeInTheDocument();
    });

    it('disables buttons when loading', () => {
        render(<ConfirmDialog {...defaultProps} loading={true} />);
        expect(screen.getByText('Aceptar').closest('button')).toBeDisabled();
        expect(screen.getByText('Cancelar').closest('button')).toBeDisabled();
    });

    it('renders custom content node', () => {
        render(
            <ConfirmDialog
                {...defaultProps}
                content={<div data-testid="custom-content">Custom</div>}
            />
        );
        expect(screen.getByTestId('custom-content')).toBeInTheDocument();
    });
});
