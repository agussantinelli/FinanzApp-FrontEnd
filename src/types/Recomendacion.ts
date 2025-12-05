export interface RecomendacionDTO {
    id: number;
    titulo: string;
    descripcion: string;
    fotoUrl?: string;
    autorId: number;
    autorNombreCompleto: string;
    activoIds: number[];
}

export interface RecomendacionResumenDTO {
    id: number;
    titulo: string;
    fuente: string;
    fecha: string;
    riesgo: string;
    horizonte: string;
    autorNombre: string;
    cantidadActivos: number;
}
