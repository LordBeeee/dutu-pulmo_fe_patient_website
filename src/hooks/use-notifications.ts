import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import notificationService from "@/services/notification.service";
import type { NotificationQuery } from "@/types/notification";
import { useAuthStore } from "@/store/auth.store";

export const useNotifications = (query?: NotificationQuery) => {
  const user = useAuthStore((state) => state.user);
  return useQuery({
    queryKey: ["notifications", query],
    queryFn: () => notificationService.getNotifications(query),
    enabled: !!user,
  });
};

export const useNotificationUnreadCount = () => {
  const user = useAuthStore((state) => state.user);
  return useQuery({
    queryKey: ["notifications", "unread-count"],
    queryFn: () => notificationService.getUnreadCount(),
    enabled: !!user,
    refetchInterval: 30000, // Refresh every 30s
    staleTime: 0,
    gcTime: 300000,
    refetchOnMount: "always",
  });
};

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => notificationService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};

export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};
