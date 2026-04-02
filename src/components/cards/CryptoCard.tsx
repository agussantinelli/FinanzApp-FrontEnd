import React from "react";
import { Card, CardContent, Typography, CardActionArea } from "@mui/material";
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
            sx={{
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6
                }
            }}
        >
            <CardActionArea 
                onClick={() => router.push(`/activos/${c.symbol}`)}
                aria-label={`Ver detalles de ${c.name} (${c.symbol})`}
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
                    <Typography 
                        variant="caption" 
                        className={`${styles.cardChange} ${change >= 0 ? styles.positive : styles.negative}`}
                        aria-label={`Variación en 24 horas: ${change > 0 ? "subió" : "bajó"} ${formatPercentage(change)}%`}
                    >
                        24h: {change > 0 ? "+" : ""}{formatPercentage(change)}%
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        Rank #{c.rank}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}
