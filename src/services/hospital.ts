import type { Doctor } from "../types/doctor";
import type { Hospital, HospitalListResponse ,HospitalDetailResponse, HospitalDoctorsResponse, } from "../types/hospital";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://dutu-pulmo-be.onrender.com";

export async function getHospitals(page = 1, limit = 9): Promise<HospitalListResponse> {
  const response = await fetch(`${API_BASE_URL}/hospitals?page=${page}&limit=${limit}`);

  if (!response.ok) {
    throw new Error("Không thể tải danh sách bệnh viện");
  }

  return response.json();
}

export async function getHospitalDetail(id: string): Promise<Hospital> {
  const res = await fetch(`${API_BASE_URL}/hospitals/${id}`);

  if (!res.ok) {
    throw new Error("Không thể lấy thông tin bệnh viện");
  }

  const result: HospitalDetailResponse = await res.json();
  return result.data;
}

export async function getDoctorsByHospital(
  hospitalId: string,
  page = 1,
  limit = 20
): Promise<Doctor[]> {
  const res = await fetch(
    `${API_BASE_URL}/hospitals/${hospitalId}/doctors?page=${page}&limit=${limit}`
  );

  if (!res.ok) {
    throw new Error("Không thể lấy danh sách bác sĩ");
  }

  const result: HospitalDoctorsResponse = await res.json();
  console.log("Hospital doctors response:", result);

  return (
    result.data?.items ||
    result.data?.data ||
    result.data?.doctors ||
    []
  );
}