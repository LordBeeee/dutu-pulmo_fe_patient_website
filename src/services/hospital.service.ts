import { api } from '@/services/api';
import { cleanParams } from '@/utils/query';
import type {
  HospitalQueryDto,
  HospitalResponseDto,
  PaginatedHospitalDoctorResponseDto,
  PaginatedHospitalResponseDto,
} from '@/types/hospital.types';

export const hospitalService = {
  getHospitals: async (query?: HospitalQueryDto) => {
    const { data } = await api.get<PaginatedHospitalResponseDto>('/hospitals', {
      params: cleanParams(query),
    });
    return data;
  },

  getHospitalById: async (hospitalId: string) => {
    const { data } = await api.get<HospitalResponseDto>(`/hospitals/${hospitalId}`);
    return data;
  },

  getHospitalDoctors: async (hospitalId: string, page?: number, limit?: number) => {
    const { data } = await api.get<PaginatedHospitalDoctorResponseDto>(`/hospitals/${hospitalId}/doctors`, {
      params: cleanParams({ page, limit }),
    });
    return data;
  },

  getCities: async () => {
    const { data } = await api.get<string[]>('/hospitals/cities');
    return data;
  },
};

export default hospitalService;
