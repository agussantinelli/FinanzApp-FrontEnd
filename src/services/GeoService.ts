import { http } from "@/lib/http";
import { RegisterGeoDataDTO } from "@/types/Geo";

export async function getRegisterGeoData(): Promise<RegisterGeoDataDTO> {
    const response = await http.get<RegisterGeoDataDTO>("/geo/register-data");
    return response.data;
}