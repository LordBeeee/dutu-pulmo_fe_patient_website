import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAppointmentDetail } from "../../hooks/use-appointments";

function formatDateTimeNow() {
  return new Intl.DateTimeFormat("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date());
}

export default function PaymentCancel() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Extract appointment ID from URL
  const appointmentId = searchParams.get("appointmentId") || "";

  const appointmentQuery = useAppointmentDetail(appointmentId);
  const appointment = appointmentQuery.data;

  useEffect(() => {
    // Clear context after reading to prevent stale data
    localStorage.removeItem("payment_success_context");
    localStorage.removeItem("currentAppointmentId");

    // Guard: if no appointmentId is provided, just show the cancel UI without fetching
  }, []);

  // Loading state
  if (appointmentQuery.isLoading && appointmentId) {
    return (
      <main className="flex-grow flex items-center justify-center p-6 md:p-12">
        <div className="max-w-xl w-full bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-4">
          <div className="w-20 h-20 bg-slate-100 rounded-full animate-pulse mx-auto" />
          <div className="h-8 bg-slate-100 rounded animate-pulse w-3/4 mx-auto" />
        </div>
      </main>
    );
  }

  const doctorName = appointment?.doctor?.fullName || "Bác sĩ";
  const appointmentCode = appointment?.appointmentNumber || appointment?.id || "--";

  return (
    <main className="flex-grow flex items-center justify-center p-6 md:p-12">
      <div className="max-w-xl w-full flex flex-col items-center">
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4 bg-amber-100 dark:bg-amber-900/30 text-amber-500">
            <span className="material-icons-round text-5xl">info</span>
          </div>

          <h2 className="text-2xl font-bold mb-1 text-amber-600 dark:text-amber-400">
            Đã hủy thanh toán
          </h2>

          <p className="text-slate-500 dark:text-slate-400 text-sm">
            {formatDateTimeNow()}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 w-full ticket-shadow rounded-2xl border border-slate-200 dark:border-slate-800 p-8 text-center space-y-4">
          <p className="text-slate-600 dark:text-slate-300">
            Bạn đã hủy quá trình thanh toán cho lịch khám{appointmentId ? ` với ${doctorName}` : ""}.
          </p>
          <p className="text-sm text-slate-500">
            Lịch khám của bạn (Mã: <strong>{appointmentCode}</strong>) vẫn đang ở trạng thái chờ thanh toán. Vui lòng thanh toán để hoàn tất đặt lịch.
          </p>

          <div className="mt-8 flex flex-col gap-3">
            <button
              onClick={() => appointmentId ? navigate(`/payment?appointmentId=${appointmentId}`) : navigate("/appointments")}
              className="w-full bg-primary text-white py-3 px-6 rounded-xl font-bold hover:opacity-90 transition-opacity"
            >
              Thanh toán lại
            </button>
            <button
              onClick={() => navigate("/appointment-schedule")}
              className="w-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 py-3 px-6 rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              Xem danh sách lịch khám
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
