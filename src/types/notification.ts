export type NotificationType = 
  | 'GENERAL'
  | 'PAYMENT'
  | 'SYSTEM'
  | 'APPOINTMENT'
  | 'CHAT'
  | 'MEDICAL';

export type NotificationStatus = 'UNREAD' | 'READ';

export type NotificationItem = {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  content: string;
  status: NotificationStatus;
  refId?: string | null;
  refType?: string | null;
  createdAt?: string;
};

export type NotificationQuery = {
  page?: number;
  limit?: number;
  type?: NotificationType;
  status?: NotificationStatus;
};

export type NotificationListResponse = {
  items: NotificationItem[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
};

export type NotificationUnreadCountResponse = {
  count: number;
};

export type NotificationActionResponse = {
  success: boolean;
  message: string;
};
