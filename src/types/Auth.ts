export interface ChangePasswordDTO {
    currentPassword: string;
    newPassword: string;
}

export interface ResetPasswordRequestDTO {
    email: string;
}

export interface ResetPasswordConfirmDTO {
    email: string;
    token: string;
    newPassword: string;
}
