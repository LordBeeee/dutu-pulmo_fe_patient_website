import { api } from '@/services/api';
import { cleanParams } from '@/utils/query';
import type { Doctor } from '@/types/doctor';
import type { AppointmentStatus } from '@/constants/appointment-status';

export type CreateAppointmentPayload = {
  timeSlotId: string;
  patientId: string;
  hospitalId: string;
  subType: string;
  sourceType: string;
  chiefComplaint: string;
  symptoms: string[];
  patientNotes: string;
};

export type CancelAppointmentPayload = {
  reason: string;
};

export type AppointmentListQuery = {
  page?: number;
  limit?: number;
  status?: AppointmentStatus;
  search?: string;
  sort?: string;
  order?: 'ASC' | 'DESC';
  startDate?: string;
  endDate?: string;
};

export type AppointmentTypeFilter = 'all' | 'online' | 'offline';

export type PublicDoctorQuery = {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  order?: 'ASC' | 'DESC';
  specialty?: string;
  hospitalId?: string;
  appointmentType?: AppointmentTypeFilter;
};

export type PublicDoctorListResponse = {
  items: Doctor[];
  meta?: {
    page: number;
    limit: number;
    totalPages: number;
    totalItems: number;
  };
};

export type AppointmentResponse = {
  id: string;
  appointmentNumber?: string;
  status: string;
  appointmentType?: string;
  scheduledAt?: string;
  doctor?: {
    id?: string;
    fullName?: string;
    avatarUrl?: string;
    specialty?: string;
    title?: string;
    phone?: string;
    email?: string;
  };
  hospital?: {
    id?: string;
    name?: string;
    address?: string;
  };
  patient?: {
    id?: string;
    profileCode?: string;
    user?: {
      fullName?: string;
      phone?: string;
      email?: string;
      gender?: string;
      dateOfBirth?: string;
    };
  };
  feeAmount?: string;
  paidAmount?: string;
  meetingUrl?: string;
  patientNotes?: string;
  doctorNotes?: string;
  cancellationReason?: string;
  symptoms?: string[];
  durationMinutes?: number;
  sourceType?: string;
  patientRating?: number;
};


export type AppointmentListResponse = {
  items: AppointmentResponse[];
  meta?: {
    page: number;
    limit: number;
    totalPages: number;
    totalItems: number;
  };
};

export const appointmentService = {
  getSpecialties: async () => {
    const { data } = await api.get<string[]>('/public/doctors/specialties');
    return data;
  },

  getPublicDoctors: async (query?: PublicDoctorQuery) => {
    const { data } = await api.get<PublicDoctorListResponse>('/public/doctors', {
      params: cleanParams(query),
    });
    return data;
  },

  getMyAppointments: async (query?: AppointmentListQuery) => {
    const { data } = await api.get<AppointmentListResponse>('/appointments/my/patient', {
      params: cleanParams(query),
    });
    return data;
  },

  getAppointmentById: async (appointmentId: string) => {
    const { data } = await api.get<AppointmentResponse>(`/appointments/${appointmentId}`);
    return data;
  },

  createAppointment: async (payload: CreateAppointmentPayload) => {
    const { data } = await api.post<AppointmentResponse>('/appointments', payload);
    return data;
  },

  cancelAppointment: async (appointmentId: string, payload: CancelAppointmentPayload) => {
    const { data } = await api.put<AppointmentResponse>(`/appointments/${appointmentId}/cancel`, payload);
    return data;
  },

  joinVideoCall: async (appointmentId: string) => {
    const { data } = await api.post<{ url: string; token: string }>(`/appointments/${appointmentId}/video/join`);
    return data;
  },

  leaveVideoCall: async (appointmentId: string) => {
    const { data } = await api.post<{ success: boolean }>(`/appointments/${appointmentId}/video/leave`);
    return data;
  },

  getVideoCallStatus: async (appointmentId: string) => {
    const { data } = await api.get<{ canJoin: boolean; message: string }>(`/appointments/${appointmentId}/video/status`);
    return data;
  },
};
