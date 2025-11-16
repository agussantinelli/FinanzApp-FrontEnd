import axios from "axios";
import { DolarDTO } from "@/types/Dolar";
import { BASEURL } from "./BaseURL";


const api = axios.create({
  baseURL: BASEURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function getCotizacionesDolar(): Promise<DolarDTO[]> {
  try {
    const response = await api.get<DolarDTO[]>("/api/dolar/cotizaciones", {
      headers: { "Cache-Control": "no-cache" },
    });

    return response.data;
  } catch (error) {
    console.error("❌ Error al obtener cotizaciones:", error);
    return [];
  }
}
