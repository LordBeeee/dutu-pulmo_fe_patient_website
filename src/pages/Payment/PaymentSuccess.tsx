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

function formatAppointmentDate(dateString?: string) {
  if (!dateString) return "--";
  const date = new Date(dateString);

  const weekday = new Intl.DateTimeFormat("vi-VN", {
    weekday: "long",
    timeZone: "Asia/Ho_Chi_Minh",
  }).format(date);

  const datePart = new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "Asia/Ho_Chi_Minh",
  }).format(date);

  return `${weekday}, ${datePart}`;
}

function formatBirthDate(dateString?: string) {
  if (!dateString) return "--";
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(dateString));
}

function formatGender(gender?: string) {
  if (!gender) return "--";

  const value = gender.toLowerCase();
  if (value === "male") return "Nam";
  if (value === "female") return "Nữ";
  return gender;
}

function getDoctorAvatar(doctor?: any) {
  return (
    doctor?.avatarUrl ||
    "https://via.placeholder.com/150?text=Doctor"
  );
}

import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { useAppointmentDetail } from "../../hooks/use-appointments";

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const code = searchParams.get("code");
  const status = searchParams.get("status");
  const cancel = searchParams.get("cancel");
  const paymentId = searchParams.get("id");

  // Priority: URL Param > LocalStorage
  const appointmentId =
    searchParams.get("appointmentId") ||
    localStorage.getItem("currentAppointmentId") ||
    "";

  const appointmentQuery = useAppointmentDetail(appointmentId);
  const appointment = appointmentQuery.data;

  useEffect(() => {
    // Clear context after reading to prevent stale data on future visits
    localStorage.removeItem("payment_success_context");
    localStorage.removeItem("currentAppointmentId");

    // Guard: Redirect if direct access (no payment code from PayOS)
    if (!code) {
      navigate("/appointment-schedule", { replace: true });
    }
  }, [code, navigate]);

  const isPaid =
    code === "00" && status === "PAID" && (cancel === "false" || !cancel);
  const isCancelled = cancel === "true" || status === "CANCELLED";
  const isFailed = !isPaid && !isCancelled && code !== null;

  // Loading state
  if (appointmentQuery.isLoading) {
    return (
      <main className="flex-grow flex items-center justify-center p-6 md:p-12">
        <div className="max-w-xl w-full bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-4">
          <div className="w-20 h-20 bg-slate-100 rounded-full animate-pulse mx-auto" />
          <div className="h-8 bg-slate-100 rounded animate-pulse w-3/4 mx-auto" />
          <div className="h-4 bg-slate-100 rounded animate-pulse w-1/2 mx-auto" />
          <div className="space-y-2 pt-4">
            <div className="h-12 bg-slate-100 rounded animate-pulse" />
            <div className="h-12 bg-slate-100 rounded animate-pulse" />
          </div>
        </div>
      </main>
    );
  }

  // Error/Missing data state
  if (appointmentQuery.isError || !appointment) {
    return (
      <main className="flex-grow flex items-center justify-center p-6 md:p-12">
        <div className="max-w-xl w-full bg-white rounded-2xl border border-slate-200 p-8 text-center">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
            isPaid ? "bg-green-100 text-green-500" : 
            isCancelled ? "bg-amber-100 text-amber-500" : 
            isFailed ? "bg-red-100 text-red-500" :
            "bg-slate-100 text-slate-500"
          }`}>
            <span className="material-icons-round text-5xl">
              {isPaid ? "check_circle" : isCancelled ? "info" : isFailed ? "error" : "help_outline"}
            </span>
          </div>
          <h2 className={`text-2xl font-bold mb-2 ${
            isPaid ? "text-green-600" : 
            isCancelled ? "text-amber-600" : 
            isFailed ? "text-red-600" :
            "text-slate-600"
          }`}>
            {isPaid ? "Thanh toán thành công" : isCancelled ? "Đã hủy thanh toán" : isFailed ? "Thanh toán thất bại" : "Trạng thái thanh toán"}
          </h2>

          <p className="text-slate-500 text-sm mb-6">
            {formatDateTimeNow()}
          </p>

          <div className="bg-slate-50 rounded-xl p-4 text-left space-y-3 mb-6">
            <div className="flex justify-between">
              <span className="text-slate-500">Mã giao dịch</span>
              <span className="font-medium">{paymentId || "--"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Trạng thái</span>
              <span className="font-medium">{status || (isPaid ? "Thành công" : isFailed ? "Thất bại" : "Đã hủy")}</span>
            </div>
          </div>

          <button
            onClick={() => navigate("/")}
            className="bg-primary text-white py-3 px-6 rounded-xl font-bold hover:opacity-90 transition-opacity"
          >
            Về trang chủ
          </button>
        </div>
      </main>
    );
  }

  // Success path with appointment data
  const doctor = appointment.doctor;
  const userInner = appointment.patient?.user;

  const doctorName = doctor?.fullName || "Bác sĩ Duy Tu";
  const doctorAvatar = getDoctorAvatar(doctor as any);
  const patientName = userInner?.fullName || "--";
  const patientPhone = userInner?.phone || "--";
  const patientDob = formatBirthDate(userInner?.dateOfBirth);
  const patientGender = formatGender(userInner?.gender);

  const appointmentCode = appointment.appointmentNumber || appointment.id;
  const appointmentDate = formatAppointmentDate(appointment.scheduledAt);
  const slotTime = appointment.scheduledAt 
    ? `${new Date(appointment.scheduledAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}` 
    : "--";

  const qrImage =
    "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=" +
      encodeURIComponent(appointmentCode);

  const handleCopy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success("Đã sao chép");
    } catch (error) {
      const errorMessage =
        error instanceof Error && (error as any).response?.data?.message
          ? typeof (error as any).response.data.message === 'string'
            ? (error as any).response.data.message
            : (error as any).response.data.message.message
          : error instanceof Error
            ? error.message
            : 'Không thể sao chép';
      console.error(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <main className="flex-grow flex items-center justify-center p-6 md:p-12">
      <div className="max-w-2xl w-full flex flex-col items-center">
        <div className="flex flex-col items-center mb-8 text-center">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 ${
            isPaid ? "bg-green-100 dark:bg-green-900/30 text-green-500" : 
            isCancelled ? "bg-amber-100 dark:bg-amber-900/30 text-amber-500" : 
            isFailed ? "bg-red-100 dark:bg-red-900/30 text-red-500" :
            "bg-slate-100 dark:bg-slate-800/30 text-slate-500"
          }`}>
            <span className="material-icons-round text-5xl">
              {isPaid ? "check_circle" : isCancelled ? "info" : isFailed ? "error" : "help_outline"}
            </span>
          </div>

          <h2 className={`text-2xl font-bold mb-1 ${
            isPaid ? "text-green-600 dark:text-green-400" : 
            isCancelled ? "text-amber-600 dark:text-amber-400" : 
            isFailed ? "text-red-600 dark:text-red-400" :
            "text-slate-600 dark:text-slate-400"
          }`}>
            {isPaid ? "Thanh toán thành công" : isCancelled ? "Đã hủy thanh toán" : isFailed ? "Thanh toán thất bại" : "Trạng thái thanh toán"}
          </h2>

          <p className="text-slate-500 dark:text-slate-400 text-sm">
            {formatDateTimeNow()}
          </p>
        </div>

        <div className="bg-card-light dark:bg-card-dark w-full ticket-shadow rounded-2xl overflow-hidden">
          <div className="p-10 flex flex-col items-center bg-slate-50/50 dark:bg-white/5 border-b border-dashed border-slate-200 dark:border-slate-700">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
              <img
                alt="QR Code for appointment check-in"
                className="w-40 h-40"
                src={qrImage}
              />
            </div>
            <p className="mt-4 text-xs font-medium uppercase tracking-widest text-slate-400 dark:text-slate-500">
              Mã QR Check-in tại quầy
            </p>
          </div>

          <div className="p-8 md:p-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <img
                    alt={doctorName}
                    className="w-16 h-16 rounded-full object-cover ring-4 ring-primary/10"
                    src={doctorAvatar}
                  />
                  <div>
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                      Bác sĩ
                    </p>
                    <p className="text-lg font-bold text-primary">
                      {doctorName}
                    </p>
                    <p className="text-sm text-slate-500">
                      {doctor?.specialty || ""}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wider mb-1">
                      Mã lịch khám
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-semibold text-slate-700 dark:text-slate-200">
                        {appointmentCode}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(appointmentCode)}
                        className="text-slate-400 hover:text-primary transition-colors"
                      >
                        <span className="material-icons-round text-[18px]">
                          content_copy
                        </span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wider mb-1">
                      Ngày khám
                    </p>
                    <span className="font-semibold text-slate-700 dark:text-slate-200">
                      {appointmentDate}
                    </span>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wider mb-1">
                      Giờ khám
                    </p>
                    <span className="font-semibold text-slate-700 dark:text-slate-200">
                      {slotTime}
                    </span>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wider mb-1">
                      Trạng thái thanh toán
                    </p>
                    <span className={`font-semibold ${
                      isPaid ? "text-green-600" : 
                      isCancelled ? "text-amber-600" : 
                      isFailed ? "text-red-600" :
                      "text-slate-600"
                    }`}>
                      {status || (isPaid ? "PAID" : isCancelled ? "CANCELLED" : isFailed ? "FAILED" : "--")}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2 mb-4">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                      Thông tin bệnh nhân
                    </h3>
                    <span className="material-icons-round text-slate-300 text-sm">
                      expand_less
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-baseline gap-4">
                      <span className="text-sm text-slate-500 dark:text-slate-400">
                        Họ và tên
                      </span>
                      <span className="font-semibold text-slate-700 dark:text-slate-200 text-right">
                        {patientName}
                      </span>
                    </div>

                    <div className="flex justify-between items-baseline gap-4">
                      <span className="text-sm text-slate-500 dark:text-slate-400">
                        Ngày sinh
                      </span>
                      <span className="font-semibold text-slate-700 dark:text-slate-200 text-right">
                        {patientDob}
                      </span>
                    </div>

                    <div className="flex justify-between items-baseline gap-4">
                      <span className="text-sm text-slate-500 dark:text-slate-400">
                        Giới tính
                      </span>
                      <span className="font-semibold text-slate-700 dark:text-slate-200 text-right">
                        {patientGender}
                      </span>
                    </div>

                    <div className="flex justify-between items-baseline gap-4">
                      <span className="text-sm text-slate-500 dark:text-slate-400">
                        Số điện thoại
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-700 dark:text-slate-200">
                          {patientPhone}
                        </span>
                        {patientPhone !== "--" && (
                          <button
                            type="button"
                            onClick={() => handleCopy(patientPhone)}
                            className="text-slate-400 hover:text-primary transition-colors"
                          >
                            <span className="material-icons-round text-[16px]">
                              content_copy
                            </span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 text-center">
              <button
                type="button"
                onClick={() => navigate(`/appointment-schedule/${appointmentId}`)}
                className="text-primary font-semibold text-sm hover:underline underline-offset-4 decoration-2"
              >
                Xem chi tiết lịch khám
              </button>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 w-full">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex-1 bg-white dark:bg-slate-800 text-slate-700 dark:text-white border border-slate-200 dark:border-slate-700 py-4 px-6 rounded-xl font-bold shadow-sm hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
          >
            Về trang chủ
          </button>

          <button
            type="button"
            onClick={() => navigate("/chat")}
            className="flex-1 bg-primary text-white py-4 px-6 rounded-xl font-bold shadow-lg shadow-primary/25 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <span className="material-icons-round text-xl">chat_bubble</span>
            Chat với bác sĩ
          </button>
        </div>
      </div>
    </main>
  );
}


