export interface QuoteDTO {
  symbol: string;
  price: number;
  currency: "USD" | "ARS" | string;
  timestampUtc: string;
  source: string;
}

export interface DualQuoteDTO {
  localSymbol: string;
  localPriceARS: number;
  usSymbol: string;
  usPriceUSD: number;
  cedearRatio?: number;
  usedDollarRate: number;
  dollarRateName: string;
  localPriceUSD: number;
  usPriceARS: number;
  theoreticalCedearARS?: number;
  localChange?: number;
  localChangePct?: number;
  usChange?: number;
  usChangePct?: number;
}
