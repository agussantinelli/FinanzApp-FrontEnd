import axios from "axios";
import { CryptoTopDTO } from "@/types/Crypto";


const API = process.env.NEXT_PUBLIC_API_BASE || "https://localhost:7209/api";

export async function getTopCryptos(limit = 10): Promise<CryptoTopDTO[]> {
  const res = await axios.get<CryptoTopDTO[]>(`${API}/crypto/top`, { params: { limit } });
  return res.data;
}