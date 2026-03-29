import { api } from '@/services/api';

export type PaymentCreateResponse = {
  checkoutUrl?: string;
};

export const paymentService = {
  createPayment: async (appointmentId: string) => {
    const { data } = await api.post<PaymentCreateResponse>('/payment/create', {
      appointmentId,
    });
    return data;
  },
};

