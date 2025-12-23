import { http } from "@/lib/http";
import { RegisterGeoDataDTO } from "@/types/Geo";
import { UserLoginRequest, UserRegisterRequest, UserLoginResponseDTO, AuthenticatedUser, RolUsuario } from "@/types/Usuario";

function notifyAuthChanged() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event("fa-auth-changed"));
}

export function setAuthSession(resp: UserLoginResponseDTO) {
  if (typeof window === "undefined") return;

  sessionStorage.setItem("fa_token", resp.token);
  sessionStorage.setItem(
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

  sessionStorage.clear();
  notifyAuthChanged();
}

export function getCurrentUser(): AuthenticatedUser | null {
  if (typeof window === "undefined") return null;

  const raw = sessionStorage.getItem("fa_user");
  if (!raw) return null;

  try {
    return JSON.parse(raw) as AuthenticatedUser;
  } catch {
    return null;
  }
}

/**
 * Validates the current session by making a request to a protected endpoint.
 * If the token is invalid (server restart), the global 401 interceptor will trigger logout.
 */
export async function verifySession() {
  const user = getCurrentUser();
  if (!user) return;

  try {
    let endpoint = "/api/dashboard/inversor/stats";

    // Check role to call the correct protected endpoint
    // This avoids 403 errors if an Admin tries to access Inversor stats
    if (user.rol === RolUsuario.Experto) {
      endpoint = "/api/dashboard/experto/stats";
    } else if (user.rol === RolUsuario.Admin) {
      endpoint = "/api/dashboard/admin/stats";
    }

    await http.get(endpoint);
  } catch (error) {
    // Ignore other errors, we only care about 401 which is handled by interceptor
    console.error("Session verification probe failed", error);
  }
}

export function hasRole(rolesPermitidos: RolUsuario[]): boolean {
  const user = getCurrentUser();
  if (!user) return false;
  // Cast string role to RolUsuario for check if necessary, or ensure types align
  return rolesPermitidos.includes(user.rol as RolUsuario);
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

  if (r === "admin") return "/dashboard-admin";
  if (r === "experto") return "/dashboard-experto";

  // por defecto, inversor o cualquier otro
  return "/dashboard-inversor";
}
