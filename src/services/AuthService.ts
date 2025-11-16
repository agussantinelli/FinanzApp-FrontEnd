import axios from "axios";
import { RegisterGeoDataDTO } from "@/types/RegisterGeoData";
import { BASEURL } from "./BaseURL";

export async function getRegisterGeoData(): Promise<RegisterGeoDataDTO> {
  const response = await axios.get<RegisterGeoDataDTO>(
    `${BASEURL}/geo/register-data`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
}