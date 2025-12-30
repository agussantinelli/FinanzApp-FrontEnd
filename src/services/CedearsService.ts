import { http } from "@/lib/http";
import { DualQuoteDTO } from "@/types/Market";

export async function getCedearDuals(
  dolar: "CCL" | "MEP" = "CCL"
): Promise<DualQuoteDTO[]> {
  const res = await http.get<DualQuoteDTO[]>("/api/cedears/duals", {
    params: { dolar },
  });
  return res.data;
}