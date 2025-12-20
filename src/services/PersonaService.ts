import { http } from "@/lib/http";
import { UserDTO } from "@/types/Usuario";

const ENDPOINT = "/api/personas";

export const getAllPersonas = async (): Promise<UserDTO[]> => {
    const { data } = await http.get<UserDTO[]>(ENDPOINT);
    return data;
};

export const getInversores = async (): Promise<UserDTO[]> => {
    const { data } = await http.get<UserDTO[]>(`${ENDPOINT}/inversores`);
    return data;
};

export const getPersonaById = async (id: string): Promise<UserDTO> => {
    const { data } = await http.get<UserDTO>(`${ENDPOINT}/${id}`);
    return data;
};

export const promoverAExperto = async (id: string): Promise<void> => {
    await http.patch(`${ENDPOINT}/${id}/promover-experto`);
};
