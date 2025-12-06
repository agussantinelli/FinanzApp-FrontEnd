export interface LoginResponseDTO {
  token: string;
  expiraUtc: string;
  personaId: string; // UUID
  nombre: string;
  apellido: string;
  email: string;
  rol: "Admin" | "Inversor" | string;
}