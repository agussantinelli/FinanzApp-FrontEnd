import { http } from "./Http";
import { TipoActivoDTO } from "@/types/TipoActivo";

export async function getTiposActivo(): Promise<TipoActivoDTO[]> {
    const res = await http.get<TipoActivoDTO[]>("/api/tipos-activo");
    return res.data;
}

export async function getTiposActivoNoMoneda(): Promise<TipoActivoDTO[]> {
    const res = await http.get<TipoActivoDTO[]>("/api/tipos-activo/no-moneda");
    return res.data;
}
