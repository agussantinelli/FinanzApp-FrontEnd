"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { debounce } from "@mui/material/utils";

import { useAuth } from "@/hooks/useAuth";
import { searchActivos, getActivoById } from "@/services/ActivosService";
import { createOperacion } from "@/services/OperacionesService";
import { getMisPortafolios, getPortafolioValuado } from "@/services/PortafolioService";
import { ActivoDTO } from "@/types/Activo";
import { TipoOperacion, CreateOperacionDTO } from "@/types/Operacion";
import { PortafolioDTO, PortafolioValuadoDTO } from "@/types/Portafolio";

export function useRegistrarOperacion() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user } = useAuth();

    const [mode, setMode] = useState<"actual" | "historica">("actual");
    const [asset, setAsset] = useState<ActivoDTO | null>(null);
    const [options, setOptions] = useState<ActivoDTO[]>([]);

    // Portfolio State
    const [portfolios, setPortfolios] = useState<PortafolioDTO[]>([]);
    const [portfolioId, setPortfolioId] = useState<string>("");
    const [detailedPortfolio, setDetailedPortfolio] = useState<PortafolioValuadoDTO | null>(null);

    // Form States
    const [tipo, setTipo] = useState<TipoOperacion>(TipoOperacion.Compra);
    const [cantidad, setCantidad] = useState<string>("");
    const [precio, setPrecio] = useState<string>("");

    // Initial date handling
    const getLocalISOString = () => {
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        return now.toISOString().slice(0, 16);
    };
    const [fecha, setFecha] = useState<string>(getLocalISOString());

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Initial Load: Check for URL Params
    useEffect(() => {
        const activoIdParam = searchParams.get('activoId');
        const tipoParam = searchParams.get('tipo');

        if (activoIdParam) {
            getActivoById(activoIdParam)
                .then(data => setAsset(data))
                .catch(err => console.error("Error fetching asset from param:", err));
        }

        if (tipoParam === "VENTA") {
            setTipo(TipoOperacion.Venta);
        } else if (tipoParam === "COMPRA") {
            setTipo(TipoOperacion.Compra);
        }
    }, [searchParams]);

    // Fetch Portfolios
    useEffect(() => {
        getMisPortafolios()
            .then(data => {
                setPortfolios(data);
                if (data.length > 0) {
                    setPortfolioId(data[0].id);
                }
            })
            .catch(console.error);
    }, []);

    // Fetch Detailed Portfolio when ID changes
    useEffect(() => {
        if (!portfolioId) return;
        getPortafolioValuado(portfolioId)
            .then(data => setDetailedPortfolio(data))
            .catch(err => console.error("Error fetching detailed portfolio:", err));
    }, [portfolioId]);

    // Asset Search Logic
    const handleSearch = useMemo(
        () => debounce(async (input: string) => {
            if (input.length < 2) return;
            try {
                const results = await searchActivos(input);
                setOptions(results);
            } catch (e) {
                console.error(e);
            }
        }, 400),
        []
    );

    // Dynamic Updates based on Mode/Asset
    useEffect(() => {
        if (mode === "actual") {
            setFecha(getLocalISOString());
            // Updated to be just a suggestion, user can edit
            if (asset?.precioActual) {
                setPrecio(asset.precioActual.toString());
            }
        }
        // Clear portfolio-specific errors when asset changes
        setError(prev => prev?.includes("en este portafolio") ? null : prev);
    }, [mode, asset]);

    // Real-time Sell Validation
    useEffect(() => {
        if (tipo === TipoOperacion.Venta && asset && detailedPortfolio) {
            const hasAsset = detailedPortfolio.activos.some(a => a.symbol === asset.symbol);
            if (!hasAsset) {
                setError(`No tienes ${asset.symbol} en este portafolio para vender.`);
                setTipo(TipoOperacion.Compra);
            } else {
                // Clear error if it was this specific error and check passes
                setError(prev => prev?.includes("en este portafolio") ? null : prev);
            }
        }
    }, [tipo, asset, detailedPortfolio]);

    const handleSubmit = async () => {
        console.log("HandleSubmit Triggered");

        // Granular validation for easier debugging
        if (!user) {
            setError("Error: Usuario no identificado. Recarga la página.");
            return;
        }
        if (!asset) {
            setError("Debes seleccionar un activo.");
            return;
        }
        if (!portfolioId) {
            setError("Debes seleccionar un portafolio destino.");
            return;
        }
        if (!cantidad || !precio || !fecha) {
            setError("Completa cantidad, precio y fecha.");
            return;
        }

        const qty = Number(cantidad);
        const price = Number(precio);

        if (qty <= 0 || price <= 0) {
            setError("La cantidad y el precio deben ser mayores a 0.");
            return;
        }

        // SELL VALIDATION
        if (tipo === TipoOperacion.Venta) {
            if (!detailedPortfolio) {
                setError("No se pudo verificar el saldo del portafolio. Intenta nuevamente.");
                return;
            }
            const existingAsset = detailedPortfolio.activos.find(a => a.symbol === asset.symbol);
            const availableQty = existingAsset ? existingAsset.cantidad : 0;

            if (qty > availableQty) {
                setError(`Saldo insuficiente. Tienes ${availableQty} ${asset.symbol} disponibles para vender.`);
                return;
            }
        }

        setLoading(true);
        setError(null);

        try {
            const dto: CreateOperacionDTO = {
                personaId: user.id,
                activoId: asset.id,
                portafolioId: portfolioId,
                tipo: tipo,
                cantidad: qty,
                precioUnitario: price,
                monedaOperacion: asset.moneda || "ARS",
                fechaOperacion: new Date(fecha).toISOString(),
            };

            await createOperacion(dto);
            router.push("/portfolio");
        } catch (err: any) {
            console.error("Create error:", err);
            const msg = err.response?.data?.message || "Error al registrar la operación. Verificá los datos.";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    const totalEstimado = (Number(precio) || 0) * (Number(cantidad) || 0);

    const clearError = () => setError(null);

    return {
        mode, setMode,
        asset, setAsset,
        options, handleSearch,
        portfolios, portfolioId, setPortfolioId, detailedPortfolio,
        tipo, setTipo,
        cantidad, setCantidad,
        precio, setPrecio,
        fecha, setFecha,
        loading, error,
        clearError,
        handleSubmit,
        totalEstimado
    };
}
