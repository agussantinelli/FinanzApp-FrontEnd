import axios from "axios";
import { DolarDTO } from "@/types/Dolar";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE || "https://localhost:7209/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function getCotizacionesDolar(): Promise<DolarDTO[]> {
  try {
    const response = await api.get<DolarDTO[]>("/dolar/cotizaciones", {
      headers: { "Cache-Control": "no-cache" },
    });

    return response.data;
  } catch (error) {
    console.error("❌ Error al obtener cotizaciones:", error);
    return [];
  }
}
