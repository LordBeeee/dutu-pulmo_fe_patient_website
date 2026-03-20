import { useAppointments } from '@/hooks/use-appointments';

export function usePendingPaymentAppointments() {
  return useAppointments({
    status: 'PENDING_PAYMENT',
    limit: 5,
    sort: 'createdAt',
    order: 'DESC',
  });
}
