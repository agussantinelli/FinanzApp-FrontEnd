"use client";

import * as React from "react";
import { AccessDenied } from "@/components/AccessDenied";

export default function AccessDeniedPage() {
  return (
    <AccessDenied
      title="Acceso restringido"
      message="No tenés permisos para ver esta sección de FinanzApp."
      backHref="/"
      backLabel="Volver al inicio"
    />
  );
}
