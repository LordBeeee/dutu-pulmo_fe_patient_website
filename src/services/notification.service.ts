import { api } from "./api";
import type { 
  NotificationActionResponse, 
  NotificationListResponse, 
  NotificationQuery, 
  NotificationUnreadCountResponse 
} from "@/types/notification";

export const notificationService = {
  /**
   * Lấy danh sách thông báo của người dùng
   */
  getNotifications: async (query?: NotificationQuery): Promise<NotificationListResponse> => {
    const response = await api.get<NotificationListResponse>('/notifications', {
      params: query,
    });
    return response.data;
  },

  /**
   * Lấy số lượng thông báo chưa đọc
   */
  getUnreadCount: async (): Promise<number> => {
    const response = await api.get<NotificationUnreadCountResponse>('/notifications/unread-count');
    return response.data.count;
  },

  /**
   * Đánh dấu tất cả thông báo là đã đọc
   */
  markAllAsRead: async (): Promise<NotificationActionResponse> => {
    const response = await api.patch<NotificationActionResponse>('/notifications/read-all');
    return response.data;
  },

  /**
   * Đánh dấu một thông báo là đã đọc
   */
  markAsRead: async (id: string): Promise<NotificationActionResponse> => {
    const response = await api.patch<NotificationActionResponse>(`/notifications/${id}/read`);
    return response.data;
  },
};

export default notificationService;
