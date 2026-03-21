import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import CancelAppointmentModal from '@/components/appointments/CancelAppointmentModal';
import {
  canCancelAppointment,
  getAppointmentStatusConfig,
  getAppointmentTypeLabel,
  PATIENT_CANCEL_BEFORE_MINUTES,
} from '@/constants/appointment-status';
import { useAppointmentDetail, useCancelAppointment } from '@/hooks/use-appointments';
import { useMyReviews } from '@/hooks/use-reviews';

function formatDate(date?: string) {
  if (!date) return '---';
  return new Date(date).toLocaleDateString('vi-VN');
}

function formatTime(date?: string) {
  if (!date) return '---';
  return new Date(date).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
}

function formatMoney(value?: string) {
  if (!value) return '---';
  return `${Number(value).toLocaleString('vi-VN')} VND`;
}

function sanitizeRichText(html: string): string {
  if (!html) return '';

  const parser = new DOMParser();
  const document = parser.parseFromString(html, 'text/html');

  document.querySelectorAll('script, style, iframe, object, embed').forEach((node) => node.remove());

  document.querySelectorAll('*').forEach((element) => {
    [...element.attributes].forEach((attribute) => {
      const name = attribute.name.toLowerCase();
      const value = attribute.value.trim().toLowerCase();

      if (name.startsWith('on') || value.startsWith('javascript:')) {
        element.removeAttribute(attribute.name);
      }
    });
  });

  return document.body.innerHTML;
}

function renderPatientNotes(notes?: string) {
  if (!notes) {
    return <p className="font-medium text-slate-900">---</p>;
  }

  const trimmed = notes.trim();
  const looksLikeHtml = /<\/?[a-z][\s\S]*>/i.test(trimmed);

  if (!looksLikeHtml) {
    return <p className="font-medium text-slate-900 whitespace-pre-line">{trimmed}</p>;
  }

  return (
    <div
      className="prose prose-sm max-w-none text-slate-900 prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-li:my-0"
      dangerouslySetInnerHTML={{ __html: sanitizeRichText(trimmed) }}
    />
  );
}

