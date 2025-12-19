import { http } from "@/lib/http";
import { SectorDTO } from "@/types/Sector";

export async function getSectores(): Promise<SectorDTO[]> {
    const res = await http.get<SectorDTO[]>("/api/sectores");
    return res.data;
}

export async function getSectorById(id: string): Promise<SectorDTO> {
    const res = await http.get<SectorDTO>(`/api/sectores/${id}`);
    return res.data;
}

