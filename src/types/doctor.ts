export interface Doctor {
  id: string;
  fullName: string;
  gender: "MALE" | "FEMALE";
  avatarUrl: string | null;
  title: string | null;
  specialty: string;
  yearsOfExperience: number;
  address: string | null;
  defaultConsultationFee: string;
  bio?: string | null;
  email?: string | null;
  phone?: string | null;
  averageRating?: string;
  totalReviews?: number;
  hasOfflineFutureSlots?: boolean;
  hasOnlineFutureSlots?: boolean;
  primaryHospital?: {
    id: string;
    name: string;
    hospitalCode?: string;
    phone?: string;
    email?: string;
    address?: string | null;
  };
}

export interface DoctorsResponse {
  data: {
    items: Doctor[];
    meta: {
      page: number;
      limit: number;
      totalPages: number;
      totalItems: number;
    };
  };
}

export interface DoctorFilters {
  search: string;
  specialty: string;
  appointmentType: "all" | "online" | "offline";
  sort: string;
  order: "ASC" | "DESC";
}

// For doctor detail page
export interface LicenseImage {
  url?: string;
  expiry?: string;
}

export interface Certification {
  name?: string;
  issuer?: string;
  year?: number;
}

export interface TrainingUnit {
  url?: string;
  name?: string;
}

export interface Hospital {
  id?: string;
  name?: string;
  hospitalCode?: string;
  address?: string;
  phone?: string;
}

export interface DoctorDetail {
  id?: string;
  userId?: string;
  fullName?: string;
  phone?: string;
  email?: string;
  dateOfBirth?: string;
  gender?: "MALE" | "FEMALE" | string;
  avatarUrl?: string | null;
  status?: string;
  CCCD?: string;
  province?: string;
  ward?: string;
  address?: string;
  practiceStartYear?: number;
  licenseNumber?: string;
  licenseImageUrls?: LicenseImage[];
  title?: string;
  position?: string;
  specialty?: string;
  yearsOfExperience?: number;
  primaryHospitalId?: string;
  primaryHospital?: Hospital;
  expertiseDescription?: string;
  bio?: string;
  workExperience?: string;
  education?: string;
  certifications?: Certification[];
  awardsResearch?: string;
  trainingUnits?: TrainingUnit[];
  averageRating?: string;
  totalReviews?: number;
  verifiedAt?: string | null;
  defaultConsultationFee?: string;
  hasOnlineFutureSlots?: boolean;
  hasOfflineFutureSlots?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface DoctorDetailApiResponse {
  success?: boolean;
  message?: string;
  data?: DoctorDetail;
}