import { useState } from 'react';
import { 
  useNotifications, 
  useMarkAsRead, 
  useMarkAllAsRead 
} from '@/hooks/use-notifications';
import { NotificationCard } from '@/components/Notification/NotificationCard';
import type { NotificationStatus } from '@/types/notification';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

export default function NotificationsPage() {
  const [filter, setFilter] = useState<NotificationStatus | 'ALL'>('ALL');
  
  const { data, isLoading, isError, refetch } = useNotifications({
    page: 1,
    limit: 50,
    status: filter === 'ALL' ? undefined : filter,
  });

  const markAsReadMutation = useMarkAsRead();
  const markAllAsReadMutation = useMarkAllAsRead();

  const handleMarkAsRead = async (id: string) => {
    try {
      await markAsReadMutation.mutateAsync(id);
    } catch (error) {
      toast.error('Không thể đánh dấu đã đọc');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsReadMutation.mutateAsync();
      toast.success('Đã đánh dấu tất cả là đã đọc');
    } catch (error) {
      toast.error('Có lỗi xảy ra khi thực hiện');
    }
  };

  if (isError) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <h2 className="text-xl font-bold text-red-600 mb-2">Không thể tải thông báo</h2>
        <p className="text-slate-500 mb-6">Đã có lỗi xảy ra trong quá trình kết nối với máy chủ.</p>
        <Button onClick={() => refetch()}>Thử lại ngay</Button>
      </div>
    );
  }

  const notifications = data?.items || [];
  const unreadCount = notifications.filter(n => n.status === 'UNREAD').length;

  return (
    <main className="max-w-3xl mx-auto px-4 py-8 md:py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            Thông báo
            {unreadCount > 0 && (
              <span className="inline-flex items-center justify-center bg-red-100 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                {unreadCount} mới
              </span>
            )}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Cập nhật những tin tức và nhắc hẹn mới nhất</p>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs h-9 px-4 font-medium"
              onClick={handleMarkAllAsRead}
              disabled={markAllAsReadMutation.isPending}
            >
              <span className="material-icons-round text-sm mr-2">done_all</span>
              {markAllAsReadMutation.isPending ? 'Đang xử lý...' : 'Đánh dấu tất cả'}
            </Button>
          )}
        </div>
      </div>

      <div className="flex gap-2 mb-6 p-1 bg-slate-100 dark:bg-slate-800/50 rounded-xl w-fit">
        <button
          onClick={() => setFilter('ALL')}
          className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
            filter === 'ALL' 
              ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' 
              : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          Tất cả
        </button>
        <button
          onClick={() => setFilter('UNREAD')}
          className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
            filter === 'UNREAD' 
              ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' 
              : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          Chưa đọc
        </button>
      </div>

      <Card className="overflow-hidden border-slate-200 dark:border-slate-800 shadow-sm rounded-2xl">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="p-4 flex gap-4">
                  <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-3 w-3/4" />
                    <Skeleton className="h-2 w-20" />
                  </div>
                </div>
              ))}
            </div>
          ) : notifications.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center text-center px-6">
              <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center mb-4">
                <span className="material-icons-round text-slate-300 text-3xl">notifications_none</span>
              </div>
              <h3 className="text-slate-900 dark:text-white font-semibold">Hiện chưa có thông báo</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 max-w-[240px]">
                Các thông báo quan trọng về lịch khám và sức khỏe sẽ xuất hiện ở đây.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {notifications.map((item) => (
                <NotificationCard 
                  key={item.id} 
                  item={item} 
                  onClick={handleMarkAsRead}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      {!isLoading && notifications.length > 0 && (
        <p className="text-center text-xs text-slate-400 mt-8 font-medium">
          Duy trì cập nhật thông báo để không bỏ lỡ thông tin quan trọng
        </p>
      )}
    </main>
  );
}
