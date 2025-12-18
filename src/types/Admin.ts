export interface DashboardStats {
    totalUsuarios: number;
    usuariosHoy: number;
    totalOperaciones: number;
    operacionesHoy: number;
    volumenHoyArs: number;
    volumenHoyUsd: number;
    totalActivos: number;
}

export interface UserDTO {
    id: string; // UUID
    nombre: string;
    email: string;
    rol: string;
    fechaRegistro: string;
    ultimoLogin?: string;
}
