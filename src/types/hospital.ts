// export interface Hospital {
//   id: string;
//   name: string;
//   hospitalCode?: string;
//   address?: string;
//   phone?: string;
//   email?: string;
//   province?: string;
//   ward?: string;
//   latitude?: string;
//   longitude?: string;
//   logoUrl?: string | null;
//   createdAt?: string;
//   updatedAt?: string;

import type { Doctor } from "./doctor";

// }
export interface Hospital {
  id: string;
  name: string;
  hospitalCode: string;
  phone: string;
  email: string;
  address: string;
  ward: string;
  province: string;
  latitude: string;
  longitude: string;
  logoUrl: string;
  createdAt: string;
  updatedAt: string;
}
export interface HospitalListResponse {
  data: {
    items: Hospital[];
    meta: {
      page: number;
      limit: number;
      totalItems: number;
      totalPages: number;
    };
  };
}

export interface HospitalDetailResponse {
  code: number;
  message: string;
  data: Hospital;
}

export interface HospitalDoctorsResponse {
  code: number;
  message: string;
  data: {
    items?: Doctor[];
    data?: Doctor[];
    doctors?: Doctor[];
  };
}