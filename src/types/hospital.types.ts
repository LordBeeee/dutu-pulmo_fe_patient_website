export type HospitalQueryDto = {
  page?: number;
  limit?: number;
  city?: string;
  search?: string;
};

export type HospitalResponseDto = {
  id: string;
  name: string;
  address?: string;
  province?: string;
  logoUrl?: string;
  phone?: string;
  email?: string;
};

export type HospitalDoctorResponseDto = {
  id: string;
  fullName: string;
  avatarUrl?: string | null;
  specialty?: string;
  title?: string | null;
};

export type PaginatedHospitalResponseDto = {
  items: HospitalResponseDto[];
  meta?: {
    page: number;
    limit: number;
    totalPages: number;
    totalItems: number;
  };
};

export type PaginatedHospitalDoctorResponseDto = {
  items: HospitalDoctorResponseDto[];
  meta?: {
    page: number;
    limit: number;
    totalPages: number;
    totalItems: number;
  };
};
