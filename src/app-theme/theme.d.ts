import "@mui/material/styles";

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
