"use client";

import { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getOperacionesByPersona } from "@/services/OperacionesService";
import { getCotizacionesDolar } from "@/services/DolarService";
import { OperacionResponseDTO } from "@/types/Operacion";

export type Order = 'asc' | 'desc';
export type FilterType = 'TODAS' | 'Compra' | 'Venta';
export type CurrencyFilterType = 'TODAS' | 'ARS' | 'USD';

// Helper to identify CCL
function isCCL(name: string) {
    const n = name.toLowerCase();
    return n.includes("contado") || n.includes("ccl") || n.includes("liqui");
}

export function useMyOperations() {
    const { user } = useAuth();
    const [operaciones, setOperaciones] = useState<OperacionResponseDTO[]>([]);
    const [loading, setLoading] = useState(true);

    // Sort & Filter state
    const [orderBy, setOrderBy] = useState<keyof OperacionResponseDTO>('fecha');
    const [order, setOrder] = useState<Order>('desc');
    const [filterType, setFilterType] = useState<FilterType>('TODAS');
    const [filterCurrency, setFilterCurrency] = useState<CurrencyFilterType>('TODAS');
    const [dolarBlue, setDolarBlue] = useState<{ compra: number, venta: number } | null>(null);

    useEffect(() => {
        if (user?.id) {
            setLoading(true);
            Promise.all([
                getOperacionesByPersona(user.id),
                getCotizacionesDolar()
            ])
                .then(([opsData, dolarData]) => {
                    // 1. Process Operations (Sort by date desc)
                    const sorted = opsData.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
                    setOperaciones(sorted);

                    // 2. Process Dolar CCL
                    // The user requested: "filtra siempre por el dolar ccl, en TODOS LOS CASOS"
                    const paramDolar = dolarData.find(d => isCCL(d.nombre));
                    if (paramDolar) {
                        setDolarBlue({ compra: paramDolar.compra, venta: paramDolar.venta });
                    }
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

        // 2. Filter Currency & Convert
        // Note: The user requested "pasar todos a USD o toda a ARS segun filtre".
        // Instead of hiding, we will convert values if a specific currency is selected.
        // However, standard "filtering" usually implies hiding.
        // Given the request: "que muestres las transacciones como fueron... pero que puedas pasar todo a USD o ARS"
        // We will keep ALL items but map their values if a target currency is set.
        // BUT, the hook returns `OperacionResponseDTO[]`. Modifying the object structure in place might be risky if types match.
        // Let's return a NEW mapped array with converted values, pretending they are in that currency for display purposes.

        if (filterCurrency !== 'TODAS' && dolarBlue) {
            result = result.map(op => {
                // If operation Moneda matches Filter, keep it number-wise (or maybe ensure strict equality)
                if (op.moneda === filterCurrency) return op;

                // Needs Conversion
                const isTargetUSD = filterCurrency === 'USD'; // Source is ARS
                const isTargetARS = filterCurrency === 'ARS'; // Source is USD

                let newPrice = op.precioUnitario;
                let newTotal = op.totalOperado;

                if (isTargetUSD) { // ARS -> USD
                    // We divide by 'Venta' (Market price to buy dollars)
                    newPrice = op.precioUnitario / dolarBlue.venta;
                    newTotal = op.totalOperado / dolarBlue.venta;
                } else if (isTargetARS) { // USD -> ARS
                    // We multiply by 'Compra' (Market price to sell dollars)
                    newPrice = op.precioUnitario * dolarBlue.compra;
                    newTotal = op.totalOperado * dolarBlue.compra;
                }

                return {
                    ...op,
                    moneda: filterCurrency, // Update currency to match the target filter for correct UI formatting
                    precioUnitario: newPrice,
                    totalOperado: newTotal,
                };
            });
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
    }, [operaciones, orderBy, order, filterType, filterCurrency, dolarBlue]);

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
