import type { 
  NotificationType,
  NotificationItem 
} from "@/types/notification";
import { formatRelativeTime } from "@/utils/date";
import { cn } from "@/lib/utils";

const NOTIFICATION_CONFIG: Record<
  NotificationType,
  { icon: string; color: string; bgColor: string }
> = {
  APPOINTMENT: { icon: 'calendar_today', color: '#0A7CFF', bgColor: '#EFF6FF' },
  PAYMENT: { icon: 'payments', color: '#16a34a', bgColor: '#F0FDF4' },
  SYSTEM: { icon: 'notifications', color: '#d97706', bgColor: '#FFFBEB' },
  GENERAL: { icon: 'info', color: '#64748b', bgColor: '#F8FAFC' },
  CHAT: { icon: 'chat', color: '#8b5cf6', bgColor: '#F5F3FF' },
  MEDICAL: { icon: 'medical_services', color: '#ef4444', bgColor: '#FEF2F2' },
};

interface NotificationCardProps {
  item: NotificationItem;
  onClick?: (id: string) => void;
}

export function NotificationCard({ item, onClick }: NotificationCardProps) {
  const isUnread = item.status === 'UNREAD';
  const config = NOTIFICATION_CONFIG[item.type] || NOTIFICATION_CONFIG['GENERAL'];

  return (
    <div 
      onClick={() => onClick?.(item.id)}
      className={cn(
        "flex gap-4 p-4 transition-colors cursor-pointer border-b border-slate-100 dark:border-slate-800",
        isUnread ? "bg-blue-50/50 dark:bg-blue-900/10" : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
      )}
    >
      <div 
        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: config.bgColor }}
      >
        <span className="material-icons-round text-[20px]" style={{ color: config.color }}>
          {config.icon}
        </span>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between gap-2 items-start">
          <h4 className={cn(
            "text-sm line-clamp-2 leading-tight",
            isUnread ? "font-bold text-slate-900 dark:text-white" : "text-slate-700 dark:text-slate-300"
          )}>
            {item.title}
          </h4>
          {isUnread && (
            <div className="w-2.5 h-2.5 bg-blue-500 rounded-full flex-shrink-0 mt-1 shadow-sm shadow-blue-500/50" />
          )}
        </div>
        
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-3">
          {item.content}
        </p>
        
        <span className="text-[11px] text-slate-400 mt-2 block font-medium">
          {formatRelativeTime(item.createdAt)}
        </span>
      </div>
    </div>
  );
}
