import React from "react";
import { Card, CardContent, Typography } from "@mui/material";
import { DualQuoteDTO } from "@/types/Market";
import styles from "./styles/IndexCard.module.css";
import { formatARS, formatUSD, formatPercentage } from "@/utils/format";

interface Props {
    data: DualQuoteDTO;
}

export default function IndexCard({ data: d }: Props) {
    const isRiesgo = d.localSymbol === "RIESGO" || d.dollarRateName === "Puntos";

    let title = d.usSymbol || "";
    if (d.usSymbol?.includes("GSPC") || d.usSymbol?.includes("SPY")) title = "S&P 500";
    if (d.usSymbol?.includes("IXIC") || d.usSymbol?.includes("NDX")) title = "NASDAQ 100";
    if (d.usSymbol?.includes("DIA")) title = "Dow Jones";
    if (d.usSymbol?.includes("XLP")) title = "Consumo (XLP)";
    if (d.usSymbol?.includes("EEM")) title = "Emergentes (EEM)";
    if (d.usSymbol?.includes("EWZ")) title = "Brasil (EWZ)";
    if (d.localSymbol === "RIESGO") title = "Riesgo País";
    if (d.localSymbol === "MERVAL" || d.localSymbol === "MERV" || d.localSymbol === "^MERV" || d.usSymbol === "^MERV") title = "Merval";

    if (isRiesgo) {
        return (
            <Card className={`${styles.accionesCard} ${styles.riskCard}`}>
                <CardContent className={styles.riskCardContent}>
                    <Typography variant="h6" className={styles.cardTitleRisk}>
                        {title}
                    </Typography>
                    <Typography variant="caption" className={`${styles.cardSubtitleRisk} ${styles.riskSubtitleBlock}`}>
                        Índice Nacional
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

    const isLocalIndex = d.dollarRateName === 'ARS';
    const labelArs = isLocalIndex ? "Valor (ARS)" : "CEDEAR (ARS)";
    const labelUsd = isLocalIndex ? "Valor (USD)" : "Indice USA (USD)";

    return (
        <Card className={styles.accionesCard}>
            <CardContent>
                <Typography variant="h6" className={styles.cardTitle}>
                    {title}
                </Typography>

                <Typography variant="caption" className={styles.cardSubtitle}>
                    {isLocalIndex ? 'Índice Nacional' : 'Índice Internacional'}
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
                    Ref: {d.dollarRateName} ({formatARS(d.usedDollarRate)})
                </Typography>
            </CardContent>
        </Card>
    );
}
