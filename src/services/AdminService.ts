import http from "./Http";
import { OperacionResponseDTO } from "@/types/Operacion";
import { AuthUser } from "./AuthService";

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
    id: number;
    nombre: string;
    email: string;
    rol: string;
    fechaRegistro: string;
    ultimoLogin?: string;
}

// Mock data generator since endpoints might not exist yet
const MOCK_STATS: DashboardStats = {
    totalUsuarios: 1250,
    usuariosHoy: 45,
    totalOperaciones: 15320,
    operacionesHoy: 128,
    volumenHoyArs: 25000000,
    volumenHoyUsd: 45000,
    totalActivos: 156
};

// Mock users
const MOCK_USERS: UserDTO[] = Array.from({ length: 50 }).map((_, i) => ({
    id: i + 1,
    nombre: `Usuario ${i + 1}`,
    email: `usuario${i + 1}@example.com`,
    rol: i % 10 === 0 ? "Admin" : "Inversor",
    fechaRegistro: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
    ultimoLogin: new Date(Date.now() - Math.random() * 100000000).toISOString(),
}));

// Service functions
export const getDashboardStats = async (): Promise<DashboardStats> => {
    // In a real app: return (await http.get<DashboardStats>("/api/admin/stats")).data;
    return new Promise((resolve) => setTimeout(() => resolve(MOCK_STATS), 500));
};

export const getUsers = async (): Promise<UserDTO[]> => {
    // In a real app: return (await http.get<UserDTO[]>("/api/usuarios")).data;
    return new Promise((resolve) => setTimeout(() => resolve(MOCK_USERS), 600));
};

export const getAllOperations = async (): Promise<OperacionResponseDTO[]> => {
    // In a real app: return (await http.get<OperacionResponseDTO[]>("/api/operaciones/todas")).data;
    // For now, return empty or mock if needed. Let's return empty to simulate "no data yet" or mock some if needed.
    // Let's mock a few for display.
    const mockOps: OperacionResponseDTO[] = Array.from({ length: 20 }).map((_, i) => ({
        id: i + 1000,
        activoSymbol: ["AAPL", "BTC", "YPF", "TSLA"][i % 4],
        activoNombre: ["Apple", "Bitcoin", "YPF", "Tesla"][i % 4],
        tipo: i % 2 === 0 ? "Compra" : "Venta",
        cantidad: Math.floor(Math.random() * 10) + 1,
        precioUnitario: Math.floor(Math.random() * 500) + 100,
        totalOperado: Math.floor(Math.random() * 5000) + 1000,
        moneda: i % 3 === 0 ? "USD" : "ARS",
        fecha: new Date().toISOString(),
        personaNombre: `Usuario ${i % 5 + 1}`
    }));
    return new Promise((resolve) => setTimeout(() => resolve(mockOps), 700));
};
