export type AuthMessageResponseDto = {
  message?: string;
};

export type AuthUser = {
  id: string;
  fullName?: string;
  avatarUrl?: string | null;
  status?: string;
  doctorId?: string;
  patientId?: string;
  email?: string;
  phone?: string;
  gender?: string;
  dateOfBirth?: string;
};

export type LoginDto = {
  email: string;
  password: string;
};

export type LoginResponseDto = {
  accessToken: string;
  refreshToken: string;
  account: {
    user: AuthUser;
  };
};

export type RegisterDto = {
  fullName: string;
  email: string;
  phone?: string;
  password: string;
};

export type RegisterResponseDto = AuthMessageResponseDto;

export type ForgotPasswordDto = {
  email: string;
};

export type ResendVerificationDto = {
  email: string;
};

export type VerifyOtpDto = {
  email: string;
  otp: string;
};

export type ResetPasswordWithOtpDto = {
  email: string;
  otp: string;
  newPassword: string;
};

export type ResetPasswordResponseDto = AuthMessageResponseDto;

export type RefreshTokenDto = {
  refreshToken: string;
};

export type RefreshTokenResponseDto = {
  accessToken: string;
  refreshToken?: string;
};
