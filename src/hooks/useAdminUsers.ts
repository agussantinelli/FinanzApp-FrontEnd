import { useState, useCallback, useEffect } from 'react';
import { UserDTO } from '@/types/Usuario';
import { getUsers } from '@/services/AdminService';

export function useAdminUsers() {
    const [users, setUsers] = useState<UserDTO[]>([]);
    const [loading, setLoading] = useState(false);

    const loadUsers = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getUsers();
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
        const roles = ['Inversor', 'Experto', 'Admin'];
        const currentIndex = roles.indexOf(user.rol);
        if (currentIndex === -1) return;

        let newIndex = currentIndex;
        if (direction === 'up' && currentIndex < roles.length - 1) {
            newIndex++;
        } else if (direction === 'down' && currentIndex > 0) {
            newIndex--;
        }

        if (newIndex !== currentIndex) {
            setLoading(true);
            try {
                // We need to import updateUser from AdminService
                const { updateUser } = await import('@/services/AdminService');
                await updateUser(user.id, user, roles[newIndex]);
                await loadUsers(); // Reload list
            } catch (error) {
                console.error("Error changing role", error);
                alert("Error al cambiar el rol. Verifica los datos del usuario.");
            } finally {
                setLoading(false);
            }
        }
    };

    return { users, loading, loadUsers, changeRole };
}
