export interface CryptoTopDTO {
  rank: number;
  name: string;
  symbol: string;
  priceUsd: number;
  change24hUsd?: number | null;
  changePct24h?: number | null;
  marketCap?: number | null;
  source: string;
  timestampUtc: string;
}