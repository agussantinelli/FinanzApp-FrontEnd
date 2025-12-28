import { useState, useEffect, useCallback } from 'react';
import { ActivoDTO } from '@/types/Activo';
import { TipoActivoDTO } from '@/types/TipoActivo';
import { SectorDTO } from '@/types/Sector';
import {
    getActivosNoMoneda,
    getActivosByTipoId,
    getActivosBySector,
    getActivosByTipoAndSector,
    searchActivos,
    getRankingActivos,
    getActivosFavoritos
} from '@/services/ActivosService';
import { getTiposActivoNoMoneda } from '@/services/TipoActivosService';
import { getSectores } from '@/services/SectorService';
import { getAllActivosFromCache, cacheActivos } from '@/lib/activos-cache';


export function useActivosFilters() {
    const [selectedType, setSelectedType] = useState<string | number>("Todos");
    const [selectedSector, setSelectedSector] = useState<string>("Todos");
    const [selectedCurrency, setSelectedCurrency] = useState<string>("Todos");
    const [activos, setActivos] = useState<ActivoDTO[]>([]);
    const [tipos, setTipos] = useState<TipoActivoDTO[]>([]);
    const [sectores, setSectores] = useState<SectorDTO[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [suggestions, setSuggestions] = useState<ActivoDTO[]>([]);

    const [orderBy, setOrderBy] = useState<string>("marketCap");
    const [orderDesc, setOrderDesc] = useState<boolean>(true);

    const [page, setPage] = useState(1);
    const itemsPerPage = 12;

    const [onlyFavorites, setOnlyFavorites] = useState<boolean>(false);

    // Initial load: Check auth and set default filter
    useEffect(() => {
        const token = typeof window !== 'undefined' ? sessionStorage.getItem("fa_token") : null;
        if (token) {
            setOnlyFavorites(true);
        }
    }, []);

    // Load tipos and sectores on mount
    useEffect(() => {
        const loadTiposAndSectores = async () => {
            try {
                const [tiposData, sectoresData] = await Promise.all([
                    getTiposActivoNoMoneda(),
                    getSectores()
                ]);
                setTipos(tiposData);
                setSectores(sectoresData);
            } catch (error) {
                console.error("Error fetching types/sectors:", error);
            }
        };
        loadTiposAndSectores();
    }, []);

    // Search suggestions with debounce
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchTerm.length >= 2) {
                fetchSuggestions();
            } else {
                setSuggestions([]);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    const fetchSuggestions = async () => {
        try {
            const data = await searchActivos(searchTerm);
            setSuggestions(data.slice(0, 10));
        } catch (error) {
            console.error("Error fetching suggestions:", error);
        }
    };

    const executeSearch = useCallback(async () => {
        setLoading(true);
        try {
            let data: ActivoDTO[] = [];
            const term = searchTerm.trim();

            if (term.length >= 1) {
                data = await searchActivos(term);
            } else {
                if (selectedType === "Todos") {
                    data = await getActivosNoMoneda();
                } else {
                    data = await getActivosByTipoId(Number(selectedType));
                }
            }
            // Apply currency filter if searching
            if (selectedCurrency !== "Todos") {
                data = data.filter(a => a.monedaBase === selectedCurrency);
            }
            setActivos(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [searchTerm, selectedType, selectedCurrency]);

    const fetchActivos = useCallback(async () => {
        setLoading(true);
        try {
            let data: ActivoDTO[] = [];

            const criterioMap: Record<string, string> = {
                "symbol": "nombre",
                "precio": "precio",
                "variacion": "variacion",
                "marketCap": "marketCap"
            };

            if (onlyFavorites) {
                // Fetch Favorites
                try {
                    data = await getActivosFavoritos();
                } catch (e) {
                    console.error("Failed to fetch favorites, falling back to all", e);
                    setOnlyFavorites(false); // Fallback
                    data = await getActivosNoMoneda();
                }
            } else {
                // Standard Logic
                const cache = getAllActivosFromCache();

                if (cache && cache.length > 0) {
                    data = [...cache];
                } else {
                    if (selectedType !== "Todos" || selectedSector !== "Todos") {
                        if (selectedType !== "Todos" && selectedSector !== "Todos") {
                            data = await getActivosByTipoAndSector(Number(selectedType), selectedSector);
                        } else if (selectedSector !== "Todos") {
                            data = await getActivosBySector(selectedSector);
                        } else {
                            data = await getActivosByTipoId(Number(selectedType));
                        }
                    } else {
                        // Use workaround fallback
                        data = await getRankingActivos(criterioMap[orderBy] || "variacion", orderDesc, selectedType !== "Todos" ? Number(selectedType) : undefined);
                    }
                }
            }

            // Client-Side Filtering (common filter logic)
            if (selectedType !== "Todos") {
                const tObj = tipos.find(t => t.id === Number(selectedType));
                if (tObj) {
                    data = data.filter(a => a.tipo === tObj.nombre);
                }
            }

            if (selectedSector !== "Todos") {
                const sObj = sectores.find(s => s.id === selectedSector);
                if (sObj) {
                    data = data.filter(a => a.sector === sObj.nombre);
                }
            }

            // Apply Currency Filter
            if (selectedCurrency !== "Todos") {
                data = data.filter(a => a.monedaBase === selectedCurrency);
            }

            const criterio = criterioMap[orderBy] || "marketCap";

            if (criterio === "marketCap") {
                data = data.filter(a => a.marketCap !== null && a.marketCap !== undefined && a.marketCap > 0);
            } else if (criterio === "precio") {
                data = data.filter(a => a.precioActual !== null && a.precioActual !== undefined && a.precioActual > 0);
            }
            data.sort((a, b) => {
                let valA: any = 0;
                let valB: any = 0;

                if (criterio === "precio") {
                    valA = a.precioActual ?? 0;
                    valB = b.precioActual ?? 0;
                } else if (criterio === "variacion") {
                    valA = a.variacion24h ?? 0;
                    valB = b.variacion24h ?? 0;
                } else if (criterio === "marketCap") {
                    valA = a.marketCap ?? 0;
                    valB = b.marketCap ?? 0;
                } else {
                    valA = a.symbol;
                    valB = b.symbol;
                }

                if (valB < valA) return orderDesc ? -1 : 1;
                if (valB > valA) return orderDesc ? 1 : -1;
                return 0;
            });

            setActivos(data);
        } catch (error: any) {
            if (error.response?.status !== 401) {
                console.error(error);
            }
        } finally {
            setLoading(false);
        }
    }, [onlyFavorites, selectedType, selectedSector, selectedCurrency, orderBy, orderDesc, tipos, sectores]);

    // Initial load and filter changes
    useEffect(() => {
        if (searchTerm === "") {
            fetchActivos();
        }
    }, [onlyFavorites, selectedType, selectedSector, selectedCurrency, orderBy, orderDesc, fetchActivos, searchTerm]);

    const handleRefresh = useCallback(() => {
        if (searchTerm.length > 0) {
            executeSearch();
        } else {
            fetchActivos();
        }
    }, [searchTerm, executeSearch, fetchActivos]);

    const handleRequestSort = (property: string) => {
        const isDesc = orderBy === property && orderDesc;
        setOrderDesc(!isDesc);
        setOrderBy(property);
    };

    const handleTypeChange = (event: any) => {
        setSelectedType(event.target.value);
        setPage(1);
    };

    const handleSectorChange = (event: any) => {
        setSelectedSector(event.target.value);
        setPage(1);
    };

    const handleCurrencyChange = (event: any) => {
        setSelectedCurrency(event.target.value);
        setPage(1);
    };

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    const resetFilters = () => {
        setSearchTerm("");
        setSelectedType("Todos");
        setSelectedSector("Todos");
        setSelectedCurrency("Todos");
        setPage(1);
    };

    const paginatedActivos = activos.slice(
        (page - 1) * itemsPerPage,
        page * itemsPerPage
    );

    const totalPages = Math.ceil(activos.length / itemsPerPage);

    return {
        selectedType,
        selectedSector,
        selectedCurrency,
        onlyFavorites,
        setOnlyFavorites,
        activos,
        tipos,
        sectores,
        loading,
        searchTerm,
        suggestions,
        orderBy,
        orderDesc,
        page,
        totalPages,
        paginatedActivos,
        setSearchTerm,
        handleRequestSort,
        handleTypeChange,
        handleSectorChange,
        handleCurrencyChange,
        handlePageChange,
        handleRefresh,
        executeSearch,
        resetFilters,
        updateAssetInList: (updatedAsset: ActivoDTO) => {
            setActivos(prev => prev.map(a => a.id === updatedAsset.id ? updatedAsset : a));
            cacheActivos([updatedAsset]);
        }
    };
}
