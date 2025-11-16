export interface LoginResponseDTO {
  token: string;
  expiraUtc: string; 
  personaId: number;
  nombre: string;
  apellido: string;
  email: string;
  rol: "Admin" | "Inversor" | string;
}