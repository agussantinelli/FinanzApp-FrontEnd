import axios from "axios";
import { CryptoTopDTO } from "@/types/Crypto";
import { BASEURL } from "./BaseURL";

export async function getTopCryptos(limit = 10): Promise<CryptoTopDTO[]> {
  const res = await axios.get<CryptoTopDTO[]>(`${BASEURL}/api/crypto/top`, { params: { limit } });
  return res.data;
}