export interface RecomendacionDTO {
    id: string; // UUID
    titulo: string;
    descripcion: string;
    fotoUrl?: string; // string? in C#
    autorId: string; // UUID
    autorNombreCompleto: string;
    activoIds: string[]; // UUID[]
}

export interface RecomendacionResumenDTO {
    id: string; // UUID
    titulo: string;
    fuente: string;
    fecha: string;
    riesgo: string;
    horizonte: string;
    autorNombre: string;
    cantidadActivos: number;
}
