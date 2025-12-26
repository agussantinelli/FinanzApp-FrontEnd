import { http } from "@/lib/http";
import { UserDTO, UserUpdateRequest } from "@/types/Usuario";

const ENDPOINT = "/api/personas";

export const getPersonas = async (): Promise<UserDTO[]> => {
    try {
        const { data } = await http.get<UserDTO[]>(ENDPOINT);
        return data;
    } catch (e) {
        console.warn("Error fetching users", e);
        return [];
    }
};

export const getInversores = async (): Promise<UserDTO[]> => {
    const { data } = await http.get<UserDTO[]>(`${ENDPOINT}/inversores`);
    return data;
};

export const getPersonaById = async (id: string): Promise<UserDTO> => {
    const { data } = await http.get<UserDTO>(`${ENDPOINT}/${id}`);
    return data;
};

export const updatePersona = async (id: string, data: UserUpdateRequest | any): Promise<void> => {
    await http.put(`${ENDPOINT}/${id}`, data);
};

export const promoteToExperto = async (id: string): Promise<void> => {
    await http.patch(`${ENDPOINT}/${id}/rol/experto`, {});
};

export const demoteToInversor = async (id: string): Promise<void> => {
    await http.patch(`${ENDPOINT}/${id}/rol/inversor`, {});
};

export const uploadUserPhoto = async (id: string, file: File): Promise<{ message: string, url: string }> => {
    const formData = new FormData();
    formData.append('archivo', file);
    const { data } = await http.post<{ message: string, url: string }>(`${ENDPOINT}/${id}/foto`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data;
};
