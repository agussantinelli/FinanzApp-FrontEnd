import { describe, it, expect, vi, beforeEach } from 'vitest';
import { chatWithAi } from './AiService';
import { http } from '@/lib/http';

vi.mock('@/lib/http', () => ({
    http: {
        post: vi.fn(),
    }
}));

describe('AiService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('chatWithAi calls API and returns answer', async () => {
        const mockResp = { respuesta: 'AI response' };
        (http.post as any).mockResolvedValue({ data: mockResp });

        const result = await chatWithAi('hello');

        expect(http.post).toHaveBeenCalledWith('/api/ai/chat', { prompt: 'hello' });
        expect(result).toBe('AI response');
    });

    it('handles AI service failure', async () => {
        (http.post as any).mockRejectedValue(new Error('AI down'));
        await expect(chatWithAi('hi')).rejects.toThrow('AI down');
    });
});
