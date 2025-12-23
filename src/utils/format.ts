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
    if (typeof n !== "number" || Number.isNaN(n)) return "0,00";
    return n.toLocaleString("es-AR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 6,
    });
}

export function formatDateTime(dateInput?: string | Date | null) {
    if (!dateInput) return "—";

    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;

    if (Number.isNaN(date.getTime())) return "—";

    return date.toLocaleString("es-AR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
    });
}
