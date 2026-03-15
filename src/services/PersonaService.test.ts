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
        post: vi.fn(),
        put: vi.fn(),
        patch: vi.fn(),
        delete: vi.fn(),
    }
}));

describe('PersonaService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('getPersonas returns data on success', async () => {
        const mockData = [{ id: '1', nombre: 'Juan' }];
        (http.get as any).mockResolvedValue({ data: mockData });
        const result = await getPersonas();
        expect(result).toEqual(mockData);
    });

    it('getPersonas returns empty array and warns on failure', async () => {
        const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
        (http.get as any).mockRejectedValue(new Error('Fail'));
        const result = await getPersonas();
        expect(result).toEqual([]);
        expect(spy).toHaveBeenCalled();
        spy.mockRestore();
    });

    it('getInversores calls correct endpoint', async () => {
        (http.get as any).mockResolvedValue({ data: [] });
        await getInversores();
        expect(http.get).toHaveBeenCalledWith('/api/personas/inversores');
    });

    it('getPersonaById returns user', async () => {
        const mockUser = { id: '123' };
        (http.get as any).mockResolvedValue({ data: mockUser });
        const result = await getPersonaById('123');
        expect(result).toEqual(mockUser);
    });

    it('updatePersona calls put', async () => {
        (http.put as any).mockResolvedValue({});
        await updatePersona('1', { nombre: 'New' });
        expect(http.put).toHaveBeenCalledWith('/api/personas/1', { nombre: 'New' });
    });

    it('promoteToExperto calls patch', async () => {
        (http.patch as any).mockResolvedValue({});
        await promoteToExperto('1');
        expect(http.patch).toHaveBeenCalledWith('/api/personas/1/rol/experto', {});
    });

    it('uploadUserPhoto sends FormData', async () => {
        const mockResp = { url: 'http://photo.jpg' };
        (http.post as any).mockResolvedValue({ data: mockResp });
        const mockFile = new File([''], 'test.jpg', { type: 'image/jpeg' });

        const result = await uploadUserPhoto('1', mockFile);

        expect(http.post).toHaveBeenCalledWith(
            '/api/personas/1/foto', 
            expect.any(FormData), 
            expect.objectContaining({ headers: { 'Content-Type': 'multipart/form-data' } })
        );
        expect(result).toEqual(mockResp);
    });

    it('deletePersona calls delete', async () => {
        (http.delete as any).mockResolvedValue({});
        await deletePersona('1');
        expect(http.delete).toHaveBeenCalledWith('/api/personas/1');
    });
});
