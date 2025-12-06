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

export async function getActivosByTipoId(id: number): Promise<ActivoDTO[]> {
    const res = await http.get<ActivoDTO[]>(`/api/activos/tipo/${id}`);
    return res.data;
}


export async function getActivosNoMoneda(): Promise<ActivoDTO[]> {
    const res = await http.get<ActivoDTO[]>("/api/activos/no-moneda");
    return res.data;
}

export async function getRankingActivos(criterio: string = "variacion", desc: boolean = true, tipoId?: number): Promise<ActivoDTO[]> {
    const params: any = { criterio, desc };
    if (tipoId) params.tipoId = tipoId;

    const res = await http.get<ActivoDTO[]>("/api/activos/ranking", { params });
    return res.data;
}
