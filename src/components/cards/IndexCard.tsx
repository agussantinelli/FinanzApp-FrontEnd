import React from "react";
import { Card, CardContent, Typography } from "@mui/material";
import { DualQuoteDTO } from "@/types/Market";
import styles from "./styles/IndexCard.module.css";
import { formatARS, formatUSD, formatPercentage } from "@/utils/format";
import { useRouter } from "next/navigation";

interface Props {
    data: DualQuoteDTO;
}

const INDEX_METADATA: Record<string, { title: string, desc: string }> = {
    "^GSPC": { title: "S&P 500", desc: "Índice Standard & Poor's 500." },
    "^IXIC": { title: "Nasdaq 100", desc: "Índice tecnológico." },
    "^DJI": { title: "Dow Jones Industrial", desc: "Promedio industrial." },
    "XLP": { title: "Consumo Básico", desc: "Empresas defensivas." },
    "EEM": { title: "Mercados Emergentes", desc: "Economías en desarrollo." },
    "EWZ": { title: "Brasil (EWZ)", desc: "Empresas brasileñas." },
    "^MERV": { title: "S&P Merval", desc: "Líderes argentinas." },
    "MERVAL": { title: "S&P Merval", desc: "Líderes argentinas." },
    "EMBI_AR": { title: "Riesgo País", desc: "Índice JP Morgan." },
    "RIESGO": { title: "Riesgo País", desc: "Índice JP Morgan." }
};

export default function IndexCard({ data: d }: Props) {
    const router = useRouter();
    const isRiesgo = d.localSymbol === "RIESGO" || d.dollarRateName === "Puntos" || d.localSymbol === "EMBI_AR";

    // Resolve Metadata
    // Try to match based on US Symbol or Local Symbol
    const key = Object.keys(INDEX_METADATA).find(k =>
        (d.usSymbol && d.usSymbol.includes(k)) ||
        (d.localSymbol && d.localSymbol.includes(k))
    );
    const meta = key ? INDEX_METADATA[key] : null;

    const title = meta?.title || d.usSymbol || d.localSymbol || "Índice";
    const subtitle = meta?.desc || (d.dollarRateName === 'ARS' ? 'Índice Nacional' : 'Índice Internacional');

    // Navigation target
    let targetSymbol = d.usSymbol || d.localSymbol;
    if (isRiesgo) targetSymbol = "EMBI_AR";

    if (isRiesgo) {
        return (
            <Card
                className={`${styles.accionesCard} ${styles.riskCard}`}
                onClick={() => targetSymbol && router.push(`/activos/${targetSymbol}`)}
                sx={{
                    cursor: 'pointer',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 6
                    }
                }}
            >
                <CardContent className={styles.riskCardContent}>
                    <Typography variant="h6" className={styles.cardTitleRisk}>
                        {title}
                    </Typography>
                    <Typography variant="caption" className={`${styles.cardSubtitleRisk} ${styles.riskSubtitleBlock}`}>
                        {subtitle}
                    </Typography>
                    <Typography variant="h3" className={styles.riskValue}>
                        {Math.round(d.usPriceUSD)}
                    </Typography>
                    <Typography variant="caption" className={styles.cardSubtitleRisk}>
                        Puntos Básicos (pbs)
                    </Typography>
                </CardContent>
            </Card>
        );
    }

    const isLocalIndex = d.dollarRateName === 'ARS' || title === 'S&P Merval';
    const labelArs = isLocalIndex ? "Valor (ARS)" : "CEDEAR (ARS)";
    const labelUsd = isLocalIndex ? "Valor (USD)" : "Indice USA (USD)";

    return (
        <Card
            className={styles.accionesCard}
            onClick={() => targetSymbol && router.push(`/activos/${targetSymbol}`)}
            sx={{
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6
                }
            }}
        >
            <CardContent>
                <Typography variant="h6" className={styles.cardTitle}>
                    {title}
                </Typography>

                <Typography variant="caption" className={styles.cardSubtitle}>
                    {subtitle}
                </Typography>

                <Typography className={styles.cardSymbol}>
                    {d.localSymbol}
                </Typography>

                <Typography className={styles.cardText}>
                    {labelArs}: <strong>{formatARS(d.usPriceARS)}</strong>
                    {d.usChangePct !== undefined && d.usChangePct !== null && (
                        <span className={`${styles.changePercent} ${d.usChangePct >= 0 ? styles.positive : styles.negative}`}>
                            {d.usChangePct > 0 ? "+" : ""}{formatPercentage(d.usChangePct)}%
                        </span>
                    )}
                </Typography>

                <Typography className={styles.cardText}>
                    {labelUsd}: <strong>{formatUSD(d.usPriceUSD)}</strong>
                    {d.usChangePct !== undefined && d.usChangePct !== null && (
                        <span className={`${styles.changePercent} ${d.usChangePct >= 0 ? styles.positive : styles.negative}`}>
                            {d.usChangePct > 0 ? "+" : ""}{formatPercentage(d.usChangePct)}%
                        </span>
                    )}
                </Typography>

                <Typography variant="caption" color="text.secondary" className={styles.cardRate}>
                    Tasa (CCL): {d.usedDollarRate.toLocaleString("es-AR")}
                </Typography>
            </CardContent>
        </Card>
    );
}
