import { API } from "./Api";

export interface PaisDTO {
  id: number;
  nombre: string;
  codigoIso2: string;
  codigoIso3: string;
  esArgentina: boolean;
}

export interface ProvinciaDTO {
  id: number;
  nombre: string;
  paisId: number;
}

export interface LocalidadDTO {
  id: number;
  nombre: string;
  provinciaId: number;
}

export interface RegisterGeoDataDTO {
  paises: PaisDTO[];
  provinciasArgentina: ProvinciaDTO[];
  localidadesArgentina: LocalidadDTO[];
}

export async function getRegisterGeoData(): Promise<RegisterGeoDataDTO> {
  const res = await fetch(`${API}/geo/register-data`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(
      `Error al obtener datos de registro (${res.status})`
    );
  }

  return res.json();
}