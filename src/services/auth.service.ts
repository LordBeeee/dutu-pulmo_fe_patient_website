import { api } from '@/services/api';
import type {
  AuthMessageResponseDto,
  ForgotPasswordDto,
  LoginDto,
  LoginResponseDto,
  RefreshTokenDto,
  RefreshTokenResponseDto,
  RegisterDto,
  RegisterResponseDto,
  ResendVerificationDto,
  ResetPasswordResponseDto,
  ResetPasswordWithOtpDto,
  VerifyOtpDto,
} from '@/types/auth.types';

export const authService = {
  register: async (payload: RegisterDto) => {
    const { data } = await api.post<RegisterResponseDto>('/auth/register', payload);
    return data;
  },

  login: async (payload: LoginDto) => {
    const { data } = await api.post<LoginResponseDto>('/auth/login', payload);
    return data;
  },

  forgotPasswordOtp: async (payload: ForgotPasswordDto) => {
    const { data } = await api.post<AuthMessageResponseDto>('/auth/forgot-password-otp', payload);
    return data;
  },

  resetPasswordOtp: async (payload: ResetPasswordWithOtpDto) => {
    const { data } = await api.post<ResetPasswordResponseDto>('/auth/reset-password-otp', payload);
    return data;
  },

  refreshToken: async (payload: RefreshTokenDto) => {
    const { data } = await api.post<RefreshTokenResponseDto>('/auth/refresh', payload);
    return data;
  },

  logout: async () => {
    const { data } = await api.post<AuthMessageResponseDto>('/auth/logout');
    return data;
  },

  verifyOtp: async (payload: VerifyOtpDto) => {
    const { data } = await api.post<AuthMessageResponseDto>('/auth/verify-otp', payload);
    return data;
  },

  resendOtp: async (payload: ResendVerificationDto) => {
    const { data } = await api.post<AuthMessageResponseDto>('/auth/resend-otp', payload);
    return data;
  },

  addFcmToken: async (token: string): Promise<void> => {
    await api.post('/users/me/fcm-token', { token });
  },

  removeFcmToken: async (token: string): Promise<void> => {
    await api.delete('/users/me/fcm-token', { data: { token } });
  },

  testPushNotification: async (): Promise<void> => {
    await api.post('/notifications/test-push', {
      title: '🎉 Test Push Notification',
      content: 'Hello từ Patient Website! Đây là thông báo đẩy thử nghiệm.',
    });
  },
};

export default authService;
