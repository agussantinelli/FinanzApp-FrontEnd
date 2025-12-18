export interface RegisterGeoDataDTO {
  paises: PaisDTO[];
  provinciasArgentina: ProvinciaDTO[];
  localidadesArgentina: LocalidadDTO[];
}

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