const AppointmentScheduleDetail: React.FC = () => {
  const reviewsQuery = useMyReviews();
  const navigate = useNavigate();
  const { id } = useParams();

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [now, setNow] = useState<number>(0);

  useEffect(() => {
    setNow(Date.now());
    const interval = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(interval);
  }, []);

  const appointmentQuery = useAppointmentDetail(id);
  const cancelAppointmentMutation = useCancelAppointment();

  const appointment = appointmentQuery.data ?? null;
  const statusConfig = getAppointmentStatusConfig(appointment?.status);

  const canCancel = canCancelAppointment(appointment?.status);

  const hasReviewedThisAppointment = reviewsQuery.data?.some((r) => r.appointmentId === appointment?.id);

  // minutesUntilStart handles warning UI logic
  const minutesUntilStart = (new Date(appointment?.scheduledAt || '').getTime() - now) / (1000 * 60);
  const isConfirmed = appointment?.status === 'CONFIRMED';
  const isCancelled = appointment?.status === 'CANCELLED';

  const showCancelWarning =
    isConfirmed &&
    minutesUntilStart < PATIENT_CANCEL_BEFORE_MINUTES + 60 &&
    minutesUntilStart >= PATIENT_CANCEL_BEFORE_MINUTES;

  const hoursUntilDeadline = Math.floor((minutesUntilStart - PATIENT_CANCEL_BEFORE_MINUTES) / 60);
  const minutesUntilDeadline = Math.floor((minutesUntilStart - PATIENT_CANCEL_BEFORE_MINUTES) % 60);

  const canJoinVideo =
    appointment?.appointmentType === 'VIDEO' &&
    appointment.status &&
    ['CONFIRMED', 'CHECKED_IN', 'IN_PROGRESS'].includes(appointment.status);

  const symptomsText = !appointment?.symptoms || appointment.symptoms.length === 0 ? '---' : appointment.symptoms.join(', ');

  const handleConfirmCancel = async (reason: string) => {
    if (!appointment) return;

    try {
      await cancelAppointmentMutation.mutateAsync({
        appointmentId: appointment.id,
        payload: { reason },
      });
      setShowCancelModal(false);
      await appointmentQuery.refetch();
    } catch {
      // Keep quiet, UI retry is available.
    }
  };

  if (appointmentQuery.isLoading) {
    return (
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="h-64 bg-slate-100 rounded-2xl animate-pulse" />
      </main>
    );
  }

  if (appointmentQuery.isError || !appointment) {
    return (
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl border border-red-200 p-8 text-center">
          <p className="text-red-600">Không tìm thấy lịch khám hoặc đã có lỗi xảy ra.</p>
          <div className="mt-4 flex items-center justify-center gap-3">
            <button type="button" onClick={() => void appointmentQuery.refetch()} className="px-4 py-2 rounded-xl border border-red-200 text-red-600 bg-red-50">
              Thử lại
            </button>
            <button type="button" onClick={() => navigate('/appointment-schedule')} className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700">
              Quay lại danh sách
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
        <Link to="/" className="hover:text-primary">Trang chủ</Link>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <Link to="/appointment-schedule" className="hover:text-primary">Lịch khám</Link>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <span className="font-medium text-slate-900">Chi tiết lịch khám</span>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between gap-3 flex-wrap">
          <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold border ${statusConfig.bgClass} ${statusConfig.textClass} ${statusConfig.borderClass}`}>
            <span className="material-symbols-outlined text-sm">{statusConfig.icon}</span>
            <span>{statusConfig.label}</span>
          </div>
          <span className="text-sm text-slate-500">Mã lịch: #{appointment.appointmentNumber || appointment.id}</span>
        </div>

        <div className="p-6 space-y-6">
          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">Thông tin lịch hẹn</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-3 text-sm">
              <div className="flex justify-between border-b border-slate-100 py-2 gap-3"><span className="text-slate-500">Ngày khám</span><span className="font-semibold text-slate-900">{formatDate(appointment.scheduledAt)}</span></div>
              <div className="flex justify-between border-b border-slate-100 py-2 gap-3"><span className="text-slate-500">Giờ khám</span><span className="font-semibold text-slate-900">{formatTime(appointment.scheduledAt)}</span></div>
              <div className="flex justify-between border-b border-slate-100 py-2 gap-3"><span className="text-slate-500">Hình thức</span><span className="font-semibold text-slate-900">{getAppointmentTypeLabel(appointment.appointmentType)}</span></div>
              <div className="flex justify-between border-b border-slate-100 py-2 gap-3"><span className="text-slate-500">Nguồn đặt lịch</span><span className="font-semibold text-slate-900">{appointment.sourceType || '---'}</span></div>
              <div className="flex justify-between border-b border-slate-100 py-2 gap-3"><span className="text-slate-500">Phí khám</span><span className="font-semibold text-slate-900">{formatMoney(appointment.feeAmount)}</span></div>
              <div className="flex justify-between border-b border-slate-100 py-2 gap-3"><span className="text-slate-500">Đã thanh toán</span><span className="font-semibold text-slate-900">{formatMoney(appointment.paidAmount)}</span></div>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">Thông tin bác sĩ và cơ sở</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-3 text-sm">
              <div className="flex justify-between border-b border-slate-100 py-2 gap-3"><span className="text-slate-500">Bác sĩ</span><span className="font-semibold text-slate-900 text-right">{appointment.doctor?.fullName || '---'}</span></div>
              <div className="flex justify-between border-b border-slate-100 py-2 gap-3"><span className="text-slate-500">Chuyên khoa</span><span className="font-semibold text-slate-900 text-right">{appointment.doctor?.specialty || '---'}</span></div>
              <div className="flex justify-between border-b border-slate-100 py-2 gap-3"><span className="text-slate-500">Cơ sở y tế</span><span className="font-semibold text-slate-900 text-right">{appointment.hospital?.name || '---'}</span></div>
              <div className="flex justify-between border-b border-slate-100 py-2 gap-3"><span className="text-slate-500">Liên hệ bác sĩ</span><span className="font-semibold text-slate-900 text-right">{appointment.doctor?.phone || appointment.doctor?.email || '---'}</span></div>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">Thông tin bệnh nhân</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-3 text-sm">
              <div className="flex justify-between border-b border-slate-100 py-2 gap-3"><span className="text-slate-500">Họ tên</span><span className="font-semibold text-slate-900 text-right">{appointment.patient?.user?.fullName || '---'}</span></div>
              <div className="flex justify-between border-b border-slate-100 py-2 gap-3"><span className="text-slate-500">Mã bệnh nhân</span><span className="font-semibold text-slate-900 text-right">{appointment.patient?.profileCode || appointment.patient?.id || '---'}</span></div>
              <div className="flex justify-between border-b border-slate-100 py-2 gap-3"><span className="text-slate-500">Điện thoại</span><span className="font-semibold text-slate-900 text-right">{appointment.patient?.user?.phone || '---'}</span></div>
              <div className="flex justify-between border-b border-slate-100 py-2 gap-3"><span className="text-slate-500">Email</span><span className="font-semibold text-slate-900 text-right">{appointment.patient?.user?.email || '---'}</span></div>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">Triệu chứng và ghi chú</h2>
            <div className="rounded-xl border border-slate-200 p-4 space-y-3 text-sm">
              <div>
                <p className="text-slate-500 mb-1">Triệu chứng</p>
                <p className="font-medium text-slate-900">{symptomsText}</p>
              </div>
              <div>
                <p className="text-slate-500 mb-1">Ghi chú bệnh nhân</p>
                {renderPatientNotes(appointment.patientNotes)}
              </div>
              {appointment.cancellationReason ? (
                <div>
                  <p className="text-slate-500 mb-1">Lý do hủy</p>
                  <p className="font-medium text-red-600">{appointment.cancellationReason}</p>
                </div>
              ) : null}
            </div>
          </section>
        </div>

        <div className="p-5 border-t border-slate-100">
          {(isConfirmed && !canCancel && !isCancelled) || showCancelWarning ? (
            <div className="mb-3 space-y-2">
              {isConfirmed && !canCancel && !isCancelled && (
                <div className="flex items-start gap-2 rounded-xl border border-orange-200 bg-orange-50 px-3 py-2">
                  <span className="material-symbols-outlined text-orange-600 text-[18px]">schedule</span>
                  <span className="text-xs leading-[18px] text-orange-700">
                    Đã quá thời hạn hủy lịch (trước 4 tiếng).
                  </span>
                </div>
              )}

              {showCancelWarning && (
                <div className="flex items-start gap-2 rounded-xl border border-yellow-200 bg-yellow-50 px-3 py-2">
                  <span className="material-symbols-outlined text-yellow-600 text-[18px]">warning</span>
                  <span className="text-xs leading-[18px] text-yellow-800">
                    Còn{' '}
                    <span className="font-bold">
                      {hoursUntilDeadline > 0
                        ? `${hoursUntilDeadline}h ${minutesUntilDeadline}p`
                        : `${minutesUntilDeadline} phút`}
                    </span>{' '}
                    để hủy lịch này.
                  </span>
                </div>
              )}
            </div>
          ) : null}

          <div className="flex flex-col-reverse sm:flex-row sm:justify-between gap-3">
            <button
              type="button"
              onClick={() => navigate('/appointment-schedule')}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50"
            >
              Quay lại danh sách
            </button>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              {canJoinVideo ? (
                <Link
                  to={`/video-call/${appointment.id}`}
                  className="px-4 py-2.5 rounded-xl border border-primary text-primary font-semibold hover:bg-primary/5 whitespace-nowrap w-full sm:w-auto text-center"
                >
                  Vào phòng khám
                </Link>
              ) : null}

              {appointment.status === 'COMPLETED' ? (
                hasReviewedThisAppointment ? (
                  <span className="px-4 py-2.5 rounded-xl bg-slate-50 text-slate-400 border border-slate-200 font-semibold flex items-center justify-center gap-2 whitespace-nowrap w-full sm:w-auto">
                    <span className="material-symbols-outlined text-sm text-slate-300">verified</span>
                    <span>Đã đánh giá</span>
                  </span>
                ) : (
                  <Link
                    to={`/appointments/review?appointmentId=${appointment.id}`}
                    className="px-4 py-2.5 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 font-semibold hover:bg-amber-100 flex items-center justify-center gap-2 transition-all whitespace-nowrap w-full sm:w-auto"
                  >
                    <span className="material-symbols-outlined text-sm">star</span>
                    <span>Đánh giá dịch vụ</span>
                  </Link>
                )
              ) : null}

              {canCancel ? (
                <button
                  type="button"
                  onClick={() => setShowCancelModal(true)}
                  disabled={cancelAppointmentMutation.isPending}
                  className="px-4 py-2.5 rounded-xl bg-red-50 text-red-600 border border-red-200 font-semibold hover:bg-red-100 disabled:opacity-60 whitespace-nowrap w-full sm:w-auto"
                >
                  {cancelAppointmentMutation.isPending ? 'Đang hủy...' : 'Hủy lịch khám'}
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <CancelAppointmentModal
        open={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleConfirmCancel}
        isPending={cancelAppointmentMutation.isPending}
      />
    </main>
  );
};

export default AppointmentScheduleDetail;
