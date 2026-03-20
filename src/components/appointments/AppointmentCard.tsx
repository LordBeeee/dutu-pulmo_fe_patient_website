import { useNavigate } from 'react-router-dom';

import { getAppointmentStatusConfig, getAppointmentTypeLabel } from '@/constants/appointment-status';
import type { AppointmentResponse } from '@/services/appointment.service';

type AppointmentCardProps = {
  appointment: AppointmentResponse;
};

function formatDateTime(date?: string) {
  if (!date) return '---';
  return new Date(date).toLocaleString('vi-VN');
}

function AppointmentCard({ appointment }: AppointmentCardProps) {
  const navigate = useNavigate();
  const statusConfig = getAppointmentStatusConfig(appointment.status);
  const hospitalName = appointment.hospital?.name || 'Đang cập nhật cơ sở';

  const handleNavigate = () => {
    navigate(`/appointment-schedule/${appointment.id}`);
  };

  return (
    <article
      className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-md transition cursor-pointer"
      onClick={handleNavigate}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          handleNavigate();
        }
      }}
    >
      <div className="flex justify-between items-start gap-3">
        <div className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold border ${statusConfig.bgClass} ${statusConfig.textClass} ${statusConfig.borderClass}`}>
          <span className="material-symbols-outlined text-sm">{statusConfig.icon}</span>
          <span>{statusConfig.label}</span>
        </div>
        <span className="text-xs text-slate-400">#{appointment.appointmentNumber || appointment.id}</span>
      </div>

      <div className="mt-4 flex items-center gap-4">
        <div className="w-14 h-14 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center flex-shrink-0">
          {appointment.doctor?.avatarUrl ? (
            <img src={appointment.doctor.avatarUrl} alt={appointment.doctor.fullName || 'Bác sĩ'} className="w-full h-full object-cover" />
          ) : (
            <span className="material-symbols-outlined text-slate-400">person</span>
          )}
        </div>

        <div className="min-w-0">
          <h3 className="font-semibold text-slate-900 line-clamp-1">{appointment.doctor?.fullName || 'Chưa có bác sĩ'}</h3>
          <p className="text-sm text-slate-500 line-clamp-1">{appointment.doctor?.specialty || 'Chưa có chuyên khoa'}</p>
        </div>
      </div>

      <div className="mt-4 space-y-2 text-sm">
        <div className="flex items-start gap-2 text-slate-500">
          <span className="material-symbols-outlined text-base mt-0.5">location_on</span>
          <span className="line-clamp-1">{hospitalName}</span>
        </div>
        <div className="flex items-start gap-2 text-slate-500">
          <span className="material-symbols-outlined text-base mt-0.5">calendar_today</span>
          <span>{formatDateTime(appointment.scheduledAt)}</span>
        </div>
        <div className="flex items-start gap-2 text-slate-500">
          <span className="material-symbols-outlined text-base mt-0.5">local_hospital</span>
          <span>{getAppointmentTypeLabel(appointment.appointmentType)}</span>
        </div>
      </div>

      <div className="mt-5 flex gap-3">
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            handleNavigate();
          }}
          className="flex-1 rounded-xl border border-slate-200 py-2.5 text-slate-700 font-semibold hover:bg-slate-50 transition-colors"
        >
          Xem chi tiết
        </button>

        {appointment.appointmentType === 'VIDEO' && ['CONFIRMED', 'CHECKED_IN', 'IN_PROGRESS'].includes(appointment.status) && (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              navigate(`/video-call/${appointment.id}`);
            }}
            className="flex-1 rounded-xl bg-blue-600 py-2.5 text-white font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <span className="material-symbols-outlined text-sm">video_call</span>
            Vào khám
          </button>
        )}
      </div>
    </article>
  );
}

export default AppointmentCard;
