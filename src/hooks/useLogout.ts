import { useCallback } from "react";

import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";

export function useLogout() {
  const clearSession = useAuthStore((state) => state.clearSession);

  return useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // ignore logout errors, session is still cleared on client
    } finally {
      clearSession();
      localStorage.clear();
    }
  }, [clearSession]);
}
