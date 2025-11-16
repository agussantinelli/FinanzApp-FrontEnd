import { http } from "./Http";
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
