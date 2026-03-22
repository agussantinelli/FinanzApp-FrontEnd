import { render, screen, fireEvent, waitFor, act } from '@/test/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import FinanzAiChat from './FinanzAiChat';
import { streamChatWithAi } from '@/services/AiService';
import { usePathname } from 'next/navigation';

vi.mock('@/services/AiService', () => ({
    streamChatWithAi: vi.fn(),
}));

vi.mock('next/navigation', () => ({
    usePathname: vi.fn(),
}));

// Mock scrollIntoView
window.HTMLElement.prototype.scrollIntoView = vi.fn();

describe('FinanzAiChat', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        (usePathname as any).mockReturnValue('/');
    });

    it('renders the floating button initially', () => {
        render(<FinanzAiChat />);
        expect(screen.getByLabelText(/Abrir asistente IA/i)).toBeInTheDocument();
    });

    it('opens the chat window when clicked', async () => {
        render(<FinanzAiChat />);
        fireEvent.click(screen.getByLabelText(/Abrir asistente IA/i));
        // There might be multiple FinanzAI texts (header and possibly FAB or messages)
        const titles = screen.getAllByText(/FinanzAI/i);
        expect(titles.length).toBeGreaterThan(0);
        expect(screen.getByText(/¡Hola! Soy FinanzAI/i)).toBeInTheDocument();
    });

    it('sends a message and receives AI response', async () => {
        (streamChatWithAi as any).mockImplementation(async (message: string, onChunk: (chunk: string) => void) => {
            onChunk('Hello from AI');
            return Promise.resolve();
        });
        
        render(<FinanzAiChat />);
        
        // Open chat
        fireEvent.click(screen.getByLabelText(/Abrir asistente IA/i));
        
        // Send message
        await act(async () => {
            const textarea = screen.getByPlaceholderText(/Escribe tu consulta/i);
            fireEvent.change(textarea, { target: { value: 'Hi AI' } });
            
            const form = screen.getByPlaceholderText(/Escribe tu consulta/i).closest('form')!;
            fireEvent.submit(form);
        });

        expect(screen.getByText('Hi AI')).toBeInTheDocument();
        
        await waitFor(() => {
            expect(streamChatWithAi).toHaveBeenCalledWith('Hi AI', expect.any(Function));
            expect(screen.getByText('Hello from AI')).toBeInTheDocument();
        });
    });

    it('should not render on login/register pages', () => {
        (usePathname as any).mockReturnValue('/auth/login');
        const { container } = render(<FinanzAiChat />);
        expect(container.firstChild).toBeNull();
    });
});
