import { http } from "./Http";
import { SectorDTO } from "@/types/Sector";

export async function getSectores(): Promise<SectorDTO[]> {
    const res = await http.get<SectorDTO[]>("/api/sectores");
    return res.data;
}

export async function getSectoresNoMoneda(): Promise<SectorDTO[]> {
    const res = await http.get<SectorDTO[]>("/api/sectores/no-moneda");
    return res.data;
}
