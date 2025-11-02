import Link from "next/link";
import {
  Box,
  Card,
  CardContent,
  CardActions,
  Typography,
  Grid,
  Button,
  Divider,
  Stack,
} from "@mui/material";
import ArticleIcon from "@mui/icons-material/Article";
import PublicIcon from "@mui/icons-material/Public";
import InsightsIcon from "@mui/icons-material/Insights";

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
    href: "https://www.coindesk.com/", // página principal con feed y tops
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
    <main style={{ padding: 24 }}>
      <Typography variant="h4" gutterBottom>
        Noticias
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Acceso rápido a fuentes confiables para seguir cripto, CCL/MEP y mercado
        local. Próximamente: feed integrado y filtros por tema.
      </Typography>

      <Grid container spacing={3}>
        {SOURCES.map((s) => (
          <Grid item xs={12} md={6} key={s.key}>
            <Card
              sx={{
                height: "100%",
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
                  {s.icon}
                  <Box>
                    <Typography variant="h6">{s.title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {s.subtitle}
                    </Typography>
                  </Box>
                </Stack>
                {s.notes?.length ? (
                  <Box component="ul" sx={{ pl: 3, m: 0, mt: 1 }}>
                    {s.notes.map((n, i) => (
                      <Typography key={i} component="li" variant="body2">
                        {n}
                      </Typography>
                    ))}
                  </Box>
                ) : null}
              </CardContent>
              <Divider />
              <CardActions sx={{ justifyContent: "flex-end", p: 2 }}>
                {/* Link afuera del Button para evitar pasar funciones cliente como prop */}
                <Link href={s.href} target="_blank" rel="noopener noreferrer">
                  <Button variant="contained" size="small">
                    Ver ahora
                  </Button>
                </Link>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </main>
  );
}