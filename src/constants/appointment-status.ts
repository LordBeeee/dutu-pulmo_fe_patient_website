export type AppointmentStatus =
  | "CONFIRMED"
  | "CANCELLED"
  | "PENDING_PAYMENT"
  | "PENDING"
  | "CHECKED_IN"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "RESCHEDULED";

export type AppointmentStatusFilter =
  | "ALL"
  | "CONFIRMED"
  | "PENDING"
  | "COMPLETED"
  | "CANCELLED";

export type AppointmentStatusConfig = {
  label: string;
  icon: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
};

export const APPOINTMENT_STATUS_CONFIG: Record<
  string,
  AppointmentStatusConfig
> = {
  CONFIRMED: {
    label: "Đã xác nhận",
    icon: "check_circle",
    bgClass: "bg-green-50",
    textClass: "text-green-700",
    borderClass: "border-green-200",
  },
  PENDING: {
    label: "Chờ xác nhận",
    icon: "schedule",
    bgClass: "bg-amber-50",
    textClass: "text-amber-700",
    borderClass: "border-amber-200",
  },
  PENDING_PAYMENT: {
    label: "Chờ thanh toán",
    icon: "payments",
    bgClass: "bg-amber-50",
    textClass: "text-amber-700",
    borderClass: "border-amber-200",
  },
  COMPLETED: {
    label: "Hoàn thành",
    icon: "done_all",
    bgClass: "bg-blue-50",
    textClass: "text-blue-700",
    borderClass: "border-blue-200",
  },
  CANCELLED: {
    label: "Đã hủy",
    icon: "cancel",
    bgClass: "bg-red-50",
    textClass: "text-red-600",
    borderClass: "border-red-200",
  },
  CHECKED_IN: {
    label: "Đã check-in",
    icon: "how_to_reg",
    bgClass: "bg-indigo-50",
    textClass: "text-indigo-700",
    borderClass: "border-indigo-200",
  },
  IN_PROGRESS: {
    label: "Đang khám",
    icon: "medical_services",
    bgClass: "bg-indigo-50",
    textClass: "text-indigo-700",
    borderClass: "border-indigo-200",
  },
  RESCHEDULED: {
    label: "Đã dời lịch",
    icon: "event_repeat",
    bgClass: "bg-orange-50",
    textClass: "text-orange-700",
    borderClass: "border-orange-200",
  },
};

export const FALLBACK_APPOINTMENT_STATUS = APPOINTMENT_STATUS_CONFIG.PENDING;

export const APPOINTMENT_STATUS_FILTER_OPTIONS: Array<{
  key: AppointmentStatusFilter;
  label: string;
}> = [
  { key: "ALL", label: "Tất cả" },
  { key: "CONFIRMED", label: "Đã xác nhận" },
  { key: "PENDING", label: "Chờ xác nhận" },
  { key: "COMPLETED", label: "Đã hoàn thành" },
  { key: "CANCELLED", label: "Đã hủy" },
];

export const APPOINTMENT_STATUS_OPTIONS: Array<{
  value: AppointmentStatus;
  label: string;
}> = [
  {
    value: "PENDING_PAYMENT",
    label: APPOINTMENT_STATUS_CONFIG.PENDING_PAYMENT.label,
  },
  { value: "PENDING", label: APPOINTMENT_STATUS_CONFIG.PENDING.label },
  { value: "CONFIRMED", label: APPOINTMENT_STATUS_CONFIG.CONFIRMED.label },
  { value: "CHECKED_IN", label: APPOINTMENT_STATUS_CONFIG.CHECKED_IN.label },
  { value: "IN_PROGRESS", label: APPOINTMENT_STATUS_CONFIG.IN_PROGRESS.label },
  { value: "COMPLETED", label: APPOINTMENT_STATUS_CONFIG.COMPLETED.label },
  { value: "CANCELLED", label: APPOINTMENT_STATUS_CONFIG.CANCELLED.label },
  { value: "RESCHEDULED", label: APPOINTMENT_STATUS_CONFIG.RESCHEDULED.label },
];

export function getAppointmentStatusConfig(
  status?: string,
): AppointmentStatusConfig {
  if (!status) return FALLBACK_APPOINTMENT_STATUS;
  return APPOINTMENT_STATUS_CONFIG[status] ?? FALLBACK_APPOINTMENT_STATUS;
}

export function getAppointmentTypeLabel(type?: string): string {
  switch (type) {
    case "VIDEO":
      return "Khám video";
    case "IN_CLINIC":
      return "Khám tại cơ sở";
    default:
      return type || "---";
  }
}

export const PATIENT_CANCEL_BEFORE_MINUTES = 4 * 60;

export function canCancelAppointment(status?: string): boolean {
  if (!status) return false;

  if (["PENDING", "PENDING_PAYMENT"].includes(status)) return true;

  return false;
}
