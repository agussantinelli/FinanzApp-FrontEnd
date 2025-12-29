import { useState, useEffect, useMemo } from 'react';
import { ActivoDTO } from '@/types/Activo';
import { TipoActivoDTO } from '@/types/TipoActivo';
import { SectorDTO } from '@/types/Sector';
import { getTiposActivoNoMoneda } from '@/services/TipoActivosService';
import { getSectores } from '@/services/SectorService';

export type Order = 'asc' | 'desc';

// Simple in-memory cache for metadata to avoid re-fetching on tab switches
let cachedTipos: TipoActivoDTO[] | null = null;
let cachedSectores: SectorDTO[] | null = null;

export function useActivosFilterAndSort(activos: ActivoDTO[]) {
    const [tipos, setTipos] = useState<TipoActivoDTO[]>(cachedTipos || []);
    const [sectores, setSectores] = useState<SectorDTO[]>(cachedSectores || []);

    // Filter State
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedType, setSelectedType] = useState<string | number>("Todos");
    const [selectedSector, setSelectedSector] = useState<string>("Todos");

    // Sort State
    const [order, setOrder] = useState<Order>('asc');
    const [orderBy, setOrderBy] = useState<keyof ActivoDTO>('symbol');

    useEffect(() => {
        const loadMetadata = async () => {
            if (cachedTipos && cachedSectores) return;

            try {
                const [t, s] = await Promise.all([getTiposActivoNoMoneda(), getSectores()]);
                cachedTipos = t;
                cachedSectores = s;
                setTipos(t);
                setSectores(s);
            } catch (err) {
                console.error("Error loading metadata", err);
            }
        };
        loadMetadata();
    }, []);

    const handleRequestSort = (property: keyof ActivoDTO) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const filteredAndSortedActivos = useMemo(() => {
        const filtered = activos.filter(activo => {
            // Search Filter
            const lowerTerm = searchTerm.toLowerCase();
            const matchesSearch = activo.symbol.toLowerCase().includes(lowerTerm) ||
                activo.nombre.toLowerCase().includes(lowerTerm);

            // Type Filter
            let matchesType = true;
            if (selectedType !== "Todos") {
                const tObj = tipos.find(t => t.id === Number(selectedType));
                matchesType = tObj ? activo.tipo === tObj.nombre : true;
            }

            // Sector Filter
            let matchesSector = true;
            if (selectedSector !== "Todos") {
                const sObj = sectores.find(s => s.id === selectedSector);
                matchesSector = sObj ? activo.sector === sObj.nombre : true;
            }

            return matchesSearch && matchesType && matchesSector;
        });

        // Sorting
        return filtered.sort((a, b) => {
            let valueA = a[orderBy];
            let valueB = b[orderBy];

            // Handle null/undefined for Sector or other optional fields
            if (orderBy === 'sector') {
                valueA = valueA || '';
                valueB = valueB || '';
            }

            if (typeof valueA === 'string' && typeof valueB === 'string') {
                // Case insensitive sort
                valueA = valueA.toLowerCase();
                valueB = valueB.toLowerCase();
                if (valueB < valueA) {
                    return order === 'asc' ? 1 : -1;
                }
                if (valueB > valueA) {
                    return order === 'asc' ? -1 : 1;
                }
                return 0;
            }
            if (valueA == null) return 1;
            if (valueB == null) return -1;

            if (valueB < valueA) {
                return order === 'asc' ? 1 : -1;
            }
            if (valueB > valueA) {
                return order === 'asc' ? -1 : 1;
            }
            return 0;
        });

    }, [activos, searchTerm, selectedType, selectedSector, tipos, sectores, order, orderBy]);

    return {
        tipos,
        sectores,
        searchTerm, setSearchTerm,
        selectedType, setSelectedType,
        selectedSector, setSelectedSector,
        order, orderBy, handleRequestSort,
        filteredAndSortedActivos
    };
}
