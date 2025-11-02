import axios from "axios";
import { DualQuoteDTO } from "@/types/Market";
import { API } from "./Api";

export async function getStockDuals(pairs: { localBA: string; usa: string }[], dolar: "CCL" | "MEP" = "CCL") {
  const url = `${API}/stocks/duals`;
  const res = await axios.post<DualQuoteDTO[]>(url, pairs, { params: { dolar } });
  return res.data;
}
