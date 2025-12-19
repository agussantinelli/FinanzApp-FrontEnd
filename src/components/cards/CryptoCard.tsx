import React from "react";
import { Card, CardContent, Typography } from "@mui/material";
import { CryptoTopDTO } from "@/types/Crypto";
import styles from "./styles/CryptoCard.module.css";

interface Props {
    data: CryptoTopDTO;
}

function formatUSD(n?: number) {
    if (typeof n !== "number" || Number.isNaN(n)) return "—";
    return n.toLocaleString("es-AR", { style: "currency", currency: "USD", maximumFractionDigits: 2 });
}

export default function CryptoCard({ data: c }: Props) {
    const change = c.changePct24h ?? 0;

    return (
        <Card className={styles.cryptoCard}>
            <CardContent>
                <Typography variant="h6" className={styles.cardTitle}>
                    {c.name}
                </Typography>
                <Typography variant="caption" className={styles.cardSubtitle}>
                    {c.symbol}
                </Typography>
                <Typography variant="body2" className={styles.cardText}>
                    Precio: <strong>{formatUSD(c.priceUsd)}</strong>
                </Typography>
                <Typography variant="caption" className={`${styles.cardChange} ${change >= 0 ? styles.positive : styles.negative}`}>
                    24h: {change > 0 ? "+" : ""}{change}%
                </Typography>
                <Typography variant="caption" color="text.secondary">
                    Rank #{c.rank}
                </Typography>
            </CardContent>
        </Card>
    );
}
