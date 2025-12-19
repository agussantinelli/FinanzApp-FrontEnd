import { http } from "@/lib/http";
import { CryptoTopDTO } from "@/types/Crypto";

export async function getTopCryptos(
  limit = 10
): Promise<CryptoTopDTO[]> {
  const res = await http.get<CryptoTopDTO[]>("/api/crypto/top", {
    params: { limit },
  });
  return res.data;
}

export async function getCryptoBySymbol(symbol: string): Promise<CryptoTopDTO> {
  const res = await http.get<CryptoTopDTO>(`/api/crypto/${symbol}`);
  return res.data;
}
