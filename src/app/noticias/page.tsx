import Link from "next/link";
import {
  Box,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Divider,
  Stack,
} from "@mui/material";
import ArticleIcon from "@mui/icons-material/Article";
import PublicIcon from "@mui/icons-material/Public";
import InsightsIcon from "@mui/icons-material/Insights";
import styles from "./styles/Noticias.module.css";

import PageHeader from "@/components/ui/PageHeader";

type NewsSource = {
  key: string;
  title: string;
  subtitle: string;
  href: string;
  icon: React.ReactNode;
  notes?: string[];
};

const SOURCES: NewsSource[] = [
  {
    key: "cmc",
    title: "CoinDesk / CoinMarketCap",
    subtitle: "Lo más leído y últimas de cripto global",
    href: "https://www.coindesk.com/",
    icon: <PublicIcon fontSize="large" />,
    notes: [
      "Cobertura cripto internacional, precios y macro.",
      "Tiene RSS público para integraciones futuras.",
    ],
  },
  {
    key: "bullmarket",
    title: "Bull Market – Claves del Día",
    subtitle: "Resumen diario: mercado local y global",
    href: "https://www.bullmarketbrokers.com/ClavesDia",
    icon: <InsightsIcon fontSize="large" />,
    notes: [
      "Síntesis de novedades y datos macro.",
      "Buen pulso del mercado argentino.",
    ],
  },
  {
    key: "ambito-cripto",
    title: "Ámbito – Criptomonedas",
    subtitle: "Tendencias y notas más leídas en AR",
    href: "https://www.ambito.com/criptomonedas-a5122580",
    icon: <ArticleIcon fontSize="large" />,
    notes: [
      "Cobertura local y economía argentina.",
      "Sección con artículos de alto tráfico.",
    ],
  },
];

export default function Noticias() {
  return (
    <main className={styles.main}>
      <PageHeader
        title="Noticias"
        subtitle="Actualidad Financiera"
        description="Acceso rápido a fuentes confiables para seguir cripto, CCL/MEP y mercado local. Próximamente: feed integrado y filtros por tema."
      />

      <Box className={styles.listContainer}>
        <div className={styles.grid}>
          {SOURCES.map((s) => (
            <Card key={s.key} className={styles.card}>
              <CardContent className={styles.cardContent}>
                <div className={styles.cardHeader}>
                  <div className={styles.iconWrapper}>
                    {s.icon}
                  </div>
                  <Box>
                    <Typography variant="h6" className={styles.cardTitle}>{s.title}</Typography>
                    <Typography variant="body2" className={styles.cardSubtitle}>
                      {s.subtitle}
                    </Typography>
                  </Box>
                </div>

                {s.notes?.length ? (
                  <Box className={styles.notesWrapper}>
                    {s.notes.map((n, i) => (
                      <Typography key={i} component="div" className={styles.noteItem}>
                        {n}
                      </Typography>
                    ))}
                  </Box>
                ) : null}
              </CardContent>

              <CardActions className={styles.actions}>
                <Link href={s.href} target="_blank" rel="noopener noreferrer" style={{ width: '100%' }}>
                  <Button
                    className={styles.actionButton}
                    fullWidth
                    disableElevation
                  >
                    Leer Noticia
                  </Button>
                </Link>
              </CardActions>
            </Card>
          ))}
        </div>
      </Box>
    </main>
  );
}
