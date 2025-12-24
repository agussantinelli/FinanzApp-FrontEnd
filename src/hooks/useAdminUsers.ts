import { useState, useCallback, useEffect } from 'react';
import { UserDTO } from '@/types/Usuario';
import { getPersonas } from '@/services/PersonaService';

export function useAdminUsers() {
    const [users, setUsers] = useState<UserDTO[]>([]);
    const [loading, setLoading] = useState(false);

    const loadUsers = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getPersonas();
            setUsers(data);
        } catch (error) {
            console.error('Error loading users:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadUsers();
    }, [loadUsers]);

    const changeRole = async (user: UserDTO, direction: 'up' | 'down') => {
        setLoading(true);
        try {
            const { promoteToExperto, demoteToInversor } = await import('@/services/PersonaService');

            if (direction === 'up' && user.rol === 'Inversor') {
                await promoteToExperto(user.id);
            } else if (direction === 'down' && user.rol === 'Experto') {
                await demoteToInversor(user.id);
            } else {
                console.warn("Change role not supported for this transition", user.rol, direction);
                return;
            }

            await loadUsers(); // Reload list
        } catch (error) {
            console.error("Error changing role", error);
            alert("Error al cambiar el rol. Intente nuevamente.");
        } finally {
            setLoading(false);
        }
    };

    return { users, loading, loadUsers, changeRole };
}
