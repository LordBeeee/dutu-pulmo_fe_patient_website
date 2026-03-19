import type { DoctorFilters } from "../types/doctor";

export const DOCTORS_PER_PAGE = 10;

export const DOCTOR_SPECIALTIES = [
  "Pulmonology",
  "Thoracic Surgery",
  "Respiratory Medicine",
  "Tuberculosis",
] as const;

export const DOCTOR_SORT_OPTIONS = [
  { label: "Mới nhất", sort: "createdAt", order: "DESC" },
  { label: "Cũ nhất", sort: "createdAt", order: "ASC" },
  { label: "Giá khám cao nhất", sort: "defaultConsultationFee", order: "DESC" },
  { label: "Giá khám thấp nhất", sort: "defaultConsultationFee", order: "ASC" },
  { label: "Đánh giá tốt nhất", sort: "averageRating", order: "DESC" },
  { label: "Đánh giá thấp nhất", sort: "averageRating", order: "ASC" },
] as const;

export const DEFAULT_DOCTOR_FILTERS: DoctorFilters = {
  search: "",
  specialty: "ALL",
  hospitalId: "",
  appointmentType: "all",
  sort: "createdAt",
  order: "DESC",
};
