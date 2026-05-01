export type LoginSuccessData = {
  userId: string;
  fullName: string;
  role: string;
  avatarUrl: string;
  accessToken: string;
  refreshToken: string;
};

export type ChangePasswordDTO = {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}