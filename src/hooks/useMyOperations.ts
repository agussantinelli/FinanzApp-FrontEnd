"use client";

import { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getOperacionesByPersona } from "@/services/OperacionesService";
import { getCotizacionesDolar } from "@/services/DolarService";
import { OperacionResponseDTO } from "@/types/Operacion";
import { formatQuantity } from "@/utils/format";

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

    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const refresh = () => {
        setRefreshTrigger(prev => prev + 1);
    };

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
    }, [user, refreshTrigger]);

    // Sorting & Filtering Logic
    const processedOperations = useMemo(() => {
        let result = [...operaciones];

        // 1. Filter Type
        if (filterType !== 'TODAS') {
            result = result.filter(op => op.tipo === filterType);
        }

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

            if (bValue === undefined && aValue === undefined) return 0;
            if (bValue === undefined) return 1;
            if (aValue === undefined) return -1;

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

    const checkValidation = (
        op: OperacionResponseDTO,
        action: 'DELETE' | 'EDIT',
        newValues?: { cantidad: number }
    ): { valid: boolean; message?: string } => {
        // 1. Get all operations for this asset
        const assetOps = operaciones.filter(o => o.activoSymbol === op.activoSymbol);

        // 2. Calculate Current Holding
        const currentHolding = assetOps.reduce((acc, curr) => {
            if (curr.tipo === "Compra") return acc + curr.cantidad;
            if (curr.tipo === "Venta") return acc - curr.cantidad;
            return acc;
        }, 0);

        // 3. Simulate Change
        let projectedHolding = currentHolding;

        if (action === 'DELETE') {
            if (op.tipo === "Compra") {
                projectedHolding = currentHolding - op.cantidad;
            } else {
                // Deleting a Venta increases holding, so it's usually safe regarding negative balance
                projectedHolding = currentHolding + op.cantidad;
            }
        } else if (action === 'EDIT' && newValues) {
            const oldContribution = op.tipo === "Compra" ? op.cantidad : -op.cantidad;
            const newContribution = op.tipo === "Compra" ? newValues.cantidad : -newValues.cantidad;
            projectedHolding = currentHolding - oldContribution + newContribution;
        }

        // 4. Validate
        // Allow a small epsilon for floating point errors?
        if (projectedHolding < -0.000001) {
            return {
                valid: false,
                message: `No se puede realizar esta acción porque el saldo de ${op.activoSymbol} quedaría en negativo (${formatQuantity(projectedHolding)}).`
            };
        }

        return { valid: true };
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
        handleRequestSort,
        refresh,
        checkValidation
    };
}
