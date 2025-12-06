import { http } from "./Http";
import { SectorDTO } from "@/types/Sector";

export async function getSectores(): Promise<SectorDTO[]> {
    const res = await http.get<SectorDTO[]>("/api/sectores");
    return res.data;
}

