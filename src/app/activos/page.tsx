"use client"; 
import Link from "next/link";
import {
  Box,
  Card,
  CardActions,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography,
  Button,
} from "@mui/material";
// 👇 Grid clásico (v1)
import Grid from "@mui/material/Grid";

import PaymentsIcon from "@mui/icons-material/Payments";
import TimelineIcon from "@mui/icons-material/Timeline";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import PublicIcon from "@mui/icons-material/Public";
import AssignmentIcon from "@mui/icons-material/Assignment";

type AssetCard = {
  key: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  tcInfo: string;
  what: string;
  pros: string[];
  cons: string[];
  href: string;
};

const CARDS: AssetCard[] = [
  {
    key: "efectivo",
    title: "Efectivo (ARS / USD)",
    subtitle: "Caja y cuentas a la vista",
    icon: <PaymentsIcon fontSize="large" />,
    tcInfo:
      "Valuación directa: ARS al valor nominal, USD al tipo de cambio elegido (Oficial/MEP/CCL/Blue según configuración).",
    what:
      "Saldo disponible en pesos y dólares (cuenta bancaria, billeteras, broker). Sirve de base para el patrimonio y movimientos rápidos.",
    pros: ["Liquidez inmediata.", "Sin riesgo de precio inmediato.", "Base para compras/ventas."],
    cons: [
      "ARS pierde poder adquisitivo por inflación.",
      "USD requiere criterio de conversión para consolidar.",
    ],
    href: "/activos/efectivo",
  },
  {
    key: "crypto",
    title: "Cripto",
    subtitle: "Activos digitales (BTC, ETH, etc.)",
    icon: <TimelineIcon fontSize="large" />,
    tcInfo:
      "Cotización en USD (exchange/API). Conversión a ARS con CCL/MEP (configurable).",
    what:
      "Criptomonedas y tokens listados en exchanges. Alta volatilidad y mercados 24/7.",
    pros: ["Liquidez alta en pares principales.", "Diversificación.", "Mercado 24/7."],
    cons: ["Volatilidad elevada.", "Riesgo de custodia/contra-parte.", "Marco regulatorio cambiante."],
    href: "/activos/crypto",
  },
  {
    key: "acciones-ar",
    title: "Acciones Argentinas",
    subtitle: "Renta variable local (BYMA)",
    icon: <ShowChartIcon fontSize="large" />,
    tcInfo:
      "Precio en ARS (rueda local). Para consolidar en USD podés usar MEP/CCL.",
    what:
      "Participaciones de empresas listadas en Argentina. Expuestas a riesgo país y regulatorio local.",
    pros: ["Acceso directo local.", "Posibles dividendos.", "Estrategias con MEP/CCL."],
    cons: ["Riesgo macro alto.", "Liquidez dispar.", "Regulaciones (parking/cupos)."],
    href: "/activos/acciones-ar",
  },
  {
    key: "cedears",
    title: "CEDEARs",
    subtitle: "Acciones del exterior en ARS",
    icon: <PublicIcon fontSize="large" />,
    tcInfo:
      "Precio en ARS reflejando subyacente USD * ratio CEDEAR y tipo de cambio implícito (CCL).",
    what:
      "Certificados de acciones/ETFs del exterior que cotizan en ARS. Exposición global desde el mercado local.",
    pros: ["Diversificación internacional.", "Cobertura parcial vía CCL implícito.", "Amplia oferta."],
    cons: ["Ratios y spreads confunden.", "Liquidez variable.", "Riesgo de la estructura del programa."],
    href: "/activos/cedears",
  },
  {
    key: "on",
    title: "Obligaciones Negociables (ONs)",
    subtitle: "Bonos corporativos",
    icon: <AssignmentIcon fontSize="large" />,
    tcInfo:
      "Valuación por paridad/precio sucio. Conversión a ARS/USD según especie y consolidación.",
    what:
      "Deuda de empresas. Pagan cupones y capital al vencimiento; riesgo/retorno dependen del emisor.",
    pros: ["Ingresos más predecibles.", "Riesgo corporativo (menos soberano).", "Variedad de monedas/plazos."],
    cons: ["Riesgo de crédito.", "Liquidez heterogénea.", "Sensibles a tasas/riesgo país."],
    href: "/activos/ons",
  },
];

export default function Activos() {
  return (
    <main style={{ padding: 24 }}>
      <Typography variant="h4" gutterBottom>
        Tipos de Activos
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Vista general del portafolio: definiciones, valuación y conversión ARS ↔ USD por clase de activo.
      </Typography>

      <Grid container spacing={3}>
        {CARDS.map((c) => (
          <Grid key={c.key} item xs={12} md={6}>
            <Card
              sx={{
                height: "100%",
                borderRadius: "16px",
                overflow: "hidden",
                border: "1px solid",
                borderColor: "divider",
                backdropFilter: "blur(4px)",
              }}
            >
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
                  {c.icon}
                  <Box>
                    <Typography variant="h6">{c.title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {c.subtitle}
                    </Typography>
                  </Box>
                </Stack>

                <Box sx={{ my: 1 }}>
                  <Chip label={c.tcInfo} variant="outlined" size="small" sx={{ maxWidth: "100%" }} />
                </Box>

                <Typography variant="body2" sx={{ mt: 2, mb: 1.5 }}>
                  {c.what}
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                      Ventajas
                    </Typography>
                    <Stack component="ul" sx={{ pl: 2, m: 0 }} spacing={0.5}>
                      {c.pros.map((p, i) => (
                        <Typography key={i} component="li" variant="body2">
                          {p}
                        </Typography>
                      ))}
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                      Desventajas
                    </Typography>
                    <Stack component="ul" sx={{ pl: 2, m: 0 }} spacing={0.5}>
                      {c.cons.map((p, i) => (
                        <Typography key={i} component="li" variant="body2">
                          {p}
                        </Typography>
                      ))}
                    </Stack>
                  </Grid>
                </Grid>
              </CardContent>

              <Divider />
              <CardActions sx={{ justifyContent: "flex-end", p: 2 }}>
                <Button component={Link} href={c.href} variant="contained" size="small">
                  Ver sección
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </main>
  );
}
