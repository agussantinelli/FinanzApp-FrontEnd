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
            http.post('*/api/ai/chat', async ({ request }) => {
                return HttpResponse.json({ response: 'Hola, soy tu asistente financiero. He analizado tu consulta.' });
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
        
        const sendBtn = screen.getByRole('button', { name: '' }); 
        // We can find the button by the icon class or just by it being the only other button
        const submitBtn = screen.getAllByRole('button').find(b => b.className.includes('sendButton'));
        fireEvent.click(submitBtn || sendBtn);

        // 4. Verify AI response
        await waitFor(() => {
            expect(screen.getByText(/He analizado tu consulta/i)).toBeInTheDocument();
        }, { timeout: 5000 });
    });
});
