import { PaisDTO } from "./Pais";
import { ProvinciaDTO } from "./Provincia";
import { LocalidadDTO } from "./Localidad";



export interface RegisterGeoDataDTO {
  paises: PaisDTO[];
  provinciasArgentina: ProvinciaDTO[];
  localidadesArgentina: LocalidadDTO[];
}