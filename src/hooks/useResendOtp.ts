import { useMutation } from '@tanstack/react-query';

import { authService } from '@/services/auth.service';
import type { ResendVerificationDto } from '@/types/auth.types';

export function useResendOtp() {
  return useMutation({
    mutationFn: (payload: ResendVerificationDto) => authService.resendOtp(payload),
  });
}
