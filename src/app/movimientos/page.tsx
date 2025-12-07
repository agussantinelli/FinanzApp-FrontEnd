import styles from "./styles/Movimientos.module.css";
import { Typography } from "@mui/material";

export default function Movimientos() {
  return (
    <main className={styles.container}>
      <Typography variant="h4" className={styles.title}>
        Movimientos
      </Typography>
      <Typography color="text.secondary">
        Próximamente: Historial detallado de transacciones.
      </Typography>
    </main>
  );
}