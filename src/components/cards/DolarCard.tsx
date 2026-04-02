import React from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, Typography, CardActionArea } from "@mui/material";
import { DolarDTO } from "@/types/Dolar";
import styles from "./styles/DolarCard.module.css";
import { formatARS, formatPercentage } from "@/utils/format";

interface Props {
    data: DolarDTO | null;
    title: string;
    ticker?: string;
}

export default function DolarCard({ data: c, title, ticker }: Props) {
    const router = useRouter();

    if (!c) return null;

    return (
        <Card
            className={styles.dolarCard}
            sx={{
                transition: 'transform 0.2s',
                '&:hover': ticker ? { transform: 'translateY(-4px)' } : {}
            }}
        >
            <CardActionArea
                disabled={!ticker}
                onClick={() => ticker && router.push(`/activos/${ticker}`)}
                aria-label={ticker ? `Ver detalles de ${title}` : `${title}`}
            >
                <CardContent>
                    <Typography variant="h6" className={styles.cardTitle}>
                        {title}
                    </Typography>
                    <Typography variant="body2" className={styles.cardText}>
                        Compra: <strong>{formatARS(c?.compra)}</strong>
                    </Typography>
                    <Typography variant="body2" className={styles.cardText}>
                        Venta: <strong>{formatARS(c?.venta)}</strong>
                    </Typography>
                    {c?.variacion !== undefined && c?.variacion !== null && (
                        <Typography 
                            variant="caption" 
                            className={`${styles.cardText} ${styles.cardVariation}`}
                            aria-label={`Variación: ${c.variacion > 0 ? "subió" : "bajó"} ${formatPercentage(c.variacion)}%`}
                        >
                            Variación:
                            <span className={`${styles.variationValue} ${c.variacion >= 0 ? styles.positive : styles.negative}`}>
                                {c.variacion > 0 ? "+" : ""}{formatPercentage(c.variacion)}%
                            </span>
                        </Typography>
                    )}
                </CardContent>
            </CardActionArea>
        </Card>
    );
}
