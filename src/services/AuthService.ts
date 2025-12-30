import { http } from "@/lib/http";
import { clearCache } from "@/lib/activos-cache";
import { RegisterGeoDataDTO } from "@/types/Geo";
import { UserLoginRequest, UserRegisterRequest, UserLoginResponseDTO, AuthenticatedUser, RolUsuario } from "@/types/Usuario";
import { ChangePasswordDTO, ResetPasswordRequestDTO, ResetPasswordConfirmDTO, SetInitialPasswordDTO } from "@/types/Auth";
import { CompletarPerfilDTO } from "@/types/Usuario";

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
      urlFotoPerfil: resp.urlFotoPerfil,
      expiraUtc: resp.expiraUtc,
      perfilCompletado: resp.perfilCompletado,
      tieneContrasenaConfigurada: resp.tieneContrasenaConfigurada,
    })
  );

  notifyAuthChanged();
}

export function clearAuthSession() {
  if (typeof window === "undefined") return;

  sessionStorage.clear();
  clearCache();
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

export async function verifySession() {
  const user = getCurrentUser();
  if (!user) return;

  try {
    let endpoint = "/api/dashboard/inversor/stats";


    if (user.rol === RolUsuario.Experto) {
      endpoint = "/api/dashboard/experto/stats";
    } else if (user.rol === RolUsuario.Admin) {
      endpoint = "/api/dashboard/admin/stats";
    }

    await http.get(endpoint);
  } catch (error) {

    console.error("Session verification probe failed", error);
  }
}

export function hasRole(rolesPermitidos: RolUsuario[]): boolean {
  const user = getCurrentUser();
  if (!user) return false;

  return rolesPermitidos.includes(user.rol as RolUsuario);
}

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

  return response.data;
}

export async function googleLogin(idToken: string): Promise<UserLoginResponseDTO> {
  const response = await http.post<UserLoginResponseDTO>("/api/auth/google", { idToken });
  setAuthSession(response.data);
  return response.data;
}

export async function completeProfile(data: CompletarPerfilDTO): Promise<UserLoginResponseDTO> {
  const response = await http.post<UserLoginResponseDTO>("/api/auth/complete-profile", data);
  return response.data as any;
}

export async function setInitialPassword(data: SetInitialPasswordDTO): Promise<void> {
  await http.post("/api/auth/set-initial-password", data);
}

export async function changePassword(data: ChangePasswordDTO): Promise<void> {
  await http.post("/api/auth/change-password", data);
}

export async function resetPasswordRequest(data: ResetPasswordRequestDTO): Promise<void> {
  await http.post("/api/auth/reset-password-request", data);
}

export async function resetPasswordConfirm(data: ResetPasswordConfirmDTO): Promise<void> {
  await http.post("/api/auth/reset-password-confirm", data);
}

export function getHomePathForRole(rol: string | null | undefined): string {
  const r = rol?.toLowerCase();

  if (r === "admin") return "/dashboard-admin";
  if (r === "experto") return "/dashboard-experto";


  return "/dashboard-inversor";
}
