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

    const [selectedSector, setSelectedSector] = useState("");
    const [selectedHorizonte, setSelectedHorizonte] = useState("");
    const [selectedRiesgo, setSelectedRiesgo] = useState("");

    const [activeRiesgo, setActiveRiesgo] = useState("");
    const [activeHorizonte, setActiveHorizonte] = useState("");
    const [activeSector, setActiveSector] = useState("");

    useEffect(() => {
        console.log("useMisRecomendaciones Effect - Calling applyFilters with User:", effectiveUserId);
        if (effectiveUserId) {
            applyFilters({ autorId: effectiveUserId, soloActivas: false });
        }
        getSectores().then(setSectores).catch(console.error);
    }, [effectiveUserId, applyFilters]);

    const handleApply = () => {
        if (!effectiveUserId) return;

        applyFilters({
            autorId: effectiveUserId,
            soloActivas: false,
            sectorId: undefined,
            horizonteId: undefined,
            riesgoId: undefined
        });

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

    const displayedData = useMemo(() => {
        if (!data) return [];

        return data.filter(item => {
            if (activeSector) {
                const anyItem = item as any;
                const itemSectores = anyItem.sectoresObjetivo || anyItem.sectores;

                if (!itemSectores || !Array.isArray(itemSectores)) return false;

                const hasSector = itemSectores.some((s: any) => s.id === activeSector);
                if (!hasSector) return false;
            }

            if (activeRiesgo) {
                const riesgoStr = getRiesgoString(activeRiesgo);
                if (item.riesgo !== riesgoStr) return false;
            }

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
