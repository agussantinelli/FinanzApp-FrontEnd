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
        (http.post as any).mockResolvedValue({ data: { respuesta: 'hola' } });
        const res = await chatWithAi('test');
        expect(http.post).toHaveBeenCalledWith('/api/ai/chat', { prompt: 'test' });
        expect(res).toBe('hola');
    });
});
