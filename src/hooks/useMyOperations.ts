"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getOperacionesByPersona } from "@/services/OperacionesService";
import { OperacionResponseDTO } from "@/types/Operacion";

export function useMyOperations() {
    const { user } = useAuth();
    const [operaciones, setOperaciones] = useState<OperacionResponseDTO[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.id) {
            getOperacionesByPersona(user.id)
                .then(data => {
                    // Sort by date desc
                    const sorted = data.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
                    setOperaciones(sorted);
                })
                .catch(console.error)
                .finally(() => setLoading(false));
        }
    }, [user]);

    return {
        operaciones,
        loading,
        user // verifying existence in component if needed
    };
}
