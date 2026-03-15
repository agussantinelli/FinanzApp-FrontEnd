import { render, screen, fireEvent, waitFor, act } from '@/test/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ImportExcelModal from './ImportExcelModal';
import { useImportExcel } from '@/hooks/useImportExcel';

vi.mock('@/hooks/useImportExcel');

describe('ImportExcelModal', () => {
    const onClose = vi.fn();
    const onSuccess = vi.fn();
    const mockHook = {
        step: 'UPLOAD',
        file: null,
        previewData: null,
        errorMessage: null,
        handleFileChange: vi.fn(),
        analyze: vi.fn(),
        confirm: vi.fn(),
        reset: vi.fn(),
        setStep: vi.fn(),
        retry: vi.fn(),
        updateItem: vi.fn(),
        deleteItem: vi.fn(),
        setErrorMessage: vi.fn(),
    };

    beforeEach(() => {
        vi.clearAllMocks();
        (useImportExcel as any).mockReturnValue(mockHook);
    });

    it('renders upload step initially', () => {
        render(<ImportExcelModal open={true} onClose={onClose} onSuccess={onSuccess} />);
        expect(screen.getByText(/Importar Operaciones desde Excel/i)).toBeInTheDocument();
        expect(screen.getByText(/Click o arrastra tu Excel aquí/i)).toBeInTheDocument();
    });

    it('calls analyze when button is clicked', () => {
        (useImportExcel as any).mockReturnValue({ ...mockHook, file: { name: 'test.xlsx' } });
        render(<ImportExcelModal open={true} onClose={onClose} onSuccess={onSuccess} />);
        
        fireEvent.click(screen.getByText(/Analizar Archivo/i));
        expect(mockHook.analyze).toHaveBeenCalled();
    });

    it('shows preview data when step is PREVIEW', () => {
        const previewData = {
            items: [
                { id: 1, symbol: 'AAPL', cantidad: 10, precioUnitario: 150, fecha: '2024-01-01', tipoOperacion: 'Compra', moneda: 'USD', isValid: true }
            ],
            canImport: true
        };
        (useImportExcel as any).mockReturnValue({ ...mockHook, step: 'PREVIEW', previewData });
        
        render(<ImportExcelModal open={true} onClose={onClose} onSuccess={onSuccess} />);
        
        expect(screen.getByText('AAPL')).toBeInTheDocument();
        expect(screen.getByText(/1 válidas/i)).toBeInTheDocument();
        expect(screen.getByText(/Confirmar Importación/i)).toBeEnabled();
    });

    it('calls confirm when confirming import', async () => {
        const previewData = {
            items: [{ symbol: 'AAPL', isValid: true, cantidad: 10, precioUnitario: 150 }],
            canImport: true
        };
        (useImportExcel as any).mockReturnValue({ ...mockHook, step: 'PREVIEW', previewData });
        
        render(<ImportExcelModal open={true} onClose={onClose} onSuccess={onSuccess} />);
        
        fireEvent.click(screen.getByText(/Confirmar Importación/i));
        expect(mockHook.confirm).toHaveBeenCalled();
    });

    it('shows success message when step is SUCCESS', () => {
        (useImportExcel as any).mockReturnValue({ ...mockHook, step: 'SUCCESS' });
        render(<ImportExcelModal open={true} onClose={onClose} onSuccess={onSuccess} />);
        
        expect(screen.getByText(/Importación Exitosa/i)).toBeInTheDocument();
    });
});
