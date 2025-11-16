import axios from "axios";
import { RegisterGeoDataDTO } from "@/types/RegisterGeoData";
import { API } from "./Api";

export async function getRegisterGeoData(): Promise<RegisterGeoDataDTO> {
  const response = await axios.get<RegisterGeoDataDTO>(
    `${API}/geo/register-data`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
}