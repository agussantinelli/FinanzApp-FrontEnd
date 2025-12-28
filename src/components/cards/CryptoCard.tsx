import React from "react";
import { Card, CardContent, Typography } from "@mui/material";
import { CryptoTopDTO } from "@/types/Crypto";
import styles from "./styles/CryptoCard.module.css";
import { formatUSD, formatPercentage } from "@/utils/format";
import { useRouter } from "next/navigation";

interface Props {
    data: CryptoTopDTO;
}

export default function CryptoCard({ data: c }: Props) {
    const change = c.changePct24h ?? 0;
    const router = useRouter();

    return (
        <Card
            className={styles.cryptoCard}
            onClick={() => router.push(`/activos/${c.symbol}`)}
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
                    {c.name}
                </Typography>
                <Typography variant="caption" className={styles.cardSubtitle}>
                    {c.symbol}
                </Typography>
                <Typography variant="body2" className={styles.cardText}>
                    Precio: <strong>{formatUSD(c.priceUsd)}</strong>
                </Typography>
                <Typography variant="caption" className={`${styles.cardChange} ${change >= 0 ? styles.positive : styles.negative}`}>
                    24h: {change > 0 ? "+" : ""}{formatPercentage(change)}%
                </Typography>
                <Typography variant="caption" color="text.secondary">
                    Rank #{c.rank}
                </Typography>
            </CardContent>
        </Card>
    );
}
