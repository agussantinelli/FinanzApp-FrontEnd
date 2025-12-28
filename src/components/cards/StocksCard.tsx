import React from 'react';
import { Card, CardContent, Typography } from "@mui/material";
import { DualQuoteDTO } from "@/types/Market";
import styles from "./styles/StocksCard.module.css";
import { formatARS, formatUSD, formatPercentage } from "@/utils/format";
import { useRouter } from "next/navigation";

interface Props {
    data: DualQuoteDTO & { name?: string };
    title?: string;
}

export default function StocksCard({ data: d, title }: Props) {
    const isCedearLocal = d.cedearRatio != null;
    const displayTitle = title || d.name || d.usSymbol;
    const router = useRouter();

    return (
        <Card
            className={styles.accionesCard}
            onClick={() => router.push(`/activos/${d.localSymbol}`)}
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
                    {displayTitle}
                </Typography>

                <Typography variant="caption" className={styles.cardSubtitle}>
                    {isCedearLocal ? `Precio local = CEDEAR · Ratio ${d.cedearRatio}:1` : "Precio local = Acción BYMA (no CEDEAR)"}
                </Typography>

                <Typography className={styles.cardSymbol}>
                    {d.localSymbol} ↔ {d.usSymbol}
                </Typography>

                <Typography className={styles.cardText}>
                    Local (ARS): <strong>{formatARS(d.localPriceARS)}</strong>
                    {d.localChangePct !== undefined && d.localChangePct !== null && (
                        <span className={`${styles.changePercent} ${d.localChangePct >= 0 ? styles.positive : styles.negative}`}>
                            {d.localChangePct > 0 ? "+" : ""}{formatPercentage(d.localChangePct)}%
                        </span>
                    )}
                </Typography>
                <Typography className={styles.cardText}>
                    USA (USD): <strong>{formatUSD(d.usPriceUSD)}</strong>
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
