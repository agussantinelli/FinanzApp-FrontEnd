import axios from "axios";
import { RegisterGeoDataDTO } from "@/types/RegisterGeoData";
import { LoginRequest } from "@/types/LoginRequest";
import { RegisterRequest } from "@/types/RegisterRequest";
import { LoginResponseDTO } from "@/types/LoginReponse";

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

export async function login(data: LoginRequest): Promise<LoginResponseDTO> {
  const response = await axios.post<LoginResponseDTO>(
    `${BASEURL}/auth/login`,
    data,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
}

export async function register(
  data: RegisterRequest
): Promise<LoginResponseDTO> {
  const response = await axios.post<LoginResponseDTO>(
    `${BASEURL}/auth/register`,
    data,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
}
