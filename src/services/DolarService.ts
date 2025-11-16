import { http } from "./Http";
import { DolarDTO } from "@/types/Dolar";

export async function getCotizacionesDolar(): Promise<DolarDTO[]> {
  try {
    const response = await http.get<DolarDTO[]>("/api/dolar/cotizaciones", {
      headers: { "Cache-Control": "no-cache" },
    });
    return response.data;
  } catch (error) {
    console.error("❌ Error al obtener cotizaciones:", error);
    return [];
  }
}
