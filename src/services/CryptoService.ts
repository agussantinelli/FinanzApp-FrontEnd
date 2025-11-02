import axios from "axios";
import { CryptoTopDTO } from "@/types/Crypto";
import { API } from "./Api";

export async function getTopCryptos(limit = 10): Promise<CryptoTopDTO[]> {
  const res = await axios.get<CryptoTopDTO[]>(`${API}/crypto/top`, { params: { limit } });
  return res.data;
}