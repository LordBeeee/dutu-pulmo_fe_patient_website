import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

import PaymentMethodList from '@/components/appointment/appointmentsuccess/PaymentMethodList';
import PaymentSecurityNotice from '@/components/appointment/appointmentsuccess/PaymentSecurityNotice';
import { useAppointmentDetail } from '@/hooks/use-appointments';
import { useCreatePayment } from '@/hooks/use-payment';

function formatDateTime(date?: string) {
  if (!date) return '---';
  return new Date(date).toLocaleString('vi-VN', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatCurrency(amount?: string | number) {
  const num = Number(amount || 0);
  if (!num) return 'Liên hệ';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(num);
}

export default function PaymentPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const appointmentId = searchParams.get('appointmentId');
  const [loading, setLoading] = useState(false);

  const { data: appointment, isLoading, isError } = useAppointmentDetail(
    appointmentId ?? ''
  );
  const createPaymentMutation = useCreatePayment();

  // Guard: nếu không có appointmentId
  useEffect(() => {
    if (!appointmentId) {
      toast.error('Không tìm thấy thông tin lịch khám');
      navigate('/appointment-schedule');
    }
  }, [appointmentId, navigate]);

  // Guard: nếu appointment không phải PENDING_PAYMENT
  useEffect(() => {
    if (!appointment) return;
    if (appointment.status !== 'PENDING_PAYMENT') {
      toast.info('Lịch khám này không cần thanh toán');
      navigate(`/appointment-schedule/${appointment.id}`);
    }
  }, [appointment, navigate]);

  const handlePayNow = async () => {
    if (!appointmentId) return;

    try {
      setLoading(true);

      const payment = await createPaymentMutation.mutateAsync(appointmentId);
      const checkoutUrl = payment?.checkoutUrl;

      if (!checkoutUrl) {
        throw new Error('Không nhận được link thanh toán từ hệ thống.');
      }

      // Lưu context để PaymentSuccess hiển thị đúng
      localStorage.setItem(
        'payment_success_context',
        JSON.stringify({
          appointment,
          doctor: appointment?.doctor,
          user: null, // Case simple
          selectedDate: appointment?.scheduledAt,
          selectedSlot: null,
        })
      );
      localStorage.setItem('currentAppointmentId', appointmentId);

      window.location.href = checkoutUrl;
    } catch (error) {
      const errorMessage =
        error instanceof Error && (error as any).response?.data?.message
          ? typeof (error as any).response.data.message === 'string'
            ? (error as any).response.data.message
            : (error as any).response.data.message.message
          : error instanceof Error
            ? error.message
            : 'Có lỗi xảy ra khi tạo thanh toán';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <main className="flex-grow py-8 px-4">
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="h-48 bg-slate-100 rounded-2xl animate-pulse" />
          <div className="h-64 bg-slate-100 rounded-2xl animate-pulse" />
        </div>
      </main>
    );
  }

  // Error state
  if (isError || !appointment) {
    return (
      <main className="flex-grow flex items-center justify-center py-8 px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-red-500 text-3xl">error</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Không tìm thấy lịch khám</h2>
          <p className="text-slate-500 mb-6">
            Lịch khám không tồn tại hoặc bạn không có quyền truy cập.
          </p>
          <Link
            to="/appointment-schedule"
            className="px-6 py-3 bg-primary text-white rounded-xl font-bold"
          >
            Xem danh sách lịch khám
          </Link>
        </div>
      </main>
    );
  }

  const fee = Number(appointment.feeAmount || 0);

  return (
    <main className="flex-grow py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Link to="/" className="hover:text-primary">Trang chủ</Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <Link to="/appointment-schedule" className="hover:text-primary">Lịch khám</Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span className="font-medium text-slate-900">Thanh toán</span>
        </div>

        {/* Thông tin lịch khám */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">
            Thông tin lịch khám
          </h2>

          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0">
              {appointment.doctor?.avatarUrl ? (
                <img
                  src={appointment.doctor.avatarUrl}
                  alt={appointment.doctor.fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400">
                  <span className="material-symbols-outlined text-3xl">person</span>
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-xs text-slate-400 mb-0.5">
                {appointment.doctor?.title || 'Bác sĩ'}
              </p>
              <h3 className="font-bold text-slate-900">
                {appointment.doctor?.fullName || '---'}
              </h3>
              <p className="text-sm text-primary font-medium">
                {appointment.doctor?.specialty || '---'}
              </p>
            </div>

            <div className="text-right shrink-0">
              <p className="text-xs text-slate-400 mb-1">Mã lịch</p>
              <p className="text-xs font-mono font-semibold text-slate-700">
                #{appointment.appointmentNumber || appointment.id?.slice(-8)}
              </p>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-slate-400 text-xs mb-1">Thời gian khám</p>
              <p className="font-semibold text-slate-900">
                {formatDateTime(appointment.scheduledAt)}
              </p>
            </div>
          </div>
        </div>

        {/* Tổng tiền */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">
            Chi tiết thanh toán
          </h2>

          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Phí khám</span>
              <span className="font-semibold">{formatCurrency(appointment.feeAmount)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Phí tiện ích</span>
              <span className="font-semibold text-green-600">Miễn phí</span>
            </div>
            <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
              <span className="font-bold">Tổng thanh toán</span>
              <span className="text-2xl font-bold text-primary">
                {formatCurrency(fee)}
              </span>
            </div>
          </div>
        </div>

        {/* Payment methods - tái sử dụng component có sẵn */}
        <PaymentMethodList />

        {/* Security notice */}
        <PaymentSecurityNotice />

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={() => navigate(`/appointment-schedule/${appointmentId}`)}
            className="flex-1 py-4 border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors"
          >
            Quay lại
          </button>
          <button
            type="button"
            onClick={handlePayNow}
            disabled={loading}
            className="flex-[2] py-4 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/25 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Đang tạo link...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-xl">payments</span>
                Thanh toán {formatCurrency(fee)}
              </>
            )}
          </button>
        </div>
      </div>
    </main>
  );
}
