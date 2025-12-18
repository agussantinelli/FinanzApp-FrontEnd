import { OperacionResponseDTO } from "@/types/Operacion";
import { AuthenticatedUser } from "@/types/Usuario";
import { AdminDashboardStats } from "@/types/Admin";
import { UserDTO } from "@/types/Usuario";

const MOCK_STATS: AdminDashboardStats = {
    totalUsuarios: 1250,
    usuariosHoy: 45,
    totalOperaciones: 15320,
    operacionesHoy: 128,
    volumenHoyArs: 25000000,
    volumenHoyUsd: 45000,
    totalActivos: 156
};

const MOCK_USERS: UserDTO[] = Array.from({ length: 50 }).map((_, i) => ({
    id: `u-${i + 1}-uuid-mock`,
    nombre: `Usuario ${i + 1}`,
    email: `usuario${i + 1}@example.com`,
    rol: i % 10 === 0 ? "Admin" : "Inversor",
    fechaRegistro: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
    ultimoLogin: new Date(Date.now() - Math.random() * 100000000).toISOString(),
}));

export const getDashboardStats = async (): Promise<AdminDashboardStats> => {
    return new Promise((resolve) => setTimeout(() => resolve(MOCK_STATS), 500));
};

export const getUsers = async (): Promise<UserDTO[]> => {
    return new Promise((resolve) => setTimeout(() => resolve(MOCK_USERS), 600));
};

export const getAllOperations = async (): Promise<OperacionResponseDTO[]> => {

    const mockOps: OperacionResponseDTO[] = Array.from({ length: 20 }).map((_, i) => ({
        id: `op-${i + 1000}-uuid-mock`, // UUID mock string
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
