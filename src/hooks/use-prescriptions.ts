import { useQuery } from '@tanstack/react-query';
import medicalService from '@/services/medical.service';
import { useAuthStore } from '@/store/auth.store';

export const usePrescriptions = () => {
  const { user } = useAuthStore();
  const patientId = user?.patientId;

  return useQuery({
    queryKey: ['prescriptions', patientId],
    queryFn: () => medicalService.getPatientPrescriptions(patientId!),
    enabled: !!patientId,
  });
};

export const usePrescriptionDetail = (prescriptionId?: string) => {
  return useQuery({
    queryKey: ['prescription', prescriptionId],
    queryFn: () => medicalService.getPrescriptionDetail(prescriptionId!),
    enabled: !!prescriptionId,
  });
};

export const usePrescriptionPdf = (prescriptionId?: string) => {
  return useQuery({
    queryKey: ['prescription-pdf', prescriptionId],
    queryFn: () => medicalService.getPrescriptionPdf(prescriptionId!),
    enabled: !!prescriptionId,
  });
};
