import { useMutation } from '@tanstack/react-query';
import { authService } from '@/services/auth.service';
import type { ChangePasswordDto } from '@/types/auth.types';

export function useChangePassword() {
  return useMutation({
    mutationFn: (payload: ChangePasswordDto) => authService.changePassword(payload),
  });
}
