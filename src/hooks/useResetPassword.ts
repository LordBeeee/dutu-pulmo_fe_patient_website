import { useMutation } from '@tanstack/react-query';

import { authService } from '@/services/auth.service';
import type { ResetPasswordWithOtpDto } from '@/types/auth.types';

export function useResetPassword() {
  return useMutation({
    mutationFn: (payload: ResetPasswordWithOtpDto) => authService.resetPasswordOtp(payload),
  });
}
