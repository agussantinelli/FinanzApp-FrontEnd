export const getTickerForDolar = (name?: string): string | undefined => {
    if (!name) return undefined;
    const n = name.toLowerCase();

    if (n.includes('blue')) return 'USD_BLUE';
    if (n.includes('oficial')) return 'USD_OFICIAL';
    if (n.includes('mep') || n.includes('bolsa')) return 'USD_MEP';
    if (n.includes('contado') || n.includes('ccl')) return 'USD_CCL';
    if (n.includes('cripto')) return 'USD_CRIPTO';
    if (n.includes('tarjeta')) return 'USD_TARJETA';
    if (n.includes('mayorista')) return 'USD_MAYORISTA';

    return name;
};
