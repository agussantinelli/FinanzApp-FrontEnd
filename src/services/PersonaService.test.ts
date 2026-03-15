import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
    getPersonas, 
    getInversores, 
    getPersonaById, 
    updatePersona, 
    promoteToExperto, 
    demoteToInversor,
    uploadUserPhoto,
    deletePersona
} from './PersonaService';
import { http } from '@/lib/http';

vi.mock('@/lib/http', () => ({
    http: {
        get: vi.fn(),
        put: vi.fn(),
        patch: vi.fn(),
        post: vi.fn(),
        delete: vi.fn(),
    }
}));

describe('PersonaService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('getPersonas returns data on success', async () => {
        const mockData = [{ id: '1', nombre: 'Test' }];
        (http.get as any).mockResolvedValue({ data: mockData });

        const result = await getPersonas();
        expect(http.get).toHaveBeenCalledWith('/api/personas');
        expect(result).toEqual(mockData);
    });

    it('getPersonas returns empty array on failure', async () => {
        (http.get as any).mockRejectedValue(new Error('Fail'));
        const result = await getPersonas();
        expect(result).toEqual([]);
    });

    it('getInversores calls correct endpoint', async () => {
        (http.get as any).mockResolvedValue({ data: [] });
        await getInversores();
        expect(http.get).toHaveBeenCalledWith('/api/personas/inversores');
    });

    it('getPersonaById calls correct endpoint', async () => {
        (http.get as any).mockResolvedValue({ data: { id: '1' } });
        await getPersonaById('1');
        expect(http.get).toHaveBeenCalledWith('/api/personas/1');
    });

    it('updatePersona calls put', async () => {
        (http.put as any).mockResolvedValue({});
        await updatePersona('1', { nombre: 'New' });
        expect(http.put).toHaveBeenCalledWith('/api/personas/1', { nombre: 'New' });
    });

    it('promoteToExperto calls patch', async () => {
        await promoteToExperto('1');
        expect(http.patch).toHaveBeenCalledWith('/api/personas/1/rol/experto', {});
    });

    it('demoteToInversor calls patch', async () => {
        await demoteToInversor('1');
        expect(http.patch).toHaveBeenCalledWith('/api/personas/1/rol/inversor', {});
    });

    it('uploadUserPhoto sends FormData', async () => {
        const mockFile = new File([''], 'test.jpg', { type: 'image/jpeg' });
        (http.post as any).mockResolvedValue({ data: { url: 'url' } });
        
        await uploadUserPhoto('1', mockFile);
        
        expect(http.post).toHaveBeenCalled();
        const call = (http.post as any).mock.calls[0];
        expect(call[0]).toBe('/api/personas/1/foto');
        expect(call[1]).toBeInstanceOf(FormData);
    });

    it('deletePersona calls delete', async () => {
        await deletePersona('1');
        expect(http.delete).toHaveBeenCalledWith('/api/personas/1');
    });
});
