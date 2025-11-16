export interface RegisterRequest {
  nombre: string;
  apellido: string;
  email: string;
  fechaNacimiento: string;          // ISO yyyy-MM-dd
  password: string;
  nacionalidadId: number;
  paisResidenciaId: number | null;
  localidadResidenciaId: number | null;
  esResidenteArgentina: boolean;
}