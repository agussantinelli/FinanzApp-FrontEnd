import { createTheme } from "@mui/material/styles";
import { colors, radius } from "@/design-tokens";

const theme = createTheme({
  palette: {
    mode: "dark",
    background: { default: colors.black, paper: colors.paper },
    primary: { main: colors.primary },
    secondary: { main: colors.secondary },
    text: { primary: colors.textPrimary, secondary: colors.textSecondary },
  },
  shape: { borderRadius: radius },
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
});

export default theme;
