import { vi, describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@/test/test-utils';
import FinanzAiChat from '@/components/common/FinanzAiChat';
import { server } from '@/test/msw/server';
import { http, HttpResponse } from 'msw';

// Mock usePathname
vi.mock('next/navigation', () => ({
    usePathname: () => '/dashboard',
}));

describe('FinanzAiChat Integration', () => {
    beforeEach(() => {
        server.use(
            http.post('*/api/ai/chat', async () => {
                const encoder = new TextEncoder();
                const stream = new ReadableStream({
                    start(controller) {
                        const chunk = encoder.encode('data: {"c": "He analizado tu consulta"}\n\n');
                        controller.enqueue(chunk);
                        controller.close();
                    },
                });

                return new HttpResponse(stream, {
                    headers: {
                        'Content-Type': 'text/event-stream',
                    },
                });
            })
        );
    });

    it('should send a message and receive an AI response', async () => {
        render(<FinanzAiChat />);

        // 1. Open Chat
        const fab = screen.getByLabelText(/Abrir asistente IA/i);
        fireEvent.click(fab);

        // 2. Verify initial message
        expect(screen.getByText(/¡Hola! Soy FinanzAI/i)).toBeInTheDocument();

        // 3. Type and send message
        const textarea = screen.getByPlaceholderText(/Escribe tu consulta/i);
        fireEvent.change(textarea, { target: { value: '¿Cómo va mi portafolio?' } });
        
        const sendBtn = screen.getByLabelText(/Enviar mensaje/i);
        fireEvent.click(sendBtn);

        // 4. Verify AI response
        await waitFor(() => {
            expect(screen.getByText(/He analizado tu consulta/i)).toBeInTheDocument();
        }, { timeout: 5000 });
    });
});
