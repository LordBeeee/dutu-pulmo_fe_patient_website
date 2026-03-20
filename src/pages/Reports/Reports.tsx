import { Link } from 'react-router-dom';
import { useReports } from '@/hooks/use-reports';

const REPORT_TYPE_LABEL: Record<string, string> = {
  doctor: 'Báo cáo bác sĩ',
  appointment: 'Báo cáo lịch khám',
  system: 'Báo cáo hệ thống',
};

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string; icon: string }> = {
  pending: {
    label: 'Chờ duyệt',
    bg: 'bg-amber-50',
    text: 'text-amber-600',
    icon: 'hourglass_empty',
  },
  processing: {
    label: 'Đang xử lý',
    bg: 'bg-blue-50',
    text: 'text-blue-600',
    icon: 'sync',
  },
  resolved: {
    label: 'Đã giải quyết',
    bg: 'bg-emerald-50',
    text: 'text-emerald-600',
    icon: 'check_circle',
  },
  rejected: {
    label: 'Từ chối',
    bg: 'bg-red-50',
    text: 'text-red-600',
    icon: 'cancel',
  },
};

export default function ReportsPage() {
  const { data: reports = [], isLoading, isError, refetch } = useReports();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Báo cáo của tôi</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Theo dõi trạng thái các yêu cầu hỗ trợ và báo cáo sự cố</p>
        </div>

        <Link
          to="/reports/new"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:shadow-xl transition-all"
        >
          <span className="material-symbols-outlined">add</span>
          Gửi báo cáo mới
        </Link>
      </div>

      <div className="min-h-[400px]">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : isError ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-red-100 dark:border-red-900/30 p-12 text-center transition-colors">
            <span className="material-symbols-outlined text-red-400 text-5xl mb-4">error</span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Đã có lỗi xảy ra</h3>
            <p className="text-slate-500 dark:text-slate-400 mt-2 mb-6">Không thể tải danh sách báo cáo của bạn.</p>
            <button
              onClick={() => void refetch()}
              className="px-8 py-3 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 hover:shadow-xl transition-all"
            >
              Thử lại
            </button>
          </div>
        ) : reports.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-20 text-center transition-colors">
            <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-4xl text-slate-300 dark:text-slate-600">flag</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Chưa có báo cáo nào</h3>
            <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-sm mx-auto">
              Khi bạn gửi các báo cáo về sự cố hoặc khiếu nại, chúng sẽ xuất hiện tại đây để bạn tiện theo dõi.
            </p>
            <Link
              to="/reports/new"
              className="mt-8 inline-flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-2xl font-bold"
            >
              Gửi báo cáo ngay
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {reports.map((report) => {
              const status = STATUS_CONFIG[report.status] || STATUS_CONFIG.pending;
              return (
                <div key={report.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-md transition-all">
                  <div className="p-5">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
                          <span className="material-symbols-outlined text-primary">flag</span>
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 dark:text-slate-100">
                            {REPORT_TYPE_LABEL[report.reportType] || report.reportType}
                          </h3>
                          <p className="text-xs text-slate-400">
                            Gửi ngày {new Date(report.createdAt).toLocaleDateString('vi-VN')}
                          </p>
                        </div>
                      </div>
                      
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${status.bg} ${status.text} dark:bg-opacity-10`}>
                        <span className="material-symbols-outlined text-sm">{status.icon}</span>
                        {status.label}
                      </div>
                    </div>

                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl italic transition-colors">
                      "{report.content}"
                    </p>

                    {report.adminNotes && (
                      <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-900/30 transition-colors">
                        <p className="text-[11px] font-bold text-blue-500 dark:text-blue-400 uppercase tracking-wider mb-1">Phản hồi từ Admin</p>
                        <p className="text-sm text-slate-700 dark:text-slate-300">{report.adminNotes}</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
