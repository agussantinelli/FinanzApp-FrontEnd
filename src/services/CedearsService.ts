import axios from "axios";
import { DualQuoteDTO } from "@/types/Market";
import { BASEURL } from "./BaseURL";


export async function getCedearDuals(dolar: "CCL" | "MEP" = "CCL") {
  const url = `${BASEURL}/api/cedears/duals`;
  const res = await axios.get<DualQuoteDTO[]>(url, { params: { dolar } });
  return res.data;
}
