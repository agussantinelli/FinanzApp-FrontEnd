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

    return { users, loading, loadUsers };
}
