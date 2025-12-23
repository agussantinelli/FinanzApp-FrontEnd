"use client";

import { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getOperacionesByPersona } from "@/services/OperacionesService";
import { OperacionResponseDTO } from "@/types/Operacion";

export type Order = 'asc' | 'desc';
export type FilterType = 'TODAS' | 'Compra' | 'Venta';
export type CurrencyFilterType = 'TODAS' | 'ARS' | 'USD';

export function useMyOperations() {
    const { user } = useAuth();
    const [operaciones, setOperaciones] = useState<OperacionResponseDTO[]>([]);
    const [loading, setLoading] = useState(true);

    // Sort & Filter state
    const [orderBy, setOrderBy] = useState<keyof OperacionResponseDTO>('fecha');
    const [order, setOrder] = useState<Order>('desc');
    const [filterType, setFilterType] = useState<FilterType>('TODAS');
    const [filterCurrency, setFilterCurrency] = useState<CurrencyFilterType>('TODAS');

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

    // Sorting & Filtering Logic
    const processedOperations = useMemo(() => {
        let result = [...operaciones];

        // 1. Filter Type
        if (filterType !== 'TODAS') {
            result = result.filter(op => op.tipo === filterType);
        }

        // 2. Filter Currency
        if (filterCurrency !== 'TODAS') {
            result = result.filter(op => op.moneda === filterCurrency);
        }

        // 3. Sort
        result.sort((a, b) => {
            let aValue = a[orderBy];
            let bValue = b[orderBy];

            // Handle dates if sorting by date
            if (orderBy === 'fecha') {
                aValue = new Date(a.fecha as string).getTime();
                bValue = new Date(b.fecha as string).getTime();
            }

            // Handle string comparison (case-insensitive)
            if (typeof aValue === 'string' && typeof bValue === 'string') {
                aValue = aValue.toLowerCase();
                bValue = bValue.toLowerCase();
            }

            if (bValue < aValue) {
                return order === 'desc' ? -1 : 1;
            }
            if (bValue > aValue) {
                return order === 'desc' ? 1 : -1;
            }
            return 0;
        });

        return result;
    }, [operaciones, orderBy, order, filterType]);

    const handleRequestSort = (property: keyof OperacionResponseDTO) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    return {
        operaciones: processedOperations,
        loading,
        user,
        orderBy,
        order,
        filterType,
        setFilterType,
        filterCurrency,
        setFilterCurrency,
        handleRequestSort
    };
}
