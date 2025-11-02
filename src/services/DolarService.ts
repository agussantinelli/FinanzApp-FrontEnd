import axios from "axios";
import { DolarDTO } from "@/types/Dolar";
import { API } from "./Api";


const api = axios.create({
  baseURL: API,
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
