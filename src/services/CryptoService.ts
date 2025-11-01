import axios from "axios";
import { QuoteDTO } from "@/types/Market";

const API = process.env.NEXT_PUBLIC_API_BASE || "https://localhost:7209/api";

export async function getCryptoQuotes(symbols: string[]): Promise<QuoteDTO[]> {
  const url = `${API}/crypto/quotes`;
  const res = await axios.get<QuoteDTO[]>(url, { params: { symbols: symbols.join(",") } });
  return res.data;
}
