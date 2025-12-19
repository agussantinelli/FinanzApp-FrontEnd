export function formatARS(n?: number | null) {
    if (typeof n !== "number" || Number.isNaN(n)) return "—";
    return n.toLocaleString("es-AR", {
        style: "currency",
        currency: "ARS",
        maximumFractionDigits: 2,
    });
}

export function formatUSD(n?: number | null) {
    if (typeof n !== "number" || Number.isNaN(n)) return "—";
    return n.toLocaleString("es-AR", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 2,
    });
}
