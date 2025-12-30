"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { debounce } from "@mui/material/utils";

import { useAuth } from "@/hooks/useAuth";
import { searchActivos, getActivoById } from "@/services/ActivosService";
import { createOperacion, getOperacionesByPersona } from "@/services/OperacionesService";
import { getMisPortafolios, getPortafolioValuado } from "@/services/PortafolioService";
import { validateTemporalConsistency } from "@/utils/operacionValidation";
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


    const [portfolios, setPortfolios] = useState<PortafolioDTO[]>([]);
    const [portfolioId, setPortfolioId] = useState<string>("");
    const [detailedPortfolio, setDetailedPortfolio] = useState<PortafolioValuadoDTO | null>(null);


    const [tipo, setTipo] = useState<TipoOperacion>(TipoOperacion.Compra);
    const [cantidad, setCantidad] = useState<string>("");
    const [precio, setPrecio] = useState<string>("");
    const [moneda, setMoneda] = useState<string>("ARS");


    const getLocalISOString = () => {
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        return now.toISOString().slice(0, 16);
    };
    const [fecha, setFecha] = useState<string>(getLocalISOString());

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);


    useEffect(() => {
        const activoIdParam = searchParams.get('activoId');
        const tipoParam = searchParams.get('tipo');

        if (activoIdParam) {
            getActivoById(activoIdParam)
                .then(data => setAsset(data))
                .catch(err => {
                    console.error("Error fetching asset from param:", err);
                    setError("No se pudo cargar el activo indicado en el enlace.");
                });
        }

        if (tipoParam === "VENTA") {
            setTipo(TipoOperacion.Venta);
        } else if (tipoParam === "COMPRA") {
            setTipo(TipoOperacion.Compra);
        }
    }, [searchParams]);


    useEffect(() => {
        getMisPortafolios()
            .then(data => {
                setPortfolios(data);
                if (data.length > 0) {
                    setPortfolioId(data[0].id);
                }
            })
            .catch(err => {
                console.error(err);
                setError("Error al cargar tus portafolios. Intenta recargar.");
            });
    }, []);


    useEffect(() => {
        if (!portfolioId) return;
        getPortafolioValuado(portfolioId)
            .then(data => setDetailedPortfolio(data))
            .catch(err => {
                console.error("Error fetching detailed portfolio:", err);
                setError("No se pudo cargar el detalle del portafolio seleccionado.");
            });
    }, [portfolioId]);


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


    useEffect(() => {
        if (mode === "actual") {
            setFecha(getLocalISOString());
            if (asset?.precioActual) {
                setPrecio(asset.precioActual.toString());
            }
        }


        if (asset) {

            const assetCurrency = (asset as any).moneda || asset.monedaBase || "ARS";
            setMoneda(assetCurrency);
        }


        setError(prev => prev?.includes("en este portafolio") ? null : prev);
    }, [mode, asset]);


    useEffect(() => {
        if (tipo === TipoOperacion.Venta && asset && detailedPortfolio) {
            const hasAsset = detailedPortfolio.activos.some(a => a.symbol === asset.symbol);
            if (!hasAsset) {
                setError(`No tienes ${asset.symbol} en este portafolio para vender.`);
                setTipo(TipoOperacion.Compra);
            } else {

                setError(prev => prev?.includes("en este portafolio") ? null : prev);
            }
        }
    }, [tipo, asset, detailedPortfolio]);

    const handleSubmit = async () => {
        console.log("HandleSubmit Triggered");


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
            const allOps = await getOperacionesByPersona(user.id);
            const assetOps = allOps.filter(o => o.activoSymbol === asset.symbol);

            const targetOpEvent = {
                fecha: new Date(fecha).toISOString(),
                tipo: tipo,
                cantidad: qty,
                activoSymbol: asset.symbol
            };

            const validation = validateTemporalConsistency(assetOps, 'CREATE', targetOpEvent);
            if (!validation.valid) {
                setError(validation.message || "Error de validación temporal.");
                setLoading(false);
                return;
            }
        } catch (valErr) {
            console.error("Validation error:", valErr);
            setError("Error al validar consistencia de operaciones. Intenta nuevamente.");
            setLoading(false);
            return;
        }

        try {
            const dto: CreateOperacionDTO = {
                personaId: user.id,
                activoId: asset.id,
                portafolioId: portfolioId,
                tipo: tipo,
                cantidad: qty,
                precioUnitario: price,
                monedaOperacion: moneda,
                fechaOperacion: new Date(fecha).toISOString(),
            };

            await createOperacion(dto);
            setSuccess("Operación registrada correctamente. Redirigiendo...");

            setTimeout(() => {
                router.push("/portfolio");
            }, 1000);
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
        moneda, setMoneda,
        fecha, setFecha,
        loading, error, success,
        clearError,
        clearSuccess: () => setSuccess(null),
        handleSubmit,
        totalEstimado
    };
}
