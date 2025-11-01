import axios from "axios";
import { DualQuoteDTO } from "@/types/Market";
const API = process.env.NEXT_PUBLIC_API_BASE || "https://localhost:7209/api";

export async function getCedearDuals(dolar: "CCL" | "MEP" = "CCL") {
  const url = `${API}/cedears/duals`;
  const res = await axios.get<DualQuoteDTO[]>(url, { params: { dolar } });
  return res.data;
}
