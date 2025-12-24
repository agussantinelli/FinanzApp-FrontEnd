import { useState, useCallback, useEffect } from 'react';
import { OperacionResponseDTO } from '@/types/Operacion';
import { getAllOperations } from '@/services/AdminService';

export function useAdminOperations() {
    const [operations, setOperations] = useState<OperacionResponseDTO[]>([]);
    const [loading, setLoading] = useState(false);

    const loadOperations = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getAllOperations();
            setOperations(data);
        } catch (error) {
            console.error('Error loading operations:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadOperations();
    }, [loadOperations]);

    return { operations, loading, loadOperations };
}
