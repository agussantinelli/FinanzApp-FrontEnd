import axios from "axios";
import { DualQuoteDTO } from "@/types/Market";
import { API } from "./Api";


export async function getCedearDuals(dolar: "CCL" | "MEP" = "CCL") {
  const url = `${API}/cedears/duals`;
  const res = await axios.get<DualQuoteDTO[]>(url, { params: { dolar } });
  return res.data;
}
