import type { Doctor } from "./doctor";
import type { HospitalResponseDto } from "./hospital.types";

export interface FavoriteResponseDto {
  id: string;
  userId: string;
  doctorId?: string;
  hospitalId?: string;
  doctor?: Doctor;
  hospital?: HospitalResponseDto;
  createdAt: string;
}

export interface CreateFavoriteDto {
  doctorId?: string;
  hospitalId?: string;
}
