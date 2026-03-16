import type { DoctorDetail, DoctorDetailApiResponse, DoctorFilters, DoctorsResponse } from "../types/doctor";
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://dutu-pulmo-be.onrender.com";

const BASE_URL = `${API_BASE_URL}/public/doctors`;

export async function getDoctors(
  page: number,
  filters: DoctorFilters
): Promise<DoctorsResponse> {
  const params = new URLSearchParams();

  params.set("page", String(page));
  params.set("limit", "10");
  params.set("sort", filters.sort);
  params.set("order", filters.order);

  if (filters.search) {
    params.set("search", filters.search);
  }

  if (filters.specialty !== "ALL") {
    params.set("specialty", filters.specialty);
  }

  if (filters.appointmentType !== "all") {
    params.set("appointmentType", filters.appointmentType);
  }

  const res = await fetch(`${BASE_URL}?${params.toString()}`);

  if (!res.ok) {
    throw new Error("Failed to fetch doctors");
  }

  return res.json();
}

export async function getPublicDoctorDetail(id: string): Promise<DoctorDetail> {
  const response = await fetch(`${API_BASE_URL}/public/doctors/${id}`);

  if (!response.ok) {
    throw new Error("Không tìm thấy thông tin bác sĩ");
  }

  const result: DoctorDetailApiResponse = await response.json();

  if (!result?.data) {
    throw new Error("Dữ liệu bác sĩ không hợp lệ");
  }

  return result.data;
}