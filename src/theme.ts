import { createTheme } from "@mui/material/styles";
import { colors, radius } from "@/design-tokens";

declare module "@mui/material/styles" {
  interface Theme {
    custom: {
      paperBg: string;
      cardBg: string;
      divider: string;
      dividerSoft: string;
      shadow: string;
      shadowHover: string;
      borderColor: string;
    };
  }
  // para poder usar theme.custom en sx
  interface ThemeOptions {
    custom?: {
      paperBg?: string;
      cardBg?: string;
      divider?: string;
      dividerSoft?: string;
      shadow?: string;
      shadowHover?: string;
      borderColor?: string;
    };
  }
}

const theme = createTheme({
  palette: {
    mode: "dark",
    background: { default: colors.black, paper: colors.paper },
    primary: { main: colors.primary },
    secondary: { main: colors.secondary },
    text: { primary: colors.textPrimary, secondary: colors.textSecondary },
  },
  shape: { borderRadius: radius },
  typography: {
    fontFamily: [
      "Inter",
      "-apple-system",
      "BlinkMacSystemFont",
      "Segoe UI",
      "Roboto",
      "Helvetica Neue",
      "Arial",
      "sans-serif",
    ].join(","),
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: { background: "rgba(0,0,0,.5)", backdropFilter: "blur(8px)" },
      },
    },
    MuiPaper: {
      styleOverrides: { root: { backgroundImage: "none" } },
    },
  },
  custom: {
    paperBg: colors.paperBgTranslucent,
    cardBg: colors.cardBgTranslucent,
    divider: colors.divider,
    dividerSoft: colors.dividerSoft,
    shadow: colors.shadow,
    shadowHover: colors.shadowHover,
    borderColor: colors.primary,
  },
});

export default theme;
