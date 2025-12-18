import { http } from "@/lib/http";
import { DualQuoteDTO } from "@/types/Market";

export async function getStockDuals(
  pairs: { localBA: string; usa: string }[],
  dolar: "CCL" | "MEP" = "CCL"
): Promise<DualQuoteDTO[]> {
  const res = await http.post<DualQuoteDTO[]>(
    "/api/stocks/duals",
    pairs,
    { params: { dolar } }
  );
  return res.data;
}

export async function getIndices(): Promise<DualQuoteDTO[]> {
  const res = await http.get<DualQuoteDTO[]>("/api/stocks/indices");
  return res.data;
}
