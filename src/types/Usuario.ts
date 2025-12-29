export enum RolUsuario {
    Admin = 'Admin',
    Experto = 'Experto',
    Inversor = 'Inversor'
}

export interface UserDTO {
    id: string; // UUID
    nombre: string;
    apellido: string;
    email: string;
    urlFotoPerfil?: string;
    fechaNacimiento: string; // DateTime
    fechaAlta: string; // DateTime
    rol: string;
    esResidenteArgentina: boolean;
    nacionalidadId: number;
    nacionalidadNombre?: string;
    paisResidenciaId?: number;
    paisResidenciaNombre?: string;
    localidadResidenciaId?: number;
    localidadResidenciaNombre?: string;
    provinciaResidenciaNombre?: string;

    // Stats
    cantidadOperaciones: number;
    cantidadRecomendaciones: number;
    cantidadRecomendacionesAcertadas: number;
    cantidadPortafoliosDestacados: number;
    cantidadPortafoliosPropios: number;
}

export interface AuthenticatedUser {
    id: string; // UUID
    nombre: string;
    apellido: string;
    email: string;
    rol: RolUsuario | string;
    urlFotoPerfil?: string;
    expiraUtc?: string;
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
    urlFotoPerfil?: string;
}

export interface UserRegisterRequest {
    nombre: string;
    apellido: string;
    email: string;
    fechaNacimiento: string;
    esResidenteArgentina: boolean;
    nacionalidadId: number;
    paisResidenciaId?: number | null;
    localidadResidenciaId?: number | null;
    password: string;
}

export interface UserUpdateRequest {
    nombre: string;
    apellido: string;
    fechaNac: string;
    rol: string;
    nacionalidadId?: number;
    nacionalidadNombre?: string;
    esResidenteArgentina: boolean;
    localidadResidenciaId?: number | null;
    paisResidenciaId: number;
    paisNacionalidadId: number;
}

