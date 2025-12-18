import { createTheme } from "@mui/material/styles";
import { colors, radius } from "./design-tokens";

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
    interface ThemeOptions {
        custom?: Partial<Theme["custom"]>;
    }
}

declare module '@mui/material/Chip' {
    interface ChipPropsVariantOverrides {
        soft: true;
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
            "Roboto",
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
