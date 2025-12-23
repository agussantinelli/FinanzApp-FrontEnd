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


export function formatPercentage(n?: number | null) {
    if (typeof n !== "number" || Number.isNaN(n)) return "—";
    return n.toLocaleString("es-AR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

export function formatQuantity(n?: number | null) {
    if (typeof n !== "number" || Number.isNaN(n)) return "0";
    if (Number.isInteger(n)) return n.toLocaleString("es-AR");
    return n.toLocaleString("es-AR", {
        maximumFractionDigits: 8,
    });
}
