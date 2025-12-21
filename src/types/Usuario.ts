export enum RolUsuario {
    Admin = 'Admin',
    Experto = 'Experto',
    Inversor = 'Inversor'
}

export interface UserDTO {
    id: string; // UUID
    nombre: string;
    email: string;
    rol: string;
    fechaRegistro: string;
    ultimoLogin?: string;
    cantidadOperaciones?: number;
}

export interface AuthenticatedUser {
    id: string; // UUID
    nombre: string;
    apellido: string;
    email: string;
    rol: RolUsuario | string;
}

export interface UserLoginRequest {
    email: string;
    password: string;
}

export interface UserLoginResponseDTO {
    token: string;
    expiraUtc: string;
    personaId: string; // UUID
    nombre: string;
    apellido: string;
    email: string;
    rol: RolUsuario | string;
}

export interface UserRegisterRequest {
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
