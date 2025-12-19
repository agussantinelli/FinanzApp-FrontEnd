import styles from "./styles/Movimientos.module.css";
import { Typography } from "@mui/material";
import PageHeader from "@/components/ui/PageHeader";

export default function Movimientos() {
  return (
    <main className={styles.container}>
      <PageHeader
        title="Movimientos"
        subtitle="Historial de Transacciones"
      />
      <Typography color="text.secondary">
        Próximamente: Historial detallado de transacciones.
      </Typography>
    </main>
  );
}
