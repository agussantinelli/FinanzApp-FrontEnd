'use client';
import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRecomendaciones } from '@/hooks/useRecomendaciones';
import { getSectores } from "@/services/SectorService";
import { SectorDTO } from "@/types/Sector";

const getRiesgoString = (val: number | string) => {
    switch (Number(val)) {
        case 1: return "Conservador";
        case 2: return "Moderado";
        case 3: return "Agresivo";
        case 4: return "Especulativo";
        default: return "";
    }
};

const getHorizonteString = (val: number | string) => {
    switch (Number(val)) {
        case 1: return "Intradia";
        case 2: return "CortoPlazo";
        case 3: return "MedianoPlazo";
        case 4: return "LargoPlazo";
        default: return "";
    }
};

export function useMisRecomendaciones(targetUserId?: string) {
    const { user } = useAuth();
    const effectiveUserId = targetUserId || user?.id;

    const { data, loading, error, applyFilters } = useRecomendaciones({
        soloActivas: false,
        enabled: !!effectiveUserId,
        requireFilter: true,
        enCursoOnly: true
    });

    console.log("useMisRecomendaciones Render - User:", effectiveUserId, "Data:", data?.length, "Loading:", loading);

    const [sectores, setSectores] = useState<SectorDTO[]>([]);

    // Dropdown States
    const [selectedSector, setSelectedSector] = useState("");
    const [selectedHorizonte, setSelectedHorizonte] = useState("");
    const [selectedRiesgo, setSelectedRiesgo] = useState("");

    // Applied Filters State (Client-side)
    const [activeRiesgo, setActiveRiesgo] = useState("");
    const [activeHorizonte, setActiveHorizonte] = useState("");
    const [activeSector, setActiveSector] = useState("");

    // Initial load
    useEffect(() => {
        console.log("useMisRecomendaciones Effect - Calling applyFilters with User:", effectiveUserId);
        if (effectiveUserId) {
            applyFilters({ autorId: effectiveUserId, soloActivas: false });
        }
        getSectores().then(setSectores).catch(console.error);
    }, [effectiveUserId, applyFilters]);

    const handleApply = () => {
        if (!effectiveUserId) return;

        // Update Hook Filters (Force Author Fetch always)
        applyFilters({
            autorId: effectiveUserId,
            soloActivas: false,
            sectorId: undefined, // Force undefined so hook uses autorId
            horizonteId: undefined,
            riesgoId: undefined
        });

        // Update Client-Side Filters
        setActiveRiesgo(selectedRiesgo);
        setActiveHorizonte(selectedHorizonte);
        setActiveSector(selectedSector);
    };

    const handleClear = () => {
        setSelectedSector("");
        setSelectedHorizonte("");
        setSelectedRiesgo("");
        setActiveRiesgo("");
        setActiveHorizonte("");
        setActiveSector("");

        if (effectiveUserId) {
            // Reset to just ME + inactive
            applyFilters({
                autorId: effectiveUserId,
                soloActivas: false,
                sectorId: undefined,
                horizonteId: undefined,
                riesgoId: undefined,
                activoId: undefined
            });
        }
    };

    // Filter Logic
    const displayedData = useMemo(() => {
        if (!data) return [];

        return data.filter(item => {
            // Data is strictly fetched by Author now, so we trust ownership.

            // 1. Sector Check (Client Side)
            if (activeSector) {
                const anyItem = item as any;
                // Check possible field names for sectors in DTO
                const itemSectores = anyItem.sectoresObjetivo || anyItem.sectores;

                // If data is missing sector info, we can't filter positively, so we hide it to respect the filter.
                if (!itemSectores || !Array.isArray(itemSectores)) return false;

                const hasSector = itemSectores.some((s: any) => s.id === activeSector);
                if (!hasSector) return false;
            }

            // 2. Risk Check
            if (activeRiesgo) {
                const riesgoStr = getRiesgoString(activeRiesgo);
                if (item.riesgo !== riesgoStr) return false;
            }

            // 3. Horizon Check
            if (activeHorizonte) {
                const horizonStr = getHorizonteString(activeHorizonte);
                if (item.horizonte !== horizonStr) return false;
            }

            return true;
        });
    }, [data, effectiveUserId, activeRiesgo, activeHorizonte, activeSector]);

    return {
        displayedData,
        loading,
        error,
        sectores,
        selectedSector,
        setSelectedSector,
        selectedHorizonte,
        setSelectedHorizonte,
        selectedRiesgo,
        setSelectedRiesgo,
        handleApply,
        handleClear
    };
}
