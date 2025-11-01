import { DolarDTO } from "@/types/Dolar";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE || "https://localhost:7209/api";

export async function getCotizacionesDolar(): Promise<DolarDTO[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/dolar/cotizaciones`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`Error HTTP ${res.status}`);
    return (await res.json()) as DolarDTO[];
  } catch (error) {
    console.error("Error al obtener cotizaciones:", error);
    return [];
  }
}
