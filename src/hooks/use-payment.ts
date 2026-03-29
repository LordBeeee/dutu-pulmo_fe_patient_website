import { useMutation } from '@tanstack/react-query';

import { paymentService } from '@/services/payment.service';

export function useCreatePayment() {
  return useMutation({
    mutationFn: (appointmentId: string) => paymentService.createPayment(appointmentId),
  });
}

