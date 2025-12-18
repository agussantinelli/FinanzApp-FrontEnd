export interface UserDTO {
    id: string; // UUID
    nombre: string;
    email: string;
    rol: string;
    fechaRegistro: string;
    ultimoLogin?: string;
}
