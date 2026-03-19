import { useMutation } from '@tanstack/react-query';

import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/store/auth.store';
import type { LoginDto } from '@/types/auth.types';

export function useLogin() {
  const setSession = useAuthStore((state) => state.setSession);

  return useMutation({
    mutationFn: (payload: LoginDto) => authService.login(payload),
    onSuccess: (data) => {
      setSession({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        user: data.account.user,
      });
    },
  });
}
