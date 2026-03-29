import { useQuery } from '@tanstack/react-query';

import { doctorService } from '@/services/doctor';
import type { AppointmentTypeFilter } from '@/services/doctor';
import type { DoctorFilters } from '@/types/doctor';

export const doctorKeys = {
  list: (page: number, filters: DoctorFilters) => ['doctors', 'public', page, filters] as const,
  detail: (id: string) => ['doctors', 'detail', id] as const,
  slots: (doctorId: string, date: string, appointmentType: AppointmentTypeFilter) =>
    ['doctors', 'slots', doctorId, date, appointmentType] as const,
  summary: (doctorId: string, from: string, to: string, appointmentType: AppointmentTypeFilter) =>
    ['doctors', 'slot-summary', doctorId, from, to, appointmentType] as const,
};

export function useDoctors(page: number, filters: DoctorFilters) {
  return useQuery({
    queryKey: doctorKeys.list(page, filters),
    queryFn: () => doctorService.getDoctors(page, filters),
  });
}

export function usePublicDoctorDetail(doctorId?: string) {
  return useQuery({
    queryKey: doctorKeys.detail(doctorId || ''),
    queryFn: () => doctorService.getPublicDoctorDetail(doctorId || ''),
    enabled: Boolean(doctorId),
  });
}

export function useDoctorAvailableSlots(
  doctorId?: string,
  date?: string,
  appointmentType: AppointmentTypeFilter = 'all',
) {
  return useQuery({
    queryKey: doctorKeys.slots(doctorId || '', date || '', appointmentType),
    queryFn: () =>
      doctorService.getDoctorAvailableTimeSlots(doctorId || '', date || '', appointmentType),
    enabled: Boolean(doctorId && date),
  });
}

export function useDoctorSlotSummary(
  doctorId?: string,
  from?: string,
  to?: string,
  appointmentType: AppointmentTypeFilter = 'all',
) {
  return useQuery({
    queryKey: doctorKeys.summary(doctorId || '', from || '', to || '', appointmentType),
    queryFn: () =>
      doctorService.getDoctorTimeSlotSummary(doctorId || '', from || '', to || '', appointmentType),
    enabled: Boolean(doctorId && from && to),
  });
}
