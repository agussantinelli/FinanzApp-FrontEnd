import { http } from "./Http";
import { ActivoDTO } from "@/types/Activo";

export async function getActivos(tipo?: string): Promise<ActivoDTO[]> {
    const params = tipo && tipo !== "Todos" ? { tipo } : {};
    const res = await http.get<ActivoDTO[]>("/api/activos", { params });
    return res.data;
}

export async function getActivoById(id: number): Promise<ActivoDTO> {
    const res = await http.get<ActivoDTO>(`/api/activos/${id}`);
    return res.data;
}
