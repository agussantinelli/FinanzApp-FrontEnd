import { http } from "@/lib/http";
import { RegisterGeoDataDTO } from "@/types/Geo";
import { UserLoginRequest, UserRegisterRequest, UserLoginResponseDTO, AuthenticatedUser } from "@/types/Usuario";

function notifyAuthChanged() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event("fa-auth-changed"));
}

export function setAuthSession(resp: UserLoginResponseDTO) {
  if (typeof window === "undefined") return;

  localStorage.setItem("fa_token", resp.token);
  localStorage.setItem(
    "fa_user",
    JSON.stringify({
      id: resp.personaId,
      nombre: resp.nombre,
      apellido: resp.apellido,
      email: resp.email,
      rol: resp.rol,
    })
  );

  notifyAuthChanged();
}

export function clearAuthSession() {
  if (typeof window === "undefined") return;

  localStorage.removeItem("fa_token");
  localStorage.removeItem("fa_user");

  notifyAuthChanged();
}

export function getCurrentUser(): AuthenticatedUser | null {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem("fa_user");
  if (!raw) return null;

  try {
    return JSON.parse(raw) as AuthenticatedUser;
  } catch {
    return null;
  }
}

// Llamadas HTTP

export async function getRegisterGeoData(): Promise<RegisterGeoDataDTO> {
  const response = await http.get<RegisterGeoDataDTO>("/geo/register-data");
  return response.data;
}

export async function login(data: UserLoginRequest): Promise<UserLoginResponseDTO> {
  const response = await http.post<UserLoginResponseDTO>("/api/auth/login", data);
  setAuthSession(response.data);
  return response.data;
}

export async function register(
  data: UserRegisterRequest
): Promise<UserLoginResponseDTO> {
  const response = await http.post<UserLoginResponseDTO>("/api/auth/register", data);
  setAuthSession(response.data);
  return response.data;
}

// Ruta home según rol
export function getHomePathForRole(rol: string | null | undefined): string {
  const r = rol?.toLowerCase();

  if (r === "admin") return "/admin";
  if (r === "experto") return "/expert";

  // por defecto, inversor o cualquier otro
  return "/dashboard";
}
