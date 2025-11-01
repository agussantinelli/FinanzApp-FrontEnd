import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#0ea5e9" },
    secondary: { main: "#a78bfa" },
    background: { default: "transparent", paper: "rgba(255,255,255,0.82)" },
  },
  shape: { borderRadius: 10 },
});
